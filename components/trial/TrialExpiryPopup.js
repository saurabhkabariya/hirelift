'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCrown, FaTimes, FaRocket, FaHeart, FaClock, FaGift } from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';

export default function TrialExpiryPopup({ 
  isVisible, 
  onClose, 
  onUpgrade, 
  daysRemaining = 0,
  trialEndDate = null 
}) {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isVisible) return null;

  const isExpired = daysRemaining <= 0;
  const isAlmostExpired = daysRemaining <= 2 && daysRemaining > 0;

  const handleUpgradeClick = () => {
    onUpgrade();
    onClose();
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.7,
      y: -50
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300
      }
    },
    exit: {
      opacity: 0,
      scale: 0.7,
      y: -50,
      transition: { duration: 0.2 }
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
        onClick={onClose}
        data-testid="trial-expiry-popup"
      >
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Background */}
          <div className="bg-gradient-to-r from-red-500 to-pink-500 px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                {isExpired ? (
                  <FaClock className="text-white text-2xl" />
                ) : (
                  <FaGift className="text-white text-2xl" />
                )}
                <h3 className="text-white font-bold text-xl">
                  {isExpired ? 'Trial Expired' : 'Trial Ending Soon'}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Status Message */}
            <div className="text-center mb-6">
              {isExpired ? (
                <div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-2">
                    Your free trial has ended
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    Don't lose momentum! Continue your career transformation with the 
                    <span className="font-semibold text-cyan-600"> Career Accelerator plan</span>.
                  </p>
                </div>
              ) : (
                <div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-2">
                    Only {daysRemaining} day{daysRemaining !== 1 ? 's' : ''} left!
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    Your trial ends soon. Upgrade now to keep your 
                    <span className="font-semibold text-cyan-600"> premium access</span>.
                  </p>
                </div>
              )}
            </div>

            {/* Benefits Reminder */}
            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl p-4 mb-6">
              <h5 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <FaCrown className="text-yellow-500" />
                What you'll keep with Career Accelerator:
              </h5>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  Unlimited Resume Reviews
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  1,000+ HR Directory Access
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  Advanced ATS Optimization
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  Priority Expert Support
                </li>
              </ul>
            </div>

            {/* User Stats */}
            {user && (
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <h5 className="font-semibold text-gray-900 mb-2">Your Progress:</h5>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-cyan-600">
                      {user.auditCount || 0}
                    </div>
                    <div className="text-xs text-gray-600">Resume Reviews</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {user.highestATSScore || 0}%
                    </div>
                    <div className="text-xs text-gray-600">Best ATS Score</div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <motion.button
                onClick={handleUpgradeClick}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
              >
                <FaRocket className="w-5 h-5" />
                Continue with Career Accelerator
              </motion.button>
              
              <button
                onClick={onClose}
                className="w-full bg-gray-100 text-gray-700 font-medium py-3 px-6 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Maybe Later
              </button>
            </div>

            {/* Emotional Touch */}
            <div className="text-center mt-4">
              <p className="text-sm text-gray-500 flex items-center justify-center gap-1">
                <FaHeart className="text-red-400 w-3 h-3" />
                Join 50,000+ professionals who transformed their careers
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}