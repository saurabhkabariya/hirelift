'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCrown, FaCheckCircle, FaLightbulb, FaChartLine } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function AuditExhaustedPopup({ isOpen, onClose, user }) {
  const router = useRouter();

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

  const handleBackdropClick = () => {
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-3 sm:p-4"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ scale: 0.8, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden max-h-[95vh] sm:max-h-[90vh] overflow-y-auto"
          >
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 p-6 sm:p-8 text-white text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-black bg-opacity-10"></div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="relative"
              >
                <FaCrown className="text-5xl sm:text-6xl mx-auto mb-3 sm:mb-4 drop-shadow-lg" />
              </motion.div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-2 relative">Free Review Used!</h2>
              <p className="text-orange-100 text-sm sm:text-base relative">You've already used your complimentary review</p>
            </div>

            {/* Content */}
            <div className="p-5 sm:p-8">
              <div className="text-center mb-5 sm:mb-6">
                <div className="inline-block bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full font-bold text-base sm:text-xl mb-3 sm:mb-4 shadow-lg">
                  🎉 Limited Time: 50% OFF!
                </div>
                <p className="text-gray-700 text-base sm:text-lg mb-3 sm:mb-4 px-2">
                  Upgrade to <span className="font-bold text-orange-600">Career Accelerator</span> and unlock unlimited resume reviews with detailed AI-powered suggestions!
                </p>
              </div>

              {/* Benefits */}
              <div className="space-y-2.5 sm:space-y-3 mb-5 sm:mb-6">
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="bg-green-100 rounded-full p-1.5 sm:p-2 mt-0.5 sm:mt-1 flex-shrink-0">
                    <FaCheckCircle className="text-green-600 text-sm sm:text-base" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 text-sm sm:text-base">Unlimited Resume Reviews</p>
                    <p className="text-xs sm:text-sm text-gray-600">Analyze as many resumes as you want, anytime</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="bg-purple-100 rounded-full p-1.5 sm:p-2 mt-0.5 sm:mt-1 flex-shrink-0">
                    <FaLightbulb className="text-purple-600 text-sm sm:text-base" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 text-sm sm:text-base">Detailed AI Suggestions</p>
                    <p className="text-xs sm:text-sm text-gray-600">Get actionable recommendations to improve your resume</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="bg-blue-100 rounded-full p-1.5 sm:p-2 mt-0.5 sm:mt-1 flex-shrink-0">
                    <FaChartLine className="text-blue-600 text-sm sm:text-base" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 text-sm sm:text-base">Advanced ATS Optimization</p>
                    <p className="text-xs sm:text-sm text-gray-600">Fix, test, and optimize until your resume is recruiter-ready</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="bg-orange-100 rounded-full p-1.5 sm:p-2 mt-0.5 sm:mt-1 flex-shrink-0">
                    <FaCheckCircle className="text-orange-600 text-sm sm:text-base" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 text-sm sm:text-base">100+ HR Contacts Directory</p>
                    <p className="text-xs sm:text-sm text-gray-600">Reach real hiring managers directly</p>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-xl p-3 sm:p-4 mb-5 sm:mb-6 border-2 border-orange-200">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-gray-600 line-through text-xs sm:text-sm">Regular: ₹199</p>
                    <p className="text-2xl sm:text-3xl font-bold text-orange-600">₹99<span className="text-base sm:text-lg">/30 days</span></p>
                  </div>
                  <div className="bg-red-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-bold transform rotate-3 shadow-lg text-sm sm:text-base flex-shrink-0">
                    SAVE 50%
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 sm:space-y-3">
                <button
                  onClick={handleUpgradeClick}
                  className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-bold text-base sm:text-lg hover:from-orange-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <FaCrown className="text-base sm:text-lg" />
                  Upgrade Now - 50% OFF!
                </button>
                <button
                  onClick={onClose}
                  className="w-full bg-gray-100 text-gray-700 py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl font-semibold text-sm sm:text-base hover:bg-gray-200 transition-all"
                >
                  Maybe Later
                </button>
              </div>

              <p className="text-center text-xs text-gray-500 mt-3 sm:mt-4 px-2">
                💡 Most popular plan - Join thousands of job seekers accelerating their career
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

