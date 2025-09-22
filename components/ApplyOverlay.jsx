"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function ApplyOverlay({ isOpen, onClose, job }) {
  const router = useRouter();
  const [showSkipOption, setShowSkipOption] = useState(false);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleATSCheck = () => {
    onClose();
    router.push('/audit');
  };

  const handleSkipAndApply = () => {
    onClose();
    // Open the job URL in a new tab
    window.open(job.url, '_blank', 'noopener,noreferrer');
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-md z-[9999] flex items-center justify-center p-4"
          onClick={handleBackdropClick}
        >
          {/* Enhanced Modal Container with better shadow and rounded corners */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 30 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30,
              duration: 0.4 
            }}
            className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full mx-4 relative overflow-hidden max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Scrollable Content Container */}
            <div className="overflow-y-auto max-h-[90vh] custom-scrollbar">
              {/* Close Button - Fixed position within modal */}
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="absolute top-6 right-6 w-10 h-10 bg-gray-100/90 hover:bg-red-100 rounded-full flex items-center justify-center text-gray-600 hover:text-red-600 transition-all duration-200 z-20 backdrop-blur-sm border border-gray-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>

              {/* Enhanced Header Section with Better Gradient */}
              <div className="bg-gradient-to-br from-emerald-500 via-blue-600 to-purple-700 p-8 text-white relative overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 opacity-20">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 180, 360],
                    }}
                    transition={{ 
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full"
                  />
                  <motion.div
                    animate={{ 
                      scale: [1.2, 1, 1.2],
                      rotate: [360, 180, 0],
                    }}
                    transition={{ 
                      duration: 15,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full"
                  />
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-center relative z-10"
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ 
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                      delay: 0.2 
                    }}
                    className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-white/30"
                  >
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </motion.div>
                  <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-3xl font-bold mb-3 leading-tight"
                  >
                    Want a better chance of an interview?
                  </motion.h2>
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-emerald-100 text-lg font-medium"
                  >
                    Smart candidates check their ATS compatibility first
                  </motion.p>
                </motion.div>
              </div>

              {/* Enhanced Content Section */}
              <div className="p-8 bg-gradient-to-br from-gray-50 to-white">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-center mb-8"
                >
                  {/* Enhanced Benefit Card */}
                  <div className="bg-gradient-to-r from-emerald-50 to-blue-50 border-2 border-emerald-200/50 rounded-2xl p-8 mb-8 relative overflow-hidden">
                    {/* Animated Background */}
                    <motion.div
                      animate={{ x: [-100, 100, -100] }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    />
                    
                    <div className="relative z-10">
                      <div className="flex items-center justify-center gap-3 mb-4">
                        <motion.div 
                          whileHover={{ scale: 1.1, rotate: 360 }}
                          transition={{ duration: 0.3 }}
                          className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg"
                        >
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </motion.div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                          Free ATS Optimization
                        </span>
                      </div>
                      <p className="text-gray-700 text-lg leading-relaxed">
                        Run a free ATS check on your resume now, it only takes 30 seconds and can 
                        <strong className="text-emerald-700 font-bold"> increase your response rate by 300%</strong>.
                      </p>
                    </div>
                  </div>

                  {/* Enhanced Benefits Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {[
                      { icon: "📈", text: "Increase interview callbacks by 3x", color: "from-green-500 to-emerald-500" },
                      { icon: "⚡", text: "Get instant ATS-friendly suggestions", color: "from-yellow-500 to-orange-500" },
                      { icon: "🎯", text: "Optimize for this specific job posting", color: "from-blue-500 to-purple-500" },
                      { icon: "🔍", text: "See exactly what recruiters see", color: "from-purple-500 to-pink-500" }
                    ].map((benefit, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        whileHover={{ scale: 1.02, y: -2 }}
                        className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-gray-100"
                      >
                        <motion.div
                          whileHover={{ scale: 1.2, rotate: 10 }}
                          className={`w-12 h-12 bg-gradient-to-r ${benefit.color} rounded-xl flex items-center justify-center text-2xl shadow-lg`}
                        >
                          {benefit.icon}
                        </motion.div>
                        <span className="text-gray-700 font-semibold text-left flex-1">{benefit.text}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Enhanced CTA Section */}
                  <div className="space-y-4">
                    <motion.button
                      onClick={handleATSCheck}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 text-white px-8 py-5 rounded-2xl text-xl font-bold shadow-xl hover:shadow-emerald-500/30 transition-all duration-300 flex items-center justify-center gap-3 relative overflow-hidden"
                    >
                      {/* Button Animation */}
                      <motion.div
                        animate={{ x: [-100, 100, -100] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      />
                      <svg className="w-7 h-7 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="relative z-10">Get First ATS Score for Free</span>
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="bg-yellow-300 text-yellow-900 text-sm font-bold px-3 py-1 rounded-full relative z-10"
                      >
                        FREE
                      </motion.div>
                    </motion.button>

                    {/* Enhanced Skip Option */}
                    <AnimatePresence>
                      {!showSkipOption ? (
                        <motion.button
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 3 }}
                          onClick={() => setShowSkipOption(true)}
                          className="text-gray-500 text-sm hover:text-gray-700 transition-colors underline decoration-dotted underline-offset-4 hover:decoration-solid"
                        >
                          I'll skip the ATS check
                        </motion.button>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, height: 0, scale: 0.9 }}
                          animate={{ opacity: 1, height: "auto", scale: 1 }}
                          exit={{ opacity: 0, height: 0, scale: 0.9 }}
                          transition={{ duration: 0.3 }}
                          className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-2xl p-6"
                        >
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                              </svg>
                            </div>
                            <h3 className="text-orange-800 font-bold text-lg">Are you sure?</h3>
                          </div>
                          <p className="text-orange-700 mb-4 leading-relaxed">
                            Most resumes get rejected by ATS systems before humans even see them. 
                            <strong> Don't let yours be one of them!</strong>
                          </p>
                          <div className="flex gap-3">
                            <motion.button
                              onClick={() => setShowSkipOption(false)}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="flex-1 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-4 py-3 rounded-xl text-sm font-bold hover:shadow-lg transition-all duration-200"
                            >
                              💡 Check ATS First
                            </motion.button>
                            <motion.button
                              onClick={handleSkipAndApply}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200"
                            >
                              Skip & Apply
                            </motion.button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>

                {/* Enhanced Job Info Footer */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="border-t-2 border-gray-100 pt-6 mt-8"
                >
                  <div className="flex items-center gap-4 text-sm text-gray-600 bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                    <motion.div 
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg"
                    >
                      {job.company?.charAt(0).toUpperCase()}
                    </motion.div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-800 text-lg">{job.title}</p>
                      <p className="text-gray-500 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        {job.company}
                        <span className="mx-2">•</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {job.location}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Decorative Bottom Border */}
              <div className="h-2 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500"></div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}