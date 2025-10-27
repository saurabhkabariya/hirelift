import geminiService from './geminiService.js';
import { scoreResume } from './scoreResume.js';

class AIResumeService {
  /**
   * Transform AI response to match legacy format
   */
  transformAIResponse(aiResponse, keywords) {
    try {
      const {
        atsScore,
        keywordAnalysis,
        suggestions = [],
        strengths = [],
        weaknesses = [],
        sectionAnalysis = {},
        overallAssessment = ''
      } = aiResponse;

      // Ensure we have required arrays
      const foundKeywords = keywordAnalysis?.foundKeywords || [];
      const missingKeywords = keywordAnalysis?.missingKeywords || [];

      // Calculate section scores based on AI analysis
      const contactScore = Math.round((sectionAnalysis.contactInfo || 5) * 1); // Scale to 10
      const experienceScore = Math.round((sectionAnalysis.experience || 5) * 3); // Scale to 30
      const skillsScore = Math.round((sectionAnalysis.skills || 5) * 3); // Scale to 30
      const educationScore = Math.round((sectionAnalysis.education || 5) * 2); // Scale to 20

      // Calculate keyword score
      const keywordScore = keywords.length > 0 
        ? Math.round((foundKeywords.length / keywords.length) * 40)
        : Math.round((keywordAnalysis?.keywordDensity || 50) * 0.4);

      // Calculate length score (AI doesn't know page count, so use text length estimation)
      const lengthScore = 15; // Default reasonable score

      return {
        // Core scores
        totalScore: Math.min(100, atsScore || 75),
        sectionScore: Math.min(30, experienceScore + skillsScore + educationScore > 30 ? 30 : experienceScore + skillsScore + educationScore),
        keywordScore: Math.min(40, keywordScore),
        lengthScore: lengthScore,
        contactScore: Math.min(10, contactScore),

        // Keywords
        foundKeywords,
        missingKeywords,
        
        // Additional AI insights
        suggestions,
        strengths,
        weaknesses,
        overallAssessment,
        
        // Section breakdown
        sectionAnalysis: {
          contactInfo: sectionAnalysis.contactInfo || 5,
          summary: sectionAnalysis.summary || 5,
          experience: sectionAnalysis.experience || 5,
          skills: sectionAnalysis.skills || 5,
          education: sectionAnalysis.education || 5,
          formatting: sectionAnalysis.formatting || 5
        },

        // Metadata
        modelUsed: 'gemini-ai',
        isAIGenerated: true,
        
        // Legacy compatibility
        missingSections: this.calculateMissingSections(sectionAnalysis),
        contactDetails: {
          emailFound: (sectionAnalysis.contactInfo || 0) > 3,
          phoneFound: (sectionAnalysis.contactInfo || 0) > 5,
          linkedinFound: (sectionAnalysis.contactInfo || 0) > 7
        }
      };
    } catch (error) {
      console.error('❌ Error transforming AI response:', error);
      throw error;
    }
  }

  /**
   * Calculate missing sections based on AI section analysis
   */
  calculateMissingSections(sectionAnalysis) {
    const missingSections = [];
    const threshold = 3; // Sections scoring below 3 are considered "missing"

    if ((sectionAnalysis.experience || 0) < threshold) {
      missingSections.push('experience');
    }
    if ((sectionAnalysis.skills || 0) < threshold) {
      missingSections.push('skills');
    }
    if ((sectionAnalysis.education || 0) < threshold) {
      missingSections.push('education');
    }

    return missingSections;
  }

