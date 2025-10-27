import { GoogleGenerativeAI } from '@google/generative-ai';
import connectDB from '@/lib/mongodb';
import AIUsage from '@/models/AIUsage';

class GeminiService {
  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      console.warn('⚠️ GEMINI_API_KEY not found in environment variables');
      this.genAI = null;
      return;
    }

    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    // Rate limiting constants
    this.DAILY_LIMIT = 250; // Max 250 calls per day (under 1000 free tier)
    this.RPM_LIMIT = 10; // Max 10 requests per minute (under 15 RPM limit)
    this.RPM_WINDOW = 60 * 1000; // 1 minute in milliseconds
  }

  /**
   * Get today's date in YYYY-MM-DD format
   */
  getTodayString() {
    return new Date().toISOString().split('T')[0];
  }

  /**
   * Check if we can make an API call (daily and RPM limits)
   */
  async canMakeAPICall() {
    try {
      await connectDB();
      const today = this.getTodayString();
      
      // Get or create today's usage record
      let usage = await AIUsage.findOne({ date: today });
      if (!usage) {
        usage = new AIUsage({ date: today, totalCalls: 0, recentCalls: [] });
      }

      // Check daily limit
      if (usage.totalCalls >= this.DAILY_LIMIT) {
        console.log(`🚫 Daily limit reached: ${usage.totalCalls}/${this.DAILY_LIMIT} calls`);
        return { canCall: false, reason: 'daily_limit' };
      }

      // Check RPM limit - count calls in the last minute
      const oneMinuteAgo = new Date(Date.now() - this.RPM_WINDOW);
      const recentCallsCount = usage.recentCalls.filter(
        call => call.timestamp && call.timestamp > oneMinuteAgo
      ).length;

      if (recentCallsCount >= this.RPM_LIMIT) {
        console.log(`🚫 RPM limit reached: ${recentCallsCount}/${this.RPM_LIMIT} calls in last minute`);
        return { canCall: false, reason: 'rpm_limit' };
      }

      return { canCall: true, usage };
    } catch (error) {
      console.error('❌ Error checking API limits:', error);
      return { canCall: false, reason: 'error' };
    }
  }

  /**
   * Record an API call in the usage tracker
   */
  async recordAPICall(usage, success = true) {
    try {
      const now = new Date();
      
      // Increment total calls
      usage.totalCalls += 1;
      usage.lastCallTimestamp = now;
      
      // Add to recent calls (keep only last 20 for efficiency)
      usage.recentCalls.push({
        timestamp: now,
        success: success,
        model: 'gemini-2.5-flash'
      });
      
      // Keep only recent calls (last hour for efficiency)
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      usage.recentCalls = usage.recentCalls
        .filter(call => call.timestamp > oneHourAgo)
        .slice(-20); // Keep only last 20 calls

      await usage.save();
      
      console.log(`📊 API call recorded: ${usage.totalCalls}/${this.DAILY_LIMIT} daily calls used`);
    } catch (error) {
      console.error('❌ Error recording API call:', error);
    }
  }

  /**
   * Generate AI-powered resume audit
   */
  async generateResumeAudit(resumeText, keywords = []) {
    let usage = null; // Declare usage at function scope
    
    try {
      // Check if service is available
      if (!this.genAI) {
        console.log('🔄 Gemini API not available, using fallback');
        return { success: false, error: 'api_not_available' };
      }

      // Check rate limits
      const rateLimitCheck = await this.canMakeAPICall();
      usage = rateLimitCheck.usage; // Store usage reference
      
      if (!rateLimitCheck.canCall) {
        console.log(`🔄 Rate limit exceeded (${rateLimitCheck.reason}), using fallback`);
        return { success: false, error: rateLimitCheck.reason };
      }

      // Prepare keywords context
      const keywordsContext = keywords.length > 0 
        ? `Target keywords to analyze: ${keywords.join(', ')}`
        : 'Analyze for general job-relevant keywords';

      // Create comprehensive prompt for resume analysis
      const prompt = `
Analyze the following resume for ATS (Applicant Tracking System) compatibility and provide a detailed assessment.

${keywordsContext}

RESUME CONTENT:
${resumeText}

Please provide a JSON response with the following structure:
{
  "atsScore": <number between 0-100>,
  "keywordAnalysis": {
    "foundKeywords": [<array of keywords found in resume>],
    "missingKeywords": [<array of important keywords missing from resume>],
    "keywordDensity": <percentage of target keywords found>
  },
  "suggestions": [
    <array of 3-5 specific, actionable improvement suggestions>
  ],
  "strengths": [
    <array of 2-3 resume strengths>
  ],
  "weaknesses": [
    <array of 2-3 areas for improvement>
  ],
  "sectionAnalysis": {
    "contactInfo": <score 0-10>,
    "summary": <score 0-10>,
    "experience": <score 0-10>,
    "skills": <score 0-10>,
    "education": <score 0-10>,
    "formatting": <score 0-10>
  },
  "overallAssessment": "<brief 2-3 sentence overall assessment>"
}

Scoring criteria:
- ATS Score should reflect readability by applicant tracking systems
- Consider keyword relevance, formatting, structure, and completeness
- Provide specific, actionable suggestions for improvement
- Focus on Indian job market context when relevant

IMPORTANT: Respond with ONLY valid JSON. Do not wrap the response in markdown code blocks or add any additional text before or after the JSON.`;

      console.log('🤖 Sending request to Gemini API...');
      
      // Call Gemini API
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Record successful API call
      await this.recordAPICall(usage, true);

      // Parse AI response
      try {
        // Clean the response text by removing markdown code blocks
        let cleanedText = text.trim();
        
        // Remove ```json at the beginning and ``` at the end
        if (cleanedText.startsWith('```json')) {
          cleanedText = cleanedText.replace(/^```json\s*/, '');
        }
        if (cleanedText.startsWith('```')) {
          cleanedText = cleanedText.replace(/^```\s*/, '');
        }
        if (cleanedText.endsWith('```')) {
          cleanedText = cleanedText.replace(/\s*```$/, '');
        }
        
        console.log('🧹 Cleaned response for parsing');
        
        const aiResponse = JSON.parse(cleanedText);
        console.log('✅ Gemini API response parsed successfully');
        
        return {
          success: true,
          modelUsed: 'gemini-2.5-flash',
          aiResponse,
          rawResponse: text
        };
      } catch (parseError) {
        console.error('❌ Error parsing Gemini response:', parseError);
        console.log('Raw response:', text);
        
        // Record failed parse but successful API call
        await this.recordAPICall(usage, false);
        return { success: false, error: 'parse_error', rawResponse: text };
      }

    } catch (error) {
      console.error('❌ Gemini API error:', error);
      
      // Try to record failed API call if we have usage data
      if (usage) {
        await this.recordAPICall(usage, false);
      }
      
      return { success: false, error: 'api_error', details: error.message };
    }
  }

  /**
   * Get current usage statistics
   */
  async getUsageStats() {
    try {
      await connectDB();
      const today = this.getTodayString();
      const usage = await AIUsage.findOne({ date: today });
      
      if (!usage) {
        return {
          date: today,
          totalCalls: 0,
          dailyLimit: this.DAILY_LIMIT,
          remainingCalls: this.DAILY_LIMIT,
          rpmUsed: 0,
          rpmLimit: this.RPM_LIMIT
        };
      }

      // Calculate recent RPM usage
      const oneMinuteAgo = new Date(Date.now() - this.RPM_WINDOW);
      const rpmUsed = usage.recentCalls.filter(
        call => call.timestamp && call.timestamp > oneMinuteAgo
      ).length;

      return {
        date: today,
        totalCalls: usage.totalCalls,
        dailyLimit: this.DAILY_LIMIT,
        remainingCalls: Math.max(0, this.DAILY_LIMIT - usage.totalCalls),
        rpmUsed,
        rpmLimit: this.RPM_LIMIT,
        lastCall: usage.lastCallTimestamp
      };
    } catch (error) {
      console.error('❌ Error getting usage stats:', error);
      return null;
    }
  }
}

// Create singleton instance
const geminiService = new GeminiService();

export default geminiService;