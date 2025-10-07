'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRocket } from 'react-icons/fa';

export default function FloatingCTA({ handleRedirect }) {
  const [showCTA, setShowCTA] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Show CTA after scrolling 50% of viewport height
      const shouldShow = scrollY > windowHeight * 0.5;
      
      // Hide CTA when near footer (last 300px of page)
      const nearFooter = scrollY > documentHeight - windowHeight - 300;
      
      // Hide CTA when near top (first 100px)
      const nearHeader = scrollY < 100;
      
      setShowCTA(shouldShow && !nearFooter && !nearHeader);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {showCTA && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.8 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="fixed bottom-6 right-6 z-40"
        >
          <button
            onClick={() => handleRedirect('/audit')}
            className="flex items-center gap-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-6 py-4 rounded-full shadow-2xl hover:shadow-cyan-500/40 transition-all duration-300 hover:scale-105 backdrop-blur-sm border border-white/10"
          >
            <FaRocket className="w-5 h-5" />
            <span className="font-bold">Start First Audit</span>
            <span className="bg-yellow-300 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">FREE</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
