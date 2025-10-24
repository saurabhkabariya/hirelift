'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRobot, FaChartLine, FaExclamationTriangle, FaCheckCircle, FaTimesCircle, FaLightbulb, FaCrown, FaRocket, FaBrain, FaShieldAlt, FaFire } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';

const EnhancedATSReport = ({ result, user, handleRedirect }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);

  const analysisSteps = [
    'Scanning ATS compatibility...',
    'Analyzing keyword density...',
    'Evaluating format structure...',
    'Checking professional sections...',
    'Generating AI recommendations...'
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
      }, 800);

      return () => clearInterval(timer);
    }
  }, [result]);

  const getScoreStatus = (score) => {
    if (score >= 85) return 'excellent';
    if (score >= 70) return 'good';
    if (score >= 50) return 'fair';
    return 'poor';
  };

  const getEmotionalMessage = (score) => {
    if (score < 85) {
      return {
        title: "⚠️ This is the exact reason you're not getting responses",
        message: "Your resume is being filtered out by ATS systems before human recruiters even see it. But don't worry - we can fix this!",
        action: "Implement these AI suggestions then try another review - repeat until 85 + ATS score and start getting multiple interview calls within 7 days.",
        urgency: "🔥 Critical: 87% of resumes with similar scores get rejected automatically"
      };
    } else {
      return {
        title: "🎉 Excellent! Your resume passes most ATS systems",
        message: "Your resume has a high chance of reaching human recruiters. You're on the right track!",
        action: "Fine-tune with our premium features to guarantee 95%+ Responses through HR directory.",
        urgency: "✨ Opportunity: Upgrade to unlock direct connection with recruiters"
      };
    }
  };

  const scoreStatus = getScoreStatus(result?.totalScore || 0);
  const emotional = getEmotionalMessage(result?.totalScore || 0);

  if (isAnalyzing) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-10 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl shadow-2xl p-8 border border-blue-200"
      >
        <div className="flex flex-col items-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-6"
          >
            <FaBrain className="text-white text-2xl" />
          </motion.div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            🤖 AI Resume Analysis in Progress
          </h2>
          
          <div className="w-full max-w-md">
            <motion.div 
              key={currentStep}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-center text-gray-600 mb-4"
            >
              {analysisSteps[currentStep]}
            </motion.div>
            
            <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
              <motion.div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep + 1) / analysisSteps.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mt-10 bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl overflow-hidden border border-gray-200"
    >
      {/* AI Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <FaRobot className="text-white text-xl" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">AI Resume Analysis Report</h2>
            <p className="text-blue-100 text-sm">Powered by Advanced Machine Learning</p>
          </div>
        </div>
      </div>

      {/* Score Section with Emotional Appeal */}
      <div className="p-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left: Score Display */}
          <div className="text-center">
            <div className="relative w-40 h-40 mx-auto mb-6">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60" cy="60" r="54" fill="none"
                  stroke="#e5e7eb" strokeWidth="8"
                />
                <motion.circle
                  cx="60" cy="60" r="54" fill="none"
                  strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={339.292}
                  stroke={scoreStatus === 'excellent' ? '#10b981' : 
                         scoreStatus === 'good' ? '#f59e0b' : 
                         scoreStatus === 'fair' ? '#f97316' : '#ef4444'}
                  initial={{ strokeDashoffset: 339.292 }}
                  animate={{ strokeDashoffset: 339.292 - (result.totalScore / 100) * 339.292 }}
                  transition={{ duration: 2, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-black text-gray-800">
                  {result.totalScore}
                </span>
                <span className="text-gray-500 font-medium">ATS Score</span>
              </div>
            </div>

            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${
              scoreStatus === 'excellent' ? 'bg-green-100 text-green-700' :
              scoreStatus === 'good' ? 'bg-yellow-100 text-yellow-700' :
              scoreStatus === 'fair' ? 'bg-orange-100 text-orange-700' :
              'bg-red-100 text-red-700'
            }`}>
              {scoreStatus === 'excellent' ? <FaCheckCircle /> : <FaExclamationTriangle />}
              {scoreStatus.toUpperCase()} COMPATIBILITY
            </div>
          </div>

          {/* Right: Emotional Message */}
          <div className="space-y-4">
            <div className={`p-6 rounded-2xl border-l-4 ${
              result.totalScore < 85 
                ? 'bg-red-50 border-red-500' 
                : 'bg-green-50 border-green-500'
            }`}>
              <h3 className={`text-lg font-bold mb-2 ${
                result.totalScore < 85 ? 'text-red-700' : 'text-green-700'
              }`}>
                {emotional.title}
              </h3>
              <p className="text-gray-700 mb-3">{emotional.message}</p>
              <p className="text-sm font-medium text-gray-600">{emotional.action}</p>
            </div>

            <div className={`p-4 rounded-xl ${
              result.totalScore < 85 
                ? 'bg-orange-100 border border-orange-300' 
                : 'bg-blue-100 border border-blue-300'
            }`}>
              <p className={`text-sm font-bold ${
                result.totalScore < 85 ? 'text-orange-800' : 'text-blue-800'
              }`}>
                {emotional.urgency}
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Analysis */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          {/* Scores Breakdown */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FaChartLine className="text-blue-500" />
              Performance Breakdown
            </h3>
            <div className="space-y-4">
              {[
                { label: 'ATS Format', value: result.sectionScore, icon: FaShieldAlt },
                { label: 'Keywords', value: result.keywordScore, icon: HiSparkles },
                { label: 'Content Length', value: result.lengthScore, icon: FaRocket },
                { label: 'Contact Info', value: result.contactScore, icon: FaCheckCircle }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <item.icon className={`text-lg ${
                    item.value >= 80 ? 'text-green-500' :
                    item.value >= 60 ? 'text-yellow-500' : 'text-red-500'
                  }`} />
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{item.label}</span>
                      <span className="text-sm font-bold">{item.value}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        className={`h-2 rounded-full ${
                          item.value >= 80 ? 'bg-green-500' :
                          item.value >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${item.value}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 shadow-lg border">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FaLightbulb className="text-yellow-500" />
              AI Recommendations
            </h3>
            <div className="space-y-3">
              {result.totalScore < 85 && (
                <>
                  {result.missingKeywords.length > 0 && (
                    <div className="flex items-start gap-2 p-3 bg-white rounded-lg">
                      <FaFire className="text-red-500 mt-1 text-sm" />
                      <div>
                        <p className="text-sm font-medium text-gray-800">Critical Keywords Missing</p>
                        <p className="text-xs text-gray-600">Add: {result.missingKeywords.slice(0, 3).join(', ')}</p>
                      </div>
                    </div>
                  )}
                  {result.missingSections.length > 0 && (
                    <div className="flex items-start gap-2 p-3 bg-white rounded-lg">
                      <FaExclamationTriangle className="text-yellow-500 mt-1 text-sm" />
                      <div>
                        <p className="text-sm font-medium text-gray-800">Missing Sections</p>
                        <p className="text-xs text-gray-600">{result.missingSections.slice(0, 2).join(', ')}</p>
                      </div>
                    </div>
                  )}
                </>
              )}
              <div className="flex items-start gap-2 p-3 bg-white rounded-lg">
                <HiSparkles className="text-blue-500 mt-1 text-sm" />
                <div>
                  <p className="text-sm font-medium text-gray-800">Format Optimization</p>
                  <p className="text-xs text-gray-600">Use ATS-friendly templates & formatting</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Keywords Analysis */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
            <h3 className="text-lg font-bold text-green-800 mb-4 flex items-center gap-2">
              <FaCheckCircle className="text-green-600" />
              Found Keywords ({result.foundKeywords.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {result.foundKeywords.slice(0, 8).map((keyword, index) => (
                <motion.span
                  key={keyword}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {keyword}
                </motion.span>
              ))}
              {result.foundKeywords.length > 8 && (
                <span className="text-green-600 text-sm">+{result.foundKeywords.length - 8} more</span>
              )}
            </div>
          </div>

          <div className="bg-red-50 rounded-2xl p-6 border border-red-200">
            <h3 className="text-lg font-bold text-red-800 mb-4 flex items-center gap-2">
              <FaTimesCircle className="text-red-600" />
              Missing Keywords ({result.missingKeywords.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {result.missingKeywords.slice(0, 8).map((keyword, index) => (
                <motion.span
                  key={keyword}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {keyword}
                </motion.span>
              ))}
              {result.missingKeywords.length > 8 && (
                <span className="text-red-600 text-sm">+{result.missingKeywords.length - 8} more</span>
              )}
            </div>
          </div>
        </div>

        {/* Direct Payment CTA */}
        {result.totalScore < 85 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-8 bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-8 text-white text-center"
          >
            <FaCrown className="text-4xl mx-auto mb-4 text-yellow-300" />
            <h3 className="text-2xl font-bold mb-3">
              🚀 Fix Your Resume & Get 3x More Interviews
            </h3>
            <p className="text-blue-100 mb-4">
              Get unlimited ATS reviews, premium templates, and HR Directory Access
            </p>
            
            <div className="flex items-center justify-center gap-6 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold">₹99</div>
                <div className="text-blue-200 line-through text-sm">Regular Price</div>
              </div>
              <div className="text-6xl">→</div>
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-300">₹199</div>
                <div className="text-blue-200 text-sm">Limited Time</div>
              </div>
            </div>

            <button
              onClick={() => handleRedirect('/pricing')}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold py-4 px-8 rounded-xl text-lg shadow-lg hover:scale-105 transition-all duration-200 mb-4"
            >
              🔥 Upgrade Now - 50% OFF
            </button>
            
            <div className="text-sm text-blue-200">
              ✅ Instant Access • ✅ 30-Day Guarantee • ✅ Cancel Anytime
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default EnhancedATSReport;