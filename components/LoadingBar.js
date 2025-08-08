'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LoadingBar = ({ isLoading, onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('Loading...');

  const messages = [
    'Loading...',
    'Preparing your experience...',
    'Optimizing content...',
    'Almost ready...',
    'Finalizing...'
  ];

  useEffect(() => {
    if (isLoading) {
      setProgress(0);
      setMessage(messages[0]);
      
      // More realistic and smooth loading progress with accurate timing
      const progressSteps = [
        { time: 0, progress: 0, messageIndex: 0 },
        { time: 200, progress: 15, messageIndex: 0 },
        { time: 500, progress: 35, messageIndex: 1 },
        { time: 800, progress: 55, messageIndex: 1 },
        { time: 1100, progress: 75, messageIndex: 2 },
        { time: 1400, progress: 90, messageIndex: 3 },
        { time: 1600, progress: 98, messageIndex: 4 },
        { time: 1750, progress: 100, messageIndex: 4 }
      ];

      progressSteps.forEach(({ time, progress: targetProgress, messageIndex }) => {
        setTimeout(() => {
          if (isLoading) { // Only update if still loading
            setProgress(targetProgress);
            setMessage(messages[messageIndex]);
            
            if (targetProgress === 100) {
              setTimeout(() => {
                onComplete && onComplete();
              }, 150);
            }
          }
        }, time);
      });
    } else {
      setProgress(0);
      setMessage(messages[0]);
    }
  }, [isLoading, onComplete]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/96 backdrop-blur-md"
        >
          <div className="text-center max-w-md mx-auto px-6">
            {/* Enhanced Loading Icon */}
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
              }}
              className="w-20 h-20 mx-auto mb-8"
            >
              <div className="w-20 h-20 border-4 border-blue-200/30 border-t-blue-500 border-r-cyan-400 rounded-full shadow-lg"></div>
            </motion.div>

            {/* HireLift Logo with enhanced animation */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
              className="flex items-center justify-center gap-3 mb-10"
            >
              <motion.div 
                animate={{ 
                  boxShadow: [
                    "0 0 20px rgba(59, 130, 246, 0.3)",
                    "0 0 30px rgba(34, 211, 238, 0.4)",
                    "0 0 20px rgba(59, 130, 246, 0.3)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-400 to-cyan-400 flex items-center justify-center text-white font-bold text-xl shadow-xl"
              >
                H
              </motion.div>
              <span className="text-3xl font-bold tracking-tight text-white">
                HireLift
              </span>
            </motion.div>

            {/* Enhanced Progress Bar Container */}
            <div className="mb-8">
              <div className="w-full h-3 bg-slate-800/80 rounded-full overflow-hidden shadow-inner border border-slate-700/50">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 via-cyan-500 to-emerald-500 rounded-full shadow-lg relative overflow-hidden"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ 
                    duration: 0.8, 
                    ease: [0.25, 0.46, 0.45, 0.94] // Custom easing for smoother animation
                  }}
                >
                  {/* Enhanced shimmer effect */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-full"
                    animate={{ 
                      x: ["-100%", "100%"] 
                    }}
                    transition={{ 
                      duration: 1.5, 
                      repeat: Infinity, 
                      ease: "easeInOut",
                      repeatDelay: 0.5
                    }}
                  />
                  
                  {/* Progress glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full"></div>
                </motion.div>
              </div>
              
              {/* Enhanced progress percentage */}
              <motion.div 
                className="flex justify-between items-center mt-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="text-blue-300/80 text-sm font-medium">
                  Progress
                </div>
                <motion.span 
                  className="text-blue-300 font-bold text-lg tabular-nums"
                  animate={{ scale: progress === 100 ? [1, 1.1, 1] : 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {Math.round(progress)}%
                </motion.span>
              </motion.div>
            </div>

            {/* Enhanced Loading Message */}
            <motion.div
              className="mb-6"
              layout
            >
              <motion.p
                key={message}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="text-gray-300 text-lg font-medium"
              >
                {message}
              </motion.p>
            </motion.div>

            {/* Enhanced floating dots animation */}
            <div className="flex justify-center gap-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2.5 h-2.5 bg-blue-400 rounded-full"
                  animate={{
                    scale: [1, 1.4, 1],
                    opacity: [0.4, 1, 0.4],
                    y: [0, -8, 0]
                  }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    delay: i * 0.3,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>
          </div>

          {/* Enhanced background particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 bg-blue-400/20 rounded-full"
                initial={{
                  x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                  y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
                  scale: 0,
                  opacity: 0
                }}
                animate={{
                  y: [null, -50],
                  scale: [0, 1, 0],
                  opacity: [0, 0.6, 0],
                  x: [null, Math.random() * 100 - 50]
                }}
                transition={{
                  duration: Math.random() * 4 + 3,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                  ease: "easeOut"
                }}
              />
            ))}
          </div>

          {/* Subtle pulse overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 pointer-events-none"
            animate={{ 
              opacity: [0.3, 0.1, 0.3] 
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingBar;
