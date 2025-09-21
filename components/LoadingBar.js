'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LoadingBar = ({ isLoading, onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isLoading) {
      setProgress(0);
      
      // Smooth progress animation that accurately reflects loading state
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          // Increase progress gradually but slow down as it approaches completion
          if (prev < 70) {
            return prev + Math.random() * 10 + 5;
          } else if (prev < 90) {
            return prev + Math.random() * 3 + 1;
          } else if (prev < 98) {
            return prev + Math.random() * 1 + 0.5;
          }
          return prev;
        });
      }, 100);

      return () => clearInterval(progressInterval);
    } else {
      // Complete the loading bar and trigger onComplete
      setProgress(100);
      const completeTimeout = setTimeout(() => {
        onComplete && onComplete();
        setProgress(0);
      }, 200);
      
      return () => clearTimeout(completeTimeout);
    }
  }, [isLoading, onComplete]);

  return (
    <AnimatePresence>
      {(isLoading || progress > 0) && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.2 }}
          className="fixed top-0 left-0 right-0 z-[9999] h-1 bg-slate-200/10"
        >
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 via-cyan-500 to-emerald-500 relative overflow-hidden shadow-lg"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ 
              duration: 0.3, 
              ease: "easeOut"
            }}
          >
            {/* Shimmer effect for active loading */}
            {isLoading && progress < 100 && (
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-20"
                animate={{ 
                  x: ["-5rem", "100vw"] 
                }}
                transition={{ 
                  duration: 1.2, 
                  repeat: Infinity, 
                  ease: "easeInOut"
                }}
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingBar;
