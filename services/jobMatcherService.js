import { GoogleGenerativeAI } from '@google/generative-ai';
import connectDB from '@/lib/mongodb';
import AIUsage from '@/models/AIUsage';

class JobMatcherService {
  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      console.warn('⚠️ GEMINI_API_KEY not found in environment variables');
      this.genAI = null;
      return;
    }

    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    // Rate limiting constants
    this.DAILY_LIMIT = 250;
    this.RPM_LIMIT = 10;
    this.RPM_WINDOW = 60 * 1000;
  }

  getTodayString() {
    return new Date().toISOString().split('T')[0];
  }

  async canMakeAPICall() {
    try {
      await connectDB();
      const today = this.getTodayString();
      
      let usage = await AIUsage.findOne({ date: today });
      if (!usage) {
        usage = new AIUsage({ date: today, totalCalls: 0, recentCalls: [] });
      }

      if (usage.totalCalls >= this.DAILY_LIMIT) {
        console.log(`🚫 Daily limit reached: ${usage.totalCalls}/${this.DAILY_LIMIT} calls`);
        return { canCall: false, reason: 'daily_limit' };
      }

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

  async recordAPICall(usage, success = true) {
    try {
      const now = new Date();
      
      usage.totalCalls += 1;
      usage.lastCallTimestamp = now;
      
      usage.recentCalls.push({
        timestamp: now,
        success: success,
        model: 'gemini-2.5-flash'
      });
      
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      usage.recentCalls = usage.recentCalls
        .filter(call => call.timestamp > oneHourAgo)
        .slice(-20);

      await usage.save();
      
      console.log(`📊 API call recorded: ${usage.totalCalls}/${this.DAILY_LIMIT} daily calls used`);
    } catch (error) {
      console.error('❌ Error recording API call:', error);
    }
  }

  /**
   * Match resume with job description using Gemini AI
   */
  async matchResumeWithJob(resumeText, jobDescription) {
    let usage = null;
    
    try {
      if (!this.genAI) {
        console.log('🔄 Gemini API not available, using fallback');
        return this.fallbackMatcher(resumeText, jobDescription);
      }

      const rateLimitCheck = await this.canMakeAPICall();
      usage = rateLimitCheck.usage;
      
      if (!rateLimitCheck.canCall) {
        console.log(`🔄 Rate limit exceeded (${rateLimitCheck.reason}), using fallback`);
        return this.fallbackMatcher(resumeText, jobDescription);
      }

      const prompt = `
You are an expert recruiter and ATS analyst. Compare the following resume with a job description and provide a comprehensive match analysis.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Analyze the match comprehensively and provide a JSON response with the following structure:
{
  "matchScore": <number 0-100 indicating overall match quality>,
  "mismatches": [
    {
      "category": "<Skills|Experience|Education|Keywords|Qualifications>",
      "title": "<brief title of the mismatch>",
      "description": "<clear explanation of what's missing or mismatched>",
      "severity": "<critical|high|medium|low>"
    }
  ],
  "suggestions": [
    {
      "category": "<Skills|Experience|Education|Keywords|Qualifications>",
      "title": "<actionable suggestion title>",
      "description": "<detailed advice on how to improve the match>",
      "priority": "<critical|high|medium|low>",
      "impact": "<brief explanation of how this will improve the match>"
    }
  ],
  "matchedSkills": [<list of skills from job description found in resume>],
  "missingSkills": [<list of required skills from job description missing in resume>],
  "experienceMatch": {
    "required": "<years or description of required experience>",
    "found": "<years or description of found experience>",
    "isMatch": <boolean>
  },
  "educationMatch": {
    "required": "<required education from job description>",
    "found": "<found education in resume>",
    "isMatch": <boolean>
  },
  "keyHighlights": [<array of 3-5 positive points where resume matches well>],
  "improvementAreas": [<array of 3-5 key areas that need improvement>],
  "atsOptimization": {
    "score": <number 0-100 for ATS compatibility>,
    "tips": [<array of 3-5 ATS optimization tips>]
  }
}

IMPORTANT GUIDELINES:
- Be honest but constructive in your analysis
- Prioritize critical mismatches that would likely lead to rejection
- Provide actionable, specific suggestions
- Consider both hard skills (technical) and soft skills
- Account for transferable skills and related experience
- Focus on what recruiters and ATS systems actually look for
- Identify keyword gaps that might cause ATS rejection
`;

      console.log('🤖 Calling Gemini API for job matching...');
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Record successful API call
      if (usage) {
        await this.recordAPICall(usage, true);
      }

      // Parse JSON response
      let parsedResult;
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsedResult = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON found in response');
        }
      } catch (parseError) {
        console.error('❌ Error parsing Gemini response:', parseError);
        return this.fallbackMatcher(resumeText, jobDescription);
      }

      console.log(`✅ AI job matching completed successfully`);
      
      return {
        success: true,
        isAIGenerated: true,
        modelUsed: 'gemini-2.5-flash',
        ...parsedResult
      };

    } catch (error) {
      console.error('❌ Error in AI job matching:', error);
      
      // Record failed API call if usage exists
      if (usage) {
        await this.recordAPICall(usage, false);
      }
      
      return this.fallbackMatcher(resumeText, jobDescription);
    }
  }

  /**
   * Fallback matcher using rule-based analysis
   */
  fallbackMatcher(resumeText, jobDescription) {
    console.log('🔄 Using fallback matcher (rule-based)');
    
    const resumeLower = resumeText.toLowerCase();
    const jobLower = jobDescription.toLowerCase();

    // Extract common skills keywords
    const commonSkills = [
      'javascript', 'python', 'java', 'react', 'node', 'angular', 'vue',
      'sql', 'mongodb', 'aws', 'azure', 'docker', 'kubernetes',
      'git', 'agile', 'scrum', 'leadership', 'communication',
      'project management', 'data analysis', 'machine learning',
      'html', 'css', 'typescript', 'api', 'rest', 'graphql'
    ];

    const matchedSkills = [];
    const missingSkills = [];

    commonSkills.forEach(skill => {
      const skillRegex = new RegExp(`\\b${skill}\\b`, 'i');
      if (skillRegex.test(jobDescription)) {
        if (skillRegex.test(resumeText)) {
          matchedSkills.push(skill);
        } else {
          missingSkills.push(skill);
        }
      }
    });

    // Calculate basic match score
    const totalRelevantSkills = matchedSkills.length + missingSkills.length;
    const matchScore = totalRelevantSkills > 0 
      ? Math.round((matchedSkills.length / totalRelevantSkills) * 100)
      : 50;

    // Generate basic mismatches
    const mismatches = [];
    if (missingSkills.length > 0) {
      mismatches.push({
        category: 'Skills',
        title: 'Missing Key Skills',
        description: `Your resume doesn't mention: ${missingSkills.slice(0, 5).join(', ')}${missingSkills.length > 5 ? '...' : ''}`,
        severity: 'high'
      });
    }

    // Check for experience mentions
    const yearsMatch = jobDescription.match(/(\d+)\+?\s*years?/i);
    if (yearsMatch) {
      const resumeYearsMatch = resumeText.match(/(\d+)\+?\s*years?/i);
      if (!resumeYearsMatch || parseInt(resumeYearsMatch[1]) < parseInt(yearsMatch[1])) {
        mismatches.push({
          category: 'Experience',
          title: 'Experience Level Mismatch',
          description: `Job requires ${yearsMatch[0]} of experience. Make sure this is clearly stated in your resume.`,
          severity: 'critical'
        });
      }
    }

    // Generate basic suggestions
    const suggestions = [
      {
        category: 'Keywords',
        title: 'Add Missing Keywords',
        description: 'Incorporate the missing skills and keywords from the job description naturally into your resume.',
        priority: 'high',
        impact: 'This will significantly improve your ATS match score and increase your chances of getting noticed.'
      },
      {
        category: 'Experience',
        title: 'Quantify Your Achievements',
        description: 'Add specific numbers, percentages, and metrics to demonstrate the impact of your work.',
        priority: 'high',
        impact: 'Quantified achievements make your experience more compelling and credible to recruiters.'
      }
    ];

    if (missingSkills.length > 0) {
      suggestions.unshift({
        category: 'Skills',
        title: 'Highlight Relevant Skills',
        description: `Focus on developing or highlighting these skills: ${missingSkills.slice(0, 3).join(', ')}`,
        priority: 'critical',
        impact: 'These skills are likely required for the role and are currently missing from your resume.'
      });
    }

    return {
      success: true,
      isAIGenerated: false,
      fallbackUsed: 'rule-based',
      matchScore,
      mismatches,
      suggestions,
      matchedSkills,
      missingSkills,
      experienceMatch: {
        required: yearsMatch ? yearsMatch[0] : 'Not specified',
        found: 'Check resume for details',
        isMatch: true
      },
      educationMatch: {
        required: 'Check job description',
        found: 'Check resume',
        isMatch: true
      },
      keyHighlights: matchedSkills.length > 0 
        ? [`Strong match in: ${matchedSkills.slice(0, 3).join(', ')}`]
        : ['Resume uploaded successfully'],
      improvementAreas: missingSkills.length > 0
        ? [`Add these skills: ${missingSkills.slice(0, 3).join(', ')}`]
        : ['Consider tailoring resume more specifically to this job'],
      atsOptimization: {
        score: matchScore,
        tips: [
          'Use keywords from the job description',
          'Format resume for ATS readability',
          'Include a skills section',
          'Use standard section headings',
          'Avoid graphics and complex formatting'
        ]
      }
    };
  }
}

// Export singleton instance
const jobMatcherService = new JobMatcherService();
export default jobMatcherService;