  /**
   * Main audit function with AI and fallback logic
   */
  async auditResume({ text, pageCount, keywords }) {
    console.log('🚀 Starting AI-powered resume audit...');
    
    try {
      // Attempt AI analysis first
      const aiResult = await geminiService.generateResumeAudit(text, keywords);
      
      if (aiResult.success && aiResult.aiResponse) {
        console.log('✅ AI analysis successful, transforming response...');
        
        try {
          const transformedResult = this.transformAIResponse(aiResult.aiResponse, keywords);
          console.log('✅ AI audit completed successfully');
          
          return {
            ...transformedResult,
            processingTime: Date.now(),
            fallbackUsed: false
          };
        } catch (transformError) {
          console.error('❌ Error transforming AI response, falling back to legacy:', transformError);
          // Fall through to legacy logic
        }
      } else {
        console.log(`🔄 AI analysis failed (${aiResult.error}), falling back to legacy logic`);
        // Fall through to legacy logic
      }
    } catch (error) {
      console.error('❌ AI service error, falling back to legacy logic:', error);
      // Fall through to legacy logic
    }

    // Fallback to legacy logic
    console.log('🔄 Using legacy audit logic...');
    const legacyResult = scoreResume({ text, pageCount, keywords });
    
    return {
      ...legacyResult,
      modelUsed: 'legacy',
      isAIGenerated: false,
      fallbackUsed: true,
      suggestions: this.generateLegacySuggestions(legacyResult),
      strengths: this.generateLegacyStrengths(legacyResult),
      weaknesses: this.generateLegacyWeaknesses(legacyResult),
      overallAssessment: this.generateLegacyAssessment(legacyResult),
      processingTime: Date.now()
    };
  }

  /**
   * Generate suggestions for legacy results
   */
  generateLegacySuggestions(result) {
    const suggestions = [];

    if (result.totalScore < 70) {
      suggestions.push('Improve overall resume structure and content quality');
    }

    if (result.keywordScore < 30) {
      suggestions.push('Include more relevant keywords from the job description');
    }

    if (result.sectionScore < 20) {
      suggestions.push('Add missing essential sections like Experience, Skills, or Education');
    }

    if (result.contactScore < 10) {
      suggestions.push('Ensure complete contact information including phone number and LinkedIn profile');
    }

    if (result.lengthScore < 15) {
      suggestions.push('Optimize resume length to 1-2 pages for better readability');
    }

    // Add specific missing keyword suggestions
    if (result.missingKeywords.length > 0) {
      suggestions.push(`Add these important keywords: ${result.missingKeywords.slice(0, 3).join(', ')}`);
    }

    return suggestions.slice(0, 5); // Limit to 5 suggestions
  }

  /**
   * Generate strengths for legacy results
   */
  generateLegacyStrengths(result) {
    const strengths = [];

    if (result.keywordScore >= 30) {
      strengths.push('Good keyword optimization for ATS systems');
    }

    if (result.sectionScore >= 20) {
      strengths.push('Contains all essential resume sections');
    }

    if (result.contactScore >= 10) {
      strengths.push('Complete and professional contact information');
    }

    if (result.lengthScore >= 15) {
      strengths.push('Appropriate resume length for readability');
    }

    if (strengths.length === 0) {
      strengths.push('Resume foundation is in place, ready for optimization');
    }

    return strengths.slice(0, 3); // Limit to 3 strengths
  }

  /**
   * Generate weaknesses for legacy results
   */
  generateLegacyWeaknesses(result) {
    const weaknesses = [];

    if (result.keywordScore < 20) {
      weaknesses.push('Low keyword density may hurt ATS ranking');
    }

    if (result.sectionScore < 15) {
      weaknesses.push('Missing critical resume sections');
    }

    if (result.contactScore < 5) {
      weaknesses.push('Incomplete contact information');
    }

    if (weaknesses.length === 0) {
      weaknesses.push('Minor formatting improvements could enhance ATS compatibility');
    }

    return weaknesses.slice(0, 3); // Limit to 3 weaknesses
  }

  /**
   * Generate overall assessment for legacy results
   */
  generateLegacyAssessment(result) {
    if (result.totalScore >= 80) {
      return 'Excellent resume with strong ATS compatibility. Minor tweaks could further optimize performance.';
    } else if (result.totalScore >= 60) {
      return 'Good foundation with room for improvement. Focus on keyword optimization and section completeness.';
    } else {
      return 'Significant improvements needed for ATS compatibility. Prioritize adding missing sections and relevant keywords.';
    }
  }

  /**
   * Get service status and usage statistics
   */
  async getServiceStatus() {
    try {
      const usageStats = await geminiService.getUsageStats();
      return {
        aiServiceAvailable: !!geminiService.genAI,
        usageStats,
        serviceName: 'AI Resume Audit Service',
        version: '1.0.0'
      };
    } catch (error) {
      console.error('❌ Error getting service status:', error);
      return {
        aiServiceAvailable: false,
        error: error.message,
        serviceName: 'AI Resume Audit Service',
        version: '1.0.0'
      };
    }
  }
}

// Create singleton instance
const aiResumeService = new AIResumeService();

export default aiResumeService;