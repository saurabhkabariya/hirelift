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
          className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-4xl"
        >
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl shadow-2xl p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <div>
                    <p className="font-bold text-lg">⚡ Limited Time Offer!</p>
                    <p className="text-sm opacity-90">50% OFF + Premium HRs access</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Expires in:</span>
                    <CountdownTimer 
                      targetDate={new Date(Date.now() + 24 * 60 * 60 * 1000)}
                      onExpiry={() => setIsVisible(false)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCTA}
                  className="bg-white text-orange-600 px-4 py-2 rounded-lg font-bold text-sm hover:bg-orange-50 transition-all duration-200"
                >
                  Claim Now
                </button>
                <button
                  onClick={handleDismiss}
                  className="text-white/80 hover:text-white p-1 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}