'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCrown, FaTimes, FaCheckCircle, FaRocket, FaHeart, FaStar, FaGift, FaClock } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useTrialStatus } from '@/hooks/useTrialStatus';

export default function AuditExhaustedPopup({ isOpen, onClose, user }) {
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();
  const trialData = useTrialStatus();
  
  // Safely destructure with defaults
  const {
    isTrialActive = false,
    claimTrial,
    claimingTrial = false
  } = trialData || {};
  
  // Check if user can claim trial (hasn't claimed before and isn't premium)
  const canClaimTrial = user && !user.hasClaimedTrial && !user.isPremium && !isTrialActive;

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
            trial_eligible: canClaimTrial,
            value: 1
          });
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, canClaimTrial]);

  const handleClaimTrial = async () => {
    if (claimingTrial) return;
    
    // Track trial claim attempt
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'trial_claim_attempted', {
        event_category: 'conversion',
        event_label: 'audit_exhausted_popup',
        value: 1
      });
    }

    const result = await claimTrial();
    
    if (result.success) {
      // Track successful trial claim
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'trial_claimed_success', {
          event_category: 'conversion',
          event_label: 'audit_exhausted_popup',
          value: 1
        });
      }
      
      // Close popup and potentially show success message
      onClose();
      
      // Optional: Show a success toast or redirect
      // You could add a success callback prop if needed
    } else {
      // Track failed trial claim
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'trial_claim_failed', {
          event_category: 'conversion',
          event_label: 'audit_exhausted_popup',
          error: result.error
        });
      }
    }
  };

  const handleUpgradeToPaid = () => {
    // Track upgrade to paid click for analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'paid_upgrade_clicked', {
        event_category: 'conversion',
        event_label: 'audit_exhausted_popup',
        from_trial_ineligible: !canClaimTrial,
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
        event_label: 'free_audit_exhausted',
        trial_eligible: canClaimTrial
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
                  className={`inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full mb-3 sm:mb-4 shadow-lg ${
                    canClaimTrial 
                      ? 'bg-gradient-to-r from-green-400 to-emerald-500' 
                      : 'bg-gradient-to-r from-orange-400 to-red-500'
                  }`}
                >
                  {canClaimTrial ? (
                    <FaGift className="text-white text-2xl sm:text-3xl animate-bounce" />
                  ) : (
                    <FaHeart className="text-white text-2xl sm:text-3xl animate-pulse" />
                  )}
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-xl sm:text-2xl font-bold text-gray-900 mb-2"
                >
                  {canClaimTrial ? (
                    <>🎉 Good News! You're Eligible for FREE Trial!</>
                  ) : (
                    <>😔 Your Free Review is Exhausted</>
                  )}
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-600 text-base sm:text-lg leading-relaxed"
                >
                  {canClaimTrial ? (
                    <>Get <strong>7 days of unlimited reviews</strong> absolutely FREE - no credit card required!</>
                  ) : (
                    <>You've used your <strong>1 Free Review</strong>. Don't let your career dreams slip away!</>
                  )}
                </motion.p>
              </div>

              {/* Trial Offer Section - Primary CTA */}
              {canClaimTrial ? (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6"
                >
                  <div className="text-center mb-3 sm:mb-4">
                    <div className="inline-flex items-center gap-2 text-green-700 font-bold text-base sm:text-lg mb-1 sm:mb-2">
                      <FaGift className="text-green-600" />
                      7-Day FREE Trial
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-green-800 mb-1">
                      Continue Your Career Journey! 🚀
                    </div>
                    <div className="text-sm text-green-600 mb-3">
                      No Credit Card • Cancel Anytime • Instant Access
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-2 sm:gap-3 text-xs sm:text-sm mb-4">
                    <div className="flex items-center gap-2">
                      <FaCheckCircle className="text-green-500 flex-shrink-0" />
                      <span className="text-green-800 font-medium">✨ Unlimited Resume Reviews (7 Days)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaCheckCircle className="text-green-500 flex-shrink-0" />
                      <span className="text-green-800 font-medium">🎯 Advanced ATS Optimization</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaCheckCircle className="text-green-500 flex-shrink-0" />
                      <span className="text-green-800 font-medium">� Premium Jobs Access</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaCheckCircle className="text-green-500 flex-shrink-0" />
                      <span className="text-green-800 font-medium">🏢 1,000+ HR Directory Access</span>
                    </div>
                  </div>

                  {/* Urgency for Trial */}
                  <div className="bg-white/60 rounded-lg p-3 border border-green-100">
                    <div className="flex items-center justify-center gap-2 text-green-700 text-sm font-medium">
                      <FaClock className="animate-pulse" />
                      <span>Perfect timing! Start optimizing your resume right now</span>
                    </div>
                  </div>
                </motion.div>
              ) : (
                /* Paid Plan Promotion for Users Who Can't Claim Trial */
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6"
                >
                  <div className="text-center mb-3 sm:mb-4">
                    <div className="inline-flex items-center gap-2 text-blue-700 font-bold text-base sm:text-lg mb-1 sm:mb-2">
                      <FaCrown className="text-yellow-500" />
                      Career Accelerator Plan
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-blue-800 mb-1">
                      3x Faster Results Guaranteed! 🚀
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-2 sm:gap-3 text-xs sm:text-sm">
                    <div className="flex items-center gap-2">
                      <FaCheckCircle className="text-blue-500 flex-shrink-0" />
                      <span className="text-blue-800 font-medium">Unlimited Resume Reviews</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaCheckCircle className="text-blue-500 flex-shrink-0" />
                      <span className="text-blue-800 font-medium">1,000+ HR Directory</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaCheckCircle className="text-blue-500 flex-shrink-0" />
                      <span className="text-blue-800 font-medium">Advanced ATS Optimization</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaCheckCircle className="text-blue-500 flex-shrink-0" />
                      <span className="text-blue-800 font-medium">Priority Expert Support</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Social Proof & Urgency */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
                className="bg-gradient-to-r from-purple-100 to-blue-100 border border-purple-200 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 text-center relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-blue-500 animate-pulse"></div>
                <div className="text-purple-800 font-bold text-sm sm:text-base mb-1">
                  🚀 Join 5,000+ Successful Job Seekers
                </div>
                <div className="text-purple-700 text-xs sm:text-sm mb-2">
                  <strong>95% ATS pass rate</strong> • <strong>3x faster interviews</strong> • <strong>4.9★ rating</strong>
                </div>
                <div className="text-xs text-purple-600 italic">
                  "Got my dream job in 2 weeks!" - Priya S., Software Engineer
                </div>
              </motion.div>

              {/* Action Buttons */}
              <div className="space-y-2 sm:space-y-3">
                {canClaimTrial ? (
                  /* Primary CTA: Claim Free Trial */
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    onClick={handleClaimTrial}
                    disabled={claimingTrial}
                    whileHover={{ scale: claimingTrial ? 1 : 1.02 }}
                    whileTap={{ scale: claimingTrial ? 1 : 0.98 }}
                    className="w-full bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 sm:gap-3 text-base sm:text-lg group relative overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    {claimingTrial ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Activating Your Free Trial...</span>
                      </div>
                    ) : (
                      <>
                        <FaGift className="w-4 h-4 sm:w-5 sm:h-5 group-hover:animate-bounce relative z-10" />
                        <span className="relative z-10">YES! Start My 7-Day FREE Trial</span>
                        <motion.span
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="relative z-10"
                        >
                          🎉
                        </motion.span>
                      </>
                    )}
                    <div className="absolute top-2 right-2 bg-white text-green-600 text-xs font-bold px-2 py-1 rounded-full">
                      FREE
                    </div>
                  </motion.button>
                ) : (
                  /* Primary CTA: Upgrade to Paid Plan */
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    onClick={handleUpgradeToPaid}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 sm:gap-3 text-base sm:text-lg group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    <FaRocket className="w-4 h-4 sm:w-5 sm:h-5 group-hover:animate-bounce relative z-10" />
                    <span className="relative z-10">Accelerate My Career Now</span>
                    <motion.span
                      animate={{ x: [0, 3, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="relative z-10"
                    >
                      🚀
                    </motion.span>
                    <div className="absolute top-2 right-2 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-full">
                      50% OFF
                    </div>
                  </motion.button>
                )}

                {/* Secondary CTA: View All Plans */}
                {canClaimTrial && (
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    onClick={handleUpgradeToPaid}
                    className="w-full text-blue-600 hover:text-blue-700 font-medium py-2 sm:py-3 px-4 sm:px-6 rounded-xl border border-blue-200 hover:border-blue-300 transition-all duration-200 text-xs sm:text-sm bg-white/50 hover:bg-blue-50 group"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <FaCrown className="text-yellow-500" />
                      <span>Or View Premium Plans</span>
                      <span>�</span>
                    </span>
                  </motion.button>
                )}

                {/* Decline Button */}
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 }}
                  onClick={handleDecline}
                  className="w-full text-gray-500 hover:text-red-500 font-medium py-2 sm:py-3 px-4 sm:px-6 rounded-xl border border-gray-200 hover:border-red-200 transition-all duration-200 text-xs sm:text-sm bg-white/50 hover:bg-red-50/30 group"
                >
                  <span className="flex items-center justify-center gap-1 sm:gap-2">
                    <span className="group-hover:animate-pulse">😔</span>
                    <span>No thanks, I'll continue without optimization</span>
                    <span className="group-hover:animate-pulse">💔</span>
                  </span>
                </motion.button>
              </div>

              {/* Trust Signals */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 }}
                className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200 text-center"
              >
                <div className="flex items-center justify-center gap-2 sm:gap-4 text-xs text-gray-500 flex-wrap">
                  <div className="flex items-center gap-1">
                    <FaCheckCircle className="text-green-500" />
                    <span>{canClaimTrial ? 'No Credit Card' : '30-Day Money Back'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaCheckCircle className="text-green-500" />
                    <span>Cancel Anytime</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaCheckCircle className="text-green-500" />
                    <span>Instant Access</span>
                  </div>
                </div>
                
                {canClaimTrial && (
                  <div className="mt-3 text-xs text-green-600 font-medium">
                    🎯 Perfect! You qualify for our exclusive 7-day free trial
                  </div>
                )}
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