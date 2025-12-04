'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useLoading } from '@/contexts/LoadingContext';

const UniversalLoadingBar = () => {
  const [progress, setProgress] = useState(0);
  const [isRouteLoading, setIsRouteLoading] = useState(false);
  const { isLoading: contextLoading } = useLoading();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const progressTimeoutRef = useRef(null);
  const forceCompleteTimeoutRef = useRef(null);

  // Track route changes
  useEffect(() => {
    setIsRouteLoading(true);
    setProgress(0);

    // Set a maximum timeout to prevent hanging
    const maxTimeout = setTimeout(() => {
      setIsRouteLoading(false);
    }, 2000); // Maximum 2 seconds for route loading

    const loadingTimer = setTimeout(() => {
      setIsRouteLoading(false);
    }, 600); // Normal route loading time

    return () => {
      clearTimeout(maxTimeout);
      clearTimeout(loadingTimer);
    };
  }, [pathname, searchParams]);

  // Combined loading state
  const isLoading = isRouteLoading || contextLoading;

  // Safety mechanism: force complete after maximum time
  useEffect(() => {
    if (isLoading) {
      // Clear any existing force complete timeout
      if (forceCompleteTimeoutRef.current) {
        clearTimeout(forceCompleteTimeoutRef.current);
      }
      
      // Force complete after 3 seconds to prevent hanging
      forceCompleteTimeoutRef.current = setTimeout(() => {
        console.warn('Loading bar force completed due to timeout');
        setIsRouteLoading(false);
        setProgress(100);
        setTimeout(() => setProgress(0), 400);
      }, 3000);
    } else {
      // Clear force complete timeout when loading finishes normally
      if (forceCompleteTimeoutRef.current) {
        clearTimeout(forceCompleteTimeoutRef.current);
        forceCompleteTimeoutRef.current = null;
      }
    }

    return () => {
      if (forceCompleteTimeoutRef.current) {
        clearTimeout(forceCompleteTimeoutRef.current);
        forceCompleteTimeoutRef.current = null;
      }
    };
  }, [isLoading]);

  useEffect(() => {
    // Clear any existing timeouts
    if (progressTimeoutRef.current) {
      clearTimeout(progressTimeoutRef.current);
      progressTimeoutRef.current = null;
    }

    if (isLoading) {
      setProgress(0);
      
      // Smooth progress animation
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev < 70) {
            return prev + Math.random() * 15 + 8;
          } else if (prev < 90) {
            return prev + Math.random() * 5 + 2;
          } else if (prev < 95) {
            return prev + Math.random() * 2 + 0.5;
          }
          // Stop at 95% and wait for completion
          return Math.min(prev, 95);
        });
      }, 120);

      return () => clearInterval(progressInterval);
    } else {
      // Force complete the loading bar immediately
      setProgress(100);
      
      // Reset after a short delay
      progressTimeoutRef.current = setTimeout(() => {
        setProgress(0);
      }, 400);
      
      return () => {
        if (progressTimeoutRef.current) {
          clearTimeout(progressTimeoutRef.current);
          progressTimeoutRef.current = null;
        }
      };
    }
  }, [isLoading]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (progressTimeoutRef.current) {
        clearTimeout(progressTimeoutRef.current);
      }
      if (forceCompleteTimeoutRef.current) {
        clearTimeout(forceCompleteTimeoutRef.current);
      }
    };
  }, []);

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