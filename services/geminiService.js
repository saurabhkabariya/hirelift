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
You are an expert ATS (Applicant Tracking System) analyzer. Analyze the following resume text that has been extracted from a PDF document.

IMPORTANT CONTEXT:
- This text was extracted from a PDF, so formatting may be imperfect (e.g., tables become plain text, columns merge, spacing changes)
- Focus on CONTENT and INFORMATION rather than visual formatting
- ATS systems parse text, not visual layout, so evaluate based on what an ATS would actually see
- Do NOT penalize for formatting artifacts caused by PDF-to-text conversion (like misaligned text, weird spacing, or merged columns)
- Evaluate based on: keywords present, section completeness, information quality, and content structure

${keywordsContext}

RESUME CONTENT (PDF-extracted text):
${resumeText}

Provide a JSON response analyzing ATS compatibility:
{
  "atsScore": <number 0-100 based on ATS readability and keyword match>,
  "keywordAnalysis": {
    "foundKeywords": [<keywords from target list that appear in resume>],
    "missingKeywords": [<keywords from target list missing from resume>],
    "keywordDensity": <percentage 0-100 of target keywords found>
  },
  "suggestions": [
    <3-5 specific, actionable improvements focusing on CONTENT not PDF formatting>
  ],
  "strengths": [
    <2-3 resume content strengths>
  ],
  "weaknesses": [
    <2-3 content areas for improvement - NOT formatting issues>
  ],
  "sectionAnalysis": {
    "contactInfo": <score 0-10: email, phone, LinkedIn presence>,
    "summary": <score 0-10: professional summary/objective quality>,
    "experience": <score 0-10: work experience completeness and relevance>,
    "skills": <score 0-10: technical and soft skills presence>,
    "education": <score 0-10: educational background completeness>,
    "formatting": <score 0-10: ATS-friendly structure - ignore PDF artifacts>
  },
  "overallAssessment": "<2-3 sentences on ATS compatibility and content quality>"
}

SCORING GUIDELINES:
1. ATS Score (0-100):
   - 80-100: Excellent keyword match, all sections present, ATS-friendly
   - 60-79: Good content, minor keyword gaps
   - 40-59: Moderate issues, missing some keywords or sections
   - 0-39: Major gaps in keywords or critical sections

2. Section Scores (0-10 each):
   - 9-10: Comprehensive and well-optimized
   - 7-8: Good, minor improvements possible
   - 5-6: Adequate, needs enhancement
   - 3-4: Weak or incomplete
   - 0-2: Missing or severely lacking

3. Keyword Analysis:
   - Focus on semantic matches (e.g., "JavaScript" matches "JS", "React.js" matches "React")
   - Consider synonyms and variations
   - Don't penalize for case differences

4. Important Reminders:
   - PDF formatting issues are NOT content issues
   - An ATS extracts text, not visual layout
   - Evaluate the information present, not how it looks
   - Weird spacing or alignment does NOT affect ATS score
   - Focus on: keywords, sections, experience details, skills listed

Return ONLY valid JSON without markdown formatting or additional text.`;

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