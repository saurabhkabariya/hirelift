'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaGift, FaRocket, FaCrown, FaArrowRight, FaClock } from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';
import { useTrialStatus } from '@/hooks/useTrialStatus';

export default function TrialShowcase({ handleRedirect }) {
  const { user } = useAuth();
  const trialData = useTrialStatus();
  
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Safely destructure with defaults
  const {
    canClaimTrial = false,
    claimTrial,
    claimingTrial = false,
    loading = true,
    error = null
  } = trialData || {};

  // Handle trial status errors gracefully - show trial if user hasn't claimed and isn't premium
  const shouldShowTrial = mounted && user && (
    (!loading && !error && canClaimTrial) ||
    (error && !user.hasClaimedTrial && !user.isPremium)
  );

  // Don't show if not mounted or user can't claim trial
  if (!shouldShowTrial) {
    return null;
  }

  const handleClaimTrial = async () => {
    if (!user) {
      handleRedirect('/auth');
      return;
    }

    const result = await claimTrial();
    if (result.success) {
      // Show success message or redirect to dashboard
      handleRedirect('/dashboard');
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-cyan-500 to-purple-500 relative overflow-hidden"
      data-testid="trial-showcase"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
      <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-white/5 rounded-full blur-2xl"></div>
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <FaGift className="text-yellow-300 text-3xl" />
            <span className="bg-yellow-300 text-purple-900 px-4 py-2 rounded-full font-bold text-sm uppercase tracking-wide">
              Limited Time Offer
            </span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4">
            Try Career Accelerator
            <span className="block text-yellow-300">FREE for 7 Days!</span>
          </h2>
          
          <p className="text-xl lg:text-2xl text-cyan-100 font-medium max-w-2xl mx-auto">
            Get unlimited resume reviews, HR directory access, and premium features.
            <span className="block font-bold text-white mt-2">No credit card required!</span>
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
        >
          {[
            {
              icon: FaRocket,
              title: "Unlimited Reviews",
              description: "Get your resume analyzed as many times as you want"
            },
            {
              icon: FaCrown,
              title: "HR Directory",
              description: "Access 1,000+ hiring manager contacts"
            },
            {
              icon: FaClock,
              title: "Priority Support",
              description: "Get expert help when you need it most"
            }
          ].map((feature, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
              <feature.icon className="text-yellow-300 text-3xl mx-auto mb-3" />
              <h3 className="text-white font-bold text-lg mb-2">{feature.title}</h3>
              <p className="text-cyan-100 text-sm">{feature.description}</p>
            </div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <motion.button
            onClick={handleClaimTrial}
            disabled={claimingTrial}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-purple-600 font-black text-xl lg:text-2xl px-12 py-6 rounded-2xl shadow-2xl hover:shadow-white/20 transition-all duration-300 flex items-center gap-4 mx-auto disabled:opacity-70 disabled:cursor-not-allowed"
            data-testid="trial-claim-button"
          >
            <FaGift className="w-6 h-6" />
            {claimingTrial ? 'Activating Trial...' : 'Claim My FREE 7-Day Trial'}
            <FaArrowRight className="w-5 h-5" />
          </motion.button>
          
          <p className="text-cyan-100 mt-4 text-lg">
            Join 50,000+ professionals who transformed their careers
          </p>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-8 flex flex-wrap justify-center items-center gap-6 text-cyan-100"
        >
          <div className="flex items-center gap-2">
            <span className="text-green-300 font-bold">✓</span>
            <span>No Credit Card</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-300 font-bold">✓</span>
            <span>Cancel Anytime</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-300 font-bold">✓</span>
            <span>Instant Access</span>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}