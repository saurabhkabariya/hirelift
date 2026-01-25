'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, Clock, Star } from 'lucide-react';

export default function ExitIntentPopup({ onCTAClick }) {
  // Add custom scrollbar styles
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: #f1f5f9;
        border-radius: 3px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #cbd5e1;
        border-radius: 3px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #94a3b8;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    let timeout;
    
    const handleMouseLeave = (e) => {
      // Only show if mouse is leaving from the top of the page and we haven't shown it before
      if (e.clientY <= 0 && !hasShown) {
        timeout = setTimeout(() => {
          setIsVisible(true);
          setHasShown(true);
        }, 300);
      }
    };

    const handleMouseEnter = () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };

    // Also show after 30 seconds if user hasn't left
    const fallbackTimer = setTimeout(() => {
      if (!hasShown) {
        setIsVisible(true);
        setHasShown(true);
      }
    }, 30000);

    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (timeout) clearTimeout(timeout);
      clearTimeout(fallbackTimer);
    };
  }, [hasShown]);

  const handleCTA = () => {
    if (onCTAClick) onCTAClick();
    setIsVisible(false);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gradient-to-r from-red-500 to-red-400 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] flex flex-col p-4 sm:p-6 relative overflow-y-auto custom-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-200 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 z-20"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Header */}
            <div className="text-center mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4  border-2 border-white">
                <Gift className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white/90 mb-2">
                Wait! Don't Miss Out!
              </h2>
              <p className="text-sm sm:text-base text-white/90">
                Before you go, claim your exclusive offer
              </p>
            </div>

            {/* Offer details */}
            <div className="bg-gradient-to-r from-green-200 to-green-400 border border-green-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                <span className="font-bold text-sm sm:text-base text-orange-800">Limited Time Offer!</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
                Get Everything You Need to Land Your Dream Job - Absolutely FREE
              </h3>
              <ul className="text-xs sm:text-sm text-gray-700 space-y-1.5 sm:space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>1 Resume Review with ATS Score & Detailed Feedback (Worth $10)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Professional Email Templates Access</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Job Board Access with 100+ Fresh Opportunities</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Community Support from Job Seekers Like You</span>
                </li>
              </ul>
            </div>

            {/* Social proof */}
            <div className="flex items-center justify-center gap-2 mb-4 sm:mb-6 text-xs sm:text-sm  text-white/90 dark:text-gray-400">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span>Join 100+ registered users</span>
            </div>

            {/* CTA */}
            <div className="space-y-2 sm:space-y-3">
              <button
                onClick={handleCTA}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3 px-4 sm:px-6 rounded-xl shadow-lg hover:shadow-orange-500/30 transition-all duration-200 text-sm sm:text-base"
              >
                Claim My FREE Package Now
              </button>
              <p className="text-xs text-center  text-white/90 dark:text-gray-400">
                <span className="text-green-300 font-bold">✓</span> No Credit Card Required • <span className="text-green-300 font-bold">✓</span> 100% Free • <span className="text-green-300 font-bold">✓</span> Instant Access
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}