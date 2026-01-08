'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRobot, FaCheckCircle, FaTimesCircle, FaExclamationTriangle, FaBrain, FaFire, FaLightbulb, FaShieldAlt, FaChartLine, FaStar, FaTrophy } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';

const EnhancedATSReport = ({ result, user, handleRedirect }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);

  const analysisSteps = result?.isAIGenerated 
    ? [
        '🤖 AI analyzing your resume...',
        '🔍 Checking ATS compatibility...',
        '📊 Evaluating content quality...',
        '💡 Generating personalized insights...'
      ]
    : [
        'Scanning your resume...',
        'Checking ATS compatibility...',
        'Analyzing critical issues...',
        'Generating recommendations...'
      ];

  useEffect(() => {
    if (result) {
      const timer = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= analysisSteps.length - 1) {
            setIsAnalyzing(false);
            clearInterval(timer);
            return prev;
          }
          return prev + 1;
        });
      }, 700);

      return () => clearInterval(timer);
    }
  }, [result]);

  const getScoreMessage = (score) => {
    if (score >= 85) {
      return {
        status: 'excellent',
        title: "🎉 Your Resume is ATS-Ready!",
        subtitle: "You're getting shortlisted. Ready to get MORE interviews?",
        color: 'green',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200'
      };
    } else {
      return {
        status: 'needs-work',
        title: "❌ This is Why You're Getting Rejected",
        subtitle: "Your resume is being filtered out before humans see it",
        color: 'red',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200'
      };
    }
  };

  const scoreInfo = getScoreMessage(result?.totalScore || 0);

  if (isAnalyzing) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-10 bg-white rounded-2xl shadow-xl p-8 border"
      >
        <div className="flex flex-col items-center text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-6"
          >
            <FaBrain className="text-white text-2xl" />
          </motion.div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            AI is analyzing your resume...
          </h2>
          
          <motion.div 
            key={currentStep}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-600 mb-4 font-medium"
          >
            {analysisSteps[currentStep]}
          </motion.div>
          
          <div className="w-full max-w-md bg-gray-200 rounded-full h-3">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / analysisSteps.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mt-10 bg-white rounded-2xl shadow-xl overflow-hidden border"
    >
      {/* Main Score Section */}
      <div className={`${scoreInfo.bgColor} ${scoreInfo.borderColor} border-b p-8`}>
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Score Circle */}
          <div className="relative">
            <div className="w-32 h-32 relative">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#e5e7eb" strokeWidth="10"/>
                <motion.circle
                  cx="60" cy="60" r="50" fill="none" strokeWidth="10" strokeLinecap="round"
                  strokeDasharray={314.159} 
                  stroke={scoreInfo.status === 'excellent' ? '#10b981' : '#ef4444'}
                  initial={{ strokeDashoffset: 314.159 }}
                  animate={{ strokeDashoffset: 314.159 - (result.totalScore / 100) * 314.159 }}
                  transition={{ duration: 2 }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-gray-800">{result.totalScore}</span>
                <span className="text-sm text-gray-500 font-medium">ATS Score</span>
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="text-center md:text-left flex-1">
            <h2 className={`text-3xl font-black mb-3 ${scoreInfo.status === 'excellent' ? 'text-green-700' : 'text-red-700'}`}>
              {scoreInfo.title}
            </h2>
            <p className="text-xl text-gray-700 font-medium mb-4">
              {scoreInfo.subtitle}
            </p>
            
            {/* Quick Stats */}
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <div className="flex items-center gap-2">
                {result.foundKeywords.length > 0 ? (
                  <FaCheckCircle className="text-green-500" />
                ) : (
                  <FaTimesCircle className="text-red-500" />
                )}
                <span className="text-sm font-medium">{result.foundKeywords.length} Keywords Found</span>
              </div>
              
              {result.missingKeywords.length > 0 && (
                <div className="flex items-center gap-2">
                  <FaExclamationTriangle className="text-orange-500" />
                  <span className="text-sm font-medium">{result.missingKeywords.length} Keywords Missing</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Critical Issues Section */}
      {result.totalScore < 85 && (
        <div className="p-6 bg-gray-50 border-b">
          <div className="flex items-start gap-3 mb-4">
            <FaFire className="text-red-500 text-xl mt-1" />
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Critical Issues Found</h3>
              <div className="space-y-2">
                {result.missingKeywords.length > 0 && (
                  <div className="text-sm text-gray-700">
                    <span className="font-medium">Missing Keywords:</span> {result.missingKeywords.slice(0, 5).join(', ')}
                    {result.missingKeywords.length > 5 && ` +${result.missingKeywords.length - 5} more`}
                  </div>
                )}
                {result.missingSections.length > 0 && (
                  <div className="text-sm text-gray-700">
                    <span className="font-medium">Missing Sections:</span> {result.missingSections.join(', ')}
                  </div>
                )}
                {result.sectionScore < 80 && (
                  <div className="text-sm text-gray-700">
                    <span className="font-medium">Format Issues:</span> ATS compatibility problems detected
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="bg-orange-100 border border-orange-300 rounded-lg p-3">
            <p className="text-sm font-bold text-orange-800 mb-1">⚠️ Impact on Your Job Search:</p>
            <p className="text-sm text-orange-700">
              Resumes with scores below 85 get rejected by 87% of ATS systems. 
              You're likely missing out on {Math.round((100 - result.totalScore) * 0.5)} interview opportunities per week.
            </p>
          </div>
        </div>
      )}

      {/* Success Message for High Scores */}
      {result.totalScore >= 85 && (
        <div className="p-6 bg-green-50 border-b">
          <div className="flex items-start gap-3">
            <FaCheckCircle className="text-green-500 text-xl mt-1" />
            <div>
              <h3 className="text-lg font-bold text-green-800 mb-2">Excellent ATS Compatibility!</h3>
              <p className="text-sm text-green-700 mb-3">
                Your resume passes most ATS systems. You're getting through the initial screening.
              </p>
              <div className="bg-blue-100 border border-blue-300 rounded-lg p-3">
                <p className="text-sm font-bold text-blue-800 mb-1">🚀 Ready for the Next Level?</p>
                <p className="text-sm text-blue-700">
                  Get direct access to hiring managers and skip the application queue entirely.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI-Powered Insights Section - Only show for AI results */}
      {result.isAIGenerated && (
        <>
          {/* AI Header */}
          <div className="p-4 md:p-6 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 border-b">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0"
              >
                <FaBrain className="text-white text-lg sm:text-xl" />
              </motion.div>
              <div className="flex-grow min-w-0">
                <h3 className="text-lg sm:text-xl font-bold text-white">AI-Powered Analysis</h3>
                <p className="text-blue-100 text-xs sm:text-sm truncate">Generated by {result.modelUsed}</p>
              </div>
              <div className="w-full sm:w-auto sm:ml-auto mt-2 sm:mt-0">
                <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-bold inline-block">
                  🤖 AI ENHANCED
                </span>
              </div>
            </div>
          </div>

          {/* Overall Assessment */}
          {result.overallAssessment && (
            <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
              <h4 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <FaTrophy className="text-yellow-500" />
                AI Assessment
              </h4>
              <p className="text-gray-700 text-base leading-relaxed italic">
                "{result.overallAssessment}"
              </p>
            </div>
          )}

          {/* Strengths and Weaknesses */}
          <div className="p-6 grid md:grid-cols-2 gap-6 border-b">
            {/* Strengths */}
            {result.strengths && result.strengths.length > 0 && (
              <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
                <h4 className="text-lg font-bold text-green-800 mb-4 flex items-center gap-2">
                  <FaStar className="text-green-600" />
                  Resume Strengths
                </h4>
                <div className="space-y-3">
                  {result.strengths.map((strength, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <FaCheckCircle className="text-green-600 text-sm mt-1 flex-shrink-0" />
                      <span className="text-green-800 text-sm font-medium">{strength}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Weaknesses */}
            {result.weaknesses && result.weaknesses.length > 0 && (
              <div className="bg-orange-50 rounded-2xl p-6 border border-orange-200">
                <h4 className="text-lg font-bold text-orange-800 mb-4 flex items-center gap-2">
                  <FaExclamationTriangle className="text-orange-600" />
                  Areas to Improve
                </h4>
                <div className="space-y-3">
                  {result.weaknesses.map((weakness, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <FaExclamationTriangle className="text-orange-600 text-sm mt-1 flex-shrink-0" />
                      <span className="text-orange-800 text-sm font-medium">{weakness}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Section Analysis Breakdown */}
          {result.sectionAnalysis && (
            <div className="p-6 border-b">
              <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaChartLine className="text-blue-500" />
                Detailed Section Scores
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(result.sectionAnalysis).map(([section, score]) => (
                  <motion.div
                    key={section}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-lg p-4 border border-gray-200 text-center"
                  >
                    <div className={`text-2xl font-bold mb-1 ${
                      score >= 7 ? 'text-green-600' : 
                      score >= 5 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {score}/10
                    </div>
                    <div className="text-sm font-medium text-gray-700 capitalize">
                      {section.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-1000 ${
                          score >= 7 ? 'bg-green-500' : 
                          score >= 5 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${(score / 10) * 100}%` }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* AI Suggestions */}
          {result.suggestions && result.suggestions.length > 0 && (
            <div className="p-6 border-b">
              <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaLightbulb className="text-yellow-500" />
                AI Recommendations
              </h4>
              <div className="space-y-3">
                {result.suggestions.map((suggestion, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200"
                  >
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <span className="text-blue-800 font-medium">{suggestion}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Legacy Results Enhancement */}
      {!result.isAIGenerated && result.fallbackUsed && (
        <div className="p-4 bg-yellow-50 border-b border-yellow-200">
          <div className="flex items-center gap-2 text-yellow-800">
            <FaShieldAlt className="text-yellow-600" />
            <span className="font-medium text-sm">
              Standard Analysis Used - Upgrade for AI-powered insights!
            </span>
          </div>
        </div>
      )}

      {/* Next Steps Section */}
      <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-t-2 border-indigo-200">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mb-4">
            <HiSparkles className="text-white text-3xl" />
          </div>
          
          <h3 className="text-2xl font-bold text-gray-800 mb-3">
            Ready to Fix Your Resume?
          </h3>
          
          <p className="text-gray-700 text-base mb-6 max-w-2xl mx-auto leading-relaxed">
            Now that you know what's wrong, update your resume based on these suggestions. 
            Then come back and check it again with our Resume Review to see your improved score 
            and ensure you're getting those interview responses!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white rounded-lg p-4 shadow-md border-2 border-indigo-200 max-w-sm"
            >
              <div className="flex items-start gap-3 text-left">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-indigo-600 font-bold text-sm">1</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 mb-1">Update Your Resume</h4>
                  <p className="text-sm text-gray-600">Apply the suggestions above to fix critical issues</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white rounded-lg p-4 shadow-md border-2 border-purple-200 max-w-sm"
            >
              <div className="flex items-start gap-3 text-left">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-purple-600 font-bold text-sm">2</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 mb-1">Review Again</h4>
                  <p className="text-sm text-gray-600">Check your updated resume to verify improvements</p>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.button
            onClick={() => handleRedirect && handleRedirect('/audit')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 inline-flex items-center gap-2"
          >
            <FaRobot className="text-xl" />
            Check Updated Resume
          </motion.button>

          <p className="text-xs text-gray-500 mt-4">
            💡 Pro Tip: Keep reviewing until you reach 85+ score for maximum interview callbacks
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default EnhancedATSReport;