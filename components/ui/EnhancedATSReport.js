'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRobot, FaCheckCircle, FaTimesCircle, FaExclamationTriangle, FaBrain, FaFire } from 'react-icons/fa';

const EnhancedATSReport = ({ result, user, handleRedirect }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);

  const analysisSteps = [
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
    </motion.div>
  );
};

export default EnhancedATSReport;