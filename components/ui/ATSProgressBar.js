'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ATSProgressBar() {
  const [currentScore, setCurrentScore] = useState(25);
  const [showImprovement, setShowImprovement] = useState(false);
  const [animationPhase, setAnimationPhase] = useState('initial'); // initial, improving, completed

  useEffect(() => {
    // Start the animation sequence after component mounts
    const timer1 = setTimeout(() => {
      setAnimationPhase('improving');
      setShowImprovement(true);
    }, 2000);

    const timer2 = setTimeout(() => {
      // Animate score from 25 to 95
      let progress = 25;
      const increment = (95 - 25) / 50; // 50 steps for smooth animation
      
      const scoreAnimation = setInterval(() => {
        progress += increment;
        setCurrentScore(Math.min(95, Math.round(progress)));
        
        if (progress >= 95) {
          clearInterval(scoreAnimation);
          setAnimationPhase('completed');
        }
      }, 30); // 30ms intervals for smooth animation
    }, 2500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const getScoreColor = (score) => {
    if (score < 40) return 'from-red-500 to-red-600';
    if (score < 70) return 'from-yellow-500 to-orange-500';
    return 'from-green-500 to-emerald-600';
  };

  const getScoreLabel = (score) => {
    if (score < 40) return 'Poor';
    if (score < 70) return 'Good';
    return 'Excellent';
  };

  return (
    <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg mx-auto">
      {/* Main Container */}
      <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-slate-50 via-white to-slate-100 backdrop-blur-sm p-6 sm:p-8 border border-slate-200/50">
        
        {/* Header */}
        <div className="text-center mb-6">
          <motion.h3 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-xl sm:text-2xl font-bold text-slate-800 mb-2"
          >
            ATS Resume Score
          </motion.h3>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm text-slate-600"
          >
            Applicant Tracking System Compatibility
          </motion.p>
        </div>

        {/* Circular Progress */}
        <div className="relative flex justify-center mb-8">
          <div className="relative w-32 h-32 sm:w-40 sm:h-40">
            {/* Background Circle */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
                className="text-slate-200"
              />
              {/* Progress Circle */}
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray="283"
                className={`bg-gradient-to-r ${getScoreColor(currentScore)} stroke-current`}
                style={{
                  background: currentScore < 40 ? 'linear-gradient(to right, #ef4444, #dc2626)' :
                             currentScore < 70 ? 'linear-gradient(to right, #eab308, #f97316)' :
                             'linear-gradient(to right, #10b981, #059669)'
                }}
                initial={{ strokeDashoffset: 283 }}
                animate={{ 
                  strokeDashoffset: 283 - (283 * currentScore) / 100,
                  stroke: currentScore < 40 ? '#ef4444' :
                         currentScore < 70 ? '#eab308' : '#10b981'
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </svg>
            
            {/* Score Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span 
                key={currentScore}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-3xl sm:text-4xl font-bold text-slate-800"
              >
                {currentScore}%
              </motion.span>
              <motion.span 
                className={`text-sm font-medium ${
                  currentScore < 40 ? 'text-red-600' :
                  currentScore < 70 ? 'text-orange-600' : 'text-green-600'
                }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {getScoreLabel(currentScore)}
              </motion.span>
            </div>
          </div>
        </div>

        {/* Linear Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-slate-600">Progress</span>
            <span className="text-sm font-bold text-slate-800">{currentScore}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
            <motion.div
              className={`h-full bg-gradient-to-r ${getScoreColor(currentScore)} rounded-full relative`}
              initial={{ width: "25%" }}
              animate={{ width: `${currentScore}%` }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform skew-x-12 animate-pulse"></div>
            </motion.div>
          </div>
          
          {/* Milestone markers */}
          <div className="flex justify-between mt-2 text-xs text-slate-500">
            <span>0%</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Status Messages */}
        <AnimatePresence mode="wait">
          {animationPhase === 'initial' && (
            <motion.div
              key="initial"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center p-4 bg-red-50 border border-red-200 rounded-lg"
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-red-500 text-lg">⚠️</span>
                <span className="font-semibold text-red-700">Poor ATS Compatibility</span>
              </div>
              <p className="text-sm text-red-600">Your resume may get rejected by ATS systems</p>
            </motion.div>
          )}
          
          {animationPhase === 'improving' && (
            <motion.div
              key="improving"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center p-4 bg-blue-50 border border-blue-200 rounded-lg"
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <motion.span 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="text-blue-500 text-lg"
                >
                  🚀
                </motion.span>
                <span className="font-semibold text-blue-700">HireLift Optimizing...</span>
              </div>
              <p className="text-sm text-blue-600">AI is enhancing your resume for ATS compatibility</p>
            </motion.div>
          )}
          
          {animationPhase === 'completed' && (
            <motion.div
              key="completed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center p-4 bg-green-50 border border-green-200 rounded-lg"
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-green-500 text-lg">✅</span>
                <span className="font-semibold text-green-700">Excellent ATS Score!</span>
              </div>
              <p className="text-sm text-green-600">Your resume now passes 95% of ATS systems</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Features List */}
        <div className="mt-6 space-y-3">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 }}
            className="flex items-center gap-3 p-2 rounded-lg bg-slate-50"
          >
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-slate-700">ATS-friendly formatting</span>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2 }}
            className="flex items-center gap-3 p-2 rounded-lg bg-slate-50"
          >
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-slate-700">Optimized keywords</span>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.4 }}
            className="flex items-center gap-3 p-2 rounded-lg bg-slate-50"
          >
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-slate-700">Professional structure</span>
          </motion.div>
        </div>
      </div>

      {/* Floating Success Badge */}
      <AnimatePresence>
        {animationPhase === 'completed' && (
          <motion.div
            initial={{ opacity: 0, scale: 0, rotate: -180 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ 
              delay: 0.5,
              type: "spring",
              stiffness: 200,
              damping: 15
            }}
            className="absolute -top-3 -right-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg z-10"
          >
            🎉 Optimized!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Animation Elements */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-4 -left-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-3 py-2 rounded-full text-xs font-bold shadow-lg z-10"
      >
        AI Powered
      </motion.div>
      
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-4 -left-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg z-10"
      >
        Real-time
      </motion.div>
    </div>
  );
}