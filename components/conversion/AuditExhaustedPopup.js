'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCrown, FaTimes, FaCheckCircle, FaRocket, FaHeart, FaStar, FaClock, FaFire, FaBolt } from 'react-icons/fa';
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
            event_label: 'career_accelerator_promotion',
            value: 1
          });
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleUpgradeClick = () => {
    // Track upgrade click for analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'career_accelerator_clicked', {
        event_category: 'conversion',
        event_label: 'audit_exhausted_popup',
        value: 1
      });
    }
    
    router.push('/pricing');
    onClose();
  };

  const handleDecline = () => {
    // Track the decline for analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'career_accelerator_declined', {
        event_category: 'conversion',
        event_label: 'audit_exhausted_popup'
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
                    className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full mb-3 sm:mb-4 shadow-lg bg-gradient-to-r from-orange-500 via-red-500 to-pink-500"
                  >
                    <FaRocket className="text-white text-2xl sm:text-3xl animate-bounce" />
                  </motion.div>

                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-xl sm:text-2xl font-bold text-gray-900 mb-2"
                  >
                    💔 Your Free Review is Complete
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-gray-600 text-base sm:text-lg leading-relaxed"
                  >
                    Don't stop now! <strong>5,000+ job seekers</strong> accelerated their careers with unlimited reviews.
                    <span className="block mt-2 text-orange-600 font-semibold">Your dream job is just one step away! 🚀</span>
                  </motion.p>
                </div>

                {/* Career Accelerator Promotion - Primary Section */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-gradient-to-r from-orange-50 via-red-50 to-pink-50 border-2 border-orange-300 rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 relative overflow-hidden"
                >
                  {/* Popular Badge */}
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-1 rounded-bl-2xl font-bold text-xs flex items-center gap-1 shadow-lg">
                    <FaFire className="animate-pulse" />
                    <span>MOST POPULAR</span>
                  </div>

                  <div className="text-center mb-3 sm:mb-4 mt-2">
                    <div className="inline-flex items-center gap-2 text-orange-700 font-bold text-base sm:text-lg mb-1 sm:mb-2">
                      <FaCrown className="text-yellow-500" />
                      Career Accelerator
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 mb-2">
                      Get Hired 3x Faster! 🚀
                    </div>
                    {/* <div className="flex items-center justify-center gap-3 mb-2">
                      <span className="text-2xl sm:text-3xl font-bold text-orange-600">₹99</span>
                      <span className="text-lg text-gray-400 line-through">₹199</span>
                      <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">50% OFF</span>
                    </div> */}
                    <div className="text-sm text-orange-600 font-medium">
                      30 Days • Cancel Anytime • Instant Access
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-2 sm:gap-3 text-xs sm:text-sm mb-4">
                    <div className="flex items-center gap-2">
                      <FaCheckCircle className="text-orange-500 flex-shrink-0" />
                      <span className="text-gray-800 font-medium"><strong>Unlimited Resume Reviews</strong> (Worth $10+ each)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaCheckCircle className="text-orange-500 flex-shrink-0" />
                      <span className="text-gray-800 font-medium"><strong>100+ HR Directory Access</strong> - Direct to decision makers</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaCheckCircle className="text-orange-500 flex-shrink-0" />
                      <span className="text-gray-800 font-medium"><strong>Advanced ATS Optimization</strong> - 95% pass rate</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaCheckCircle className="text-orange-500 flex-shrink-0" />
                      <span className="text-gray-800 font-medium"><strong>Proven Email Templates Library</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaCheckCircle className="text-orange-500 flex-shrink-0" />
                      <span className="text-gray-800 font-medium"><strong>Priority Expert Support</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaCheckCircle className="text-orange-500 flex-shrink-0" />
                      <span className="text-gray-800 font-medium"><strong>Access to Beta features</strong></span>
                    </div>
                  </div>

                  {/* Urgency Banner */}
                  <div className="bg-gradient-to-r from-red-100 to-orange-100 rounded-lg p-3 border border-red-200">
                    <div className="flex items-center justify-center gap-2 text-red-700 text-sm font-bold">
                      <FaClock className="animate-pulse" />
                      <span>⏰ Limited Time: 50% OFF ends soon!</span>
                    </div>
                  </div>
                </motion.div>

                {/* Emotional Appeal & Social Proof */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 }}
                  className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse"></div>
                  
                  {/* Emotional Hook */}
                  <div className="text-center mb-3">
                    <div className="text-gray-800 font-bold text-sm sm:text-base mb-2">
                      💭 <span className="text-red-600">Imagine...</span>
                    </div>
                    <div className="text-gray-700 text-xs sm:text-sm leading-relaxed mb-3">
                      <span className="block mb-1">❌ Sending 100+ applications with no replies...</span>
                      <span className="block mb-1">❌ Wondering why recruiters ignore your resume...</span>
                      <span className="block text-orange-600 font-semibold">😔 Watching others get your dream job...</span>
                    </div>
                    <div className="text-green-700 font-bold text-sm sm:text-base">
                      ✨ Or Get Noticed by HRs & Land Interviews Fast!
                    </div>
                  </div>

                  {/* Social Proof */}
                  <div className="border-t border-blue-200 pt-3">
                    <div className="text-blue-800 font-bold text-sm sm:text-base mb-1">
                      🎯 Join 5,000+ Successful Job Seekers
                    </div>
                    <div className="text-blue-700 text-xs sm:text-sm mb-2">
                      <strong>95% ATS pass rate</strong> • <strong>3x faster interviews</strong> • <strong>4.9★ rating</strong>
                    </div>
                    <div className="text-xs text-blue-600 italic">
                      💬 "Got my dream job in 2 weeks!" - Priya S., Software Engineer
                    </div>
                  </div>
                </motion.div>

                {/* Action Buttons */}
                <div className="space-y-2 sm:space-y-3">
                  {/* Primary CTA: Get Career Accelerator */}
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    onClick={handleUpgradeClick}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 sm:gap-3 text-base sm:text-lg group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-500 opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                    <FaRocket className="w-4 h-4 sm:w-5 sm:h-5 group-hover:animate-bounce relative z-10" />
                    <span className="relative z-10">YES! Get 3x Faster Results</span>
                    <motion.span
                      animate={{ rotate: [0, 15, -15, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="relative z-10"
                    >
                      🚀
                    </motion.span>
                    <div className="absolute top-2 right-2 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                      50% OFF
                    </div>
                  </motion.button>

                  {/* Decline Button with Strong Emotional Hook */}
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    onClick={handleDecline}
                    className="w-full text-gray-500 hover:text-red-600 font-medium py-2 sm:py-3 px-4 sm:px-6 rounded-xl border border-gray-200 hover:border-red-300 transition-all duration-200 text-xs sm:text-sm bg-white/50 hover:bg-red-50/50 group"
                  >
                    <span className="flex flex-col items-center justify-center gap-1">
                      <span className="flex items-center gap-2">
                        <span className="group-hover:animate-pulse">😔</span>
                        <span>No thanks, I'll keep getting ignored by HRs</span>
                        <span className="group-hover:animate-pulse">💔</span>
                      </span>
                      <span className="text-xs text-red-500 group-hover:font-semibold">...and miss out on my dream job opportunities</span>
                    </span>
                  </motion.button>
                </div>

                {/* Trust Signals & Guarantee */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.0 }}
                  className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200 text-center"
                >
                  <div className="flex items-center justify-center gap-2 sm:gap-4 text-xs text-gray-600 flex-wrap mb-3">
                    <div className="flex items-center gap-1">
                      <FaCheckCircle className="text-green-500" />
                      <span className="font-medium">Instant Access</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaCheckCircle className="text-green-500" />
                      <span className="font-medium">Cancel Anytime</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaCheckCircle className="text-green-500" />
                      <span className="font-medium">Secure Payment</span>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-2 text-xs text-green-700 font-medium">
                    🛡️ <strong>30-Day Money-Back Guarantee</strong> - Risk-free investment in your career
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 z-50"></div>
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-400 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-orange-400 rounded-full opacity-20 animate-pulse z-50"></div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
