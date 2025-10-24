'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCrown, FaTimes, FaCheckCircle, FaRocket, FaHeart, FaStar } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function AuditExhaustedPopup({ isOpen, onClose, user }) {
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      // Show popup after 2 seconds
      const timer = setTimeout(() => {
        setIsVisible(true);
        
        // Track popup view for analytics
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'audit_exhausted_popup_shown', {
            event_category: 'conversion',
            event_label: 'free_audit_completed',
            value: 1
          });
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleUpgrade = () => {
    // Track upgrade click for analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'audit_exhausted_upgrade_clicked', {
        event_category: 'conversion',
        event_label: 'career_accelerator_cta',
        value: 1
      });
    }
    
    router.push('/pricing');
    onClose();
  };

  const handleDecline = () => {
    // Track the decline for analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'audit_upgrade_declined', {
        event_category: 'conversion',
        event_label: 'free_audit_exhausted'
      });
    }
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleDecline();
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 overflow-y-auto"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ 
              duration: 0.4, 
              type: "spring", 
              stiffness: 300, 
              damping: 25 
            }}
            className="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 my-8 relative overflow-hidden max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 opacity-60"></div>
            
            {/* Close Button */}
            <button
              onClick={handleDecline}
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/80 hover:bg-white shadow-md flex items-center justify-center text-gray-500 hover:text-gray-700 transition-all duration-200"
            >
              <FaTimes className="w-4 h-4" />
            </button>

            {/* Scrollable Content */}
            <div className="relative z-10 overflow-y-auto flex-1 custom-scrollbar">
              <div className="p-6 sm:p-8">
              {/* Header with Animation */}
              <div className="text-center mb-4 sm:mb-6">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-orange-400 to-red-500 rounded-full mb-3 sm:mb-4 shadow-lg"
                >
                  <FaHeart className="text-white text-2xl sm:text-3xl animate-pulse" />
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-xl sm:text-2xl font-bold text-gray-900 mb-2"
                >
                  Oops! Your Free Review is Exhausted 😔
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-600 text-base sm:text-lg leading-relaxed"
                >
                  You've used your <strong>1 Free Review</strong>. Don't let your career dreams slip away!
                </motion.p>
              </div>

              {/* Emotional Impact Section */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-100 rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6"
              >
                <div className="text-center">
                  <div className="text-red-600 font-bold text-base sm:text-lg mb-2 sm:mb-3">
                    ⚠️ The Cost of Waiting:
                  </div>
                  <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-red-800">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-xl sm:text-2xl">💔</span>
                      <div className="text-left">
                        <div className="font-bold">No more resume optimization</div>
                        <div className="text-xs text-red-600">Your resume stays unoptimized forever</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-xl sm:text-2xl">😰</span>
                      <div className="text-left">
                        <div className="font-bold">67% lower interview chances</div>
                        <div className="text-xs text-red-600">ATS systems will likely reject your resume</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-xl sm:text-2xl">😞</span>
                      <div className="text-left">
                        <div className="font-bold">Missing ₹2.5L+ salary opportunities</div>
                        <div className="text-xs text-red-600">Every day you wait costs you potential income</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Career Accelerator Benefits */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6"
              >
                <div className="text-center mb-3 sm:mb-4">
                  <div className="inline-flex items-center gap-2 text-green-700 font-bold text-base sm:text-lg mb-1 sm:mb-2">
                    <FaCrown className="text-yellow-500" />
                    Unlock Career Accelerator Plan
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-green-800 mb-1">
                    3x Faster Results Guaranteed! 🚀
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2 sm:gap-3 text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <FaCheckCircle className="text-green-500 flex-shrink-0" />
                    <span className="text-green-800 font-medium">Unlimited Resume Reviews</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCheckCircle className="text-green-500 flex-shrink-0" />
                    <span className="text-green-800 font-medium">1,000+ HR Directory</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCheckCircle className="text-green-500 flex-shrink-0" />
                    <span className="text-green-800 font-medium">Advanced ATS Optimization</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCheckCircle className="text-green-500 flex-shrink-0" />
                    <span className="text-green-800 font-medium">Priority Expert Support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCheckCircle className="text-green-500 flex-shrink-0" />
                    <span className="text-green-800 font-medium">Email Templates Library</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCheckCircle className="text-green-500 flex-shrink-0" />
                    <span className="text-green-800 font-medium">Premium Jobs Access</span>
                  </div>
                </div>

                {/* Social Proof */}
                <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-green-200">
                  <div className="flex items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm text-green-700 mb-3 sm:mb-4">
                    <div className="text-center">
                      <div className="font-bold text-base sm:text-lg">5,000+</div>
                      <div className="text-xs">Success Stories</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-base sm:text-lg">95%</div>
                      <div className="text-xs">ATS Pass Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-base sm:text-lg">4.9★</div>
                      <div className="text-xs">User Rating</div>
                    </div>
                  </div>
                  
                  {/* Quick Testimonials */}
                  <div className="bg-white/60 rounded-lg p-2 sm:p-3 border border-green-100">
                    <div className="text-xs text-green-800 italic text-center mb-1 sm:mb-2">
                      "Got 3 interview calls in first week after upgrading!" 
                    </div>
                    <div className="text-xs text-green-600 font-medium text-center">
                      ⭐⭐⭐⭐⭐ - Priya S., Software Engineer
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Urgency Element */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
                className="bg-gradient-to-r from-orange-100 to-red-100 border border-orange-200 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 text-center relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-red-500 animate-pulse"></div>
                <div className="text-orange-800 font-bold text-sm sm:text-base mb-1">
                  🔥 EXCLUSIVE: 50% OFF + Bonus HR Directory Access
                </div>
                <div className="text-orange-700 text-xs sm:text-sm mb-2">
                  <strong>532 professionals</strong> upgraded this month to accelerate their careers!
                </div>
                <div className="inline-flex items-center gap-2 bg-white/80 px-2 sm:px-3 py-1 rounded-full text-xs font-bold text-orange-800">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  Only available for the next 15 minutes
                </div>
              </motion.div>

              {/* Action Buttons */}
              <div className="space-y-2 sm:space-y-3">
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  onClick={handleUpgrade}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 sm:gap-3 text-base sm:text-lg group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  <FaRocket className="w-4 h-4 sm:w-5 sm:h-5 group-hover:animate-bounce relative z-10" />
                  <span className="relative z-10">YES! Accelerate My Career Now</span>
                  <motion.span
                    animate={{ x: [0, 3, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="relative z-10"
                  >
                    🚀
                  </motion.span>
                  <div className="absolute top-2 right-0 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-full transform rotate-12">
                    50% OFF
                  </div>
                </motion.button>

                {/* Emotional Impact Decline Button */}
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  onClick={handleDecline}
                  className="w-full text-gray-500 hover:text-red-500 font-medium py-2 sm:py-3 px-4 sm:px-6 rounded-xl border border-gray-200 hover:border-red-200 transition-all duration-200 text-xs sm:text-sm bg-white/50 hover:bg-red-50/30 group"
                >
                  <span className="flex items-center justify-center gap-1 sm:gap-2">
                    <span className="group-hover:animate-pulse">😔</span>
                    <span>No thanks, I'll keep getting rejected</span>
                    <span className="group-hover:animate-pulse">💔</span>
                  </span>
                  <div className="text-xs text-gray-400 mt-1 group-hover:text-red-400">
                    (Continue with 67% lower success rate)
                  </div>
                </motion.button>
              </div>

              {/* Trust Signals */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0 }}
                className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200 text-center"
              >
                <div className="flex items-center justify-center gap-2 sm:gap-4 text-xs text-gray-500 flex-wrap">
                  <div className="flex items-center gap-1">
                    <FaCheckCircle className="text-green-500" />
                    <span>30-Day Interview</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaCheckCircle className="text-green-500" />
                    <span>No Hidden Fees</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaCheckCircle className="text-green-500" />
                    <span>Cancel Anytime</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-400 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-blue-400 rounded-full opacity-20 animate-pulse"></div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}