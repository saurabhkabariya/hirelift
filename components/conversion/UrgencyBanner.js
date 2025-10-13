'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import CountdownTimer from './CountdownTimer';

export default function UrgencyBanner({ onCTAClick }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Show banner after 10 seconds of page load
    const timer = setTimeout(() => {
      if (!isDismissed) {
        setIsVisible(true);
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, [isDismissed]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
  };

  const handleCTA = () => {
    if (onCTAClick) onCTAClick();
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-2 sm:bottom-4 left-2 right-2 sm:left-4 sm:right-4 z-50 mx-auto max-w-4xl"
        >
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg sm:rounded-xl shadow-2xl p-2 sm:p-4">
            <div className="flex items-center justify-between gap-2 sm:gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-3">
                  <div className="min-w-0">
                    <p className="font-bold text-sm sm:text-lg truncate">⚡ Limited Time Offer!</p>
                    <p className="text-xs sm:text-sm opacity-90 truncate">50% OFF + Premium HRs access</p>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                    <span className="whitespace-nowrap">Expires in:</span>
                    <CountdownTimer 
                      targetDate={new Date(Date.now() + 24 * 60 * 60 * 1000)}
                      onExpiry={() => setIsVisible(false)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                <button
                  onClick={handleCTA}
                  className="bg-white text-orange-600 px-2 py-1 sm:px-4 sm:py-2 rounded-md sm:rounded-lg font-bold text-xs sm:text-sm hover:bg-orange-50 transition-all duration-200 whitespace-nowrap"
                >
                  Claim Now
                </button>
                <button
                  onClick={handleDismiss}
                  className="text-white/80 hover:text-white p-1 rounded"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}