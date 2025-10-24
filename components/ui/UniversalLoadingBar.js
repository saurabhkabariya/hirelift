'use client';

import { useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useLoading } from '@/contexts/LoadingContext';

const UniversalLoadingBar = () => {
  const [progress, setProgress] = useState(0);
  const [isRouteLoading, setIsRouteLoading] = useState(false);
  const { isLoading: contextLoading } = useLoading();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Track route changes
  useEffect(() => {
    setIsRouteLoading(true);
    setProgress(0);

    const timer = setTimeout(() => {
      setIsRouteLoading(false);
    }, 500); // Simulate route loading time

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  // Combined loading state
  const isLoading = isRouteLoading || contextLoading;

  useEffect(() => {
    if (isLoading) {
      setProgress(0);
      
      // Smooth progress animation
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev < 70) {
            return prev + Math.random() * 15 + 8;
          } else if (prev < 90) {
            return prev + Math.random() * 5 + 2;
          } else if (prev < 98) {
            return prev + Math.random() * 2 + 0.5;
          }
          return prev;
        });
      }, 80);

      return () => clearInterval(progressInterval);
    } else {
      // Complete the loading bar
      setProgress(100);
      const completeTimeout = setTimeout(() => {
        setProgress(0);
      }, 300);
      
      return () => clearTimeout(completeTimeout);
    }
  }, [isLoading]);

  return (
    <AnimatePresence>
      {(isLoading || progress > 0) && (
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          exit={{ opacity: 0, scaleX: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed top-0 left-0 right-0 z-[99999] h-[3px] bg-gradient-to-r from-transparent via-slate-200/20 to-transparent"
          style={{ transformOrigin: 'left' }}
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
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                style={{ width: '150px' }}
                animate={{ 
                  x: ["-150px", "100vw"] 
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity, 
                  ease: "linear"
                }}
              />
            )}
            
            {/* Pulse effect at the tip */}
            {isLoading && (
              <motion.div
                className="absolute right-0 top-0 w-8 h-full bg-gradient-to-l from-white/60 to-transparent"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UniversalLoadingBar;