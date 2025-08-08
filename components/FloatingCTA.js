'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRocket } from 'react-icons/fa';

export default function FloatingCTA({ handleRedirect }) {
  const [showCTA, setShowCTA] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > window.innerHeight * 0.5;
      setShowCTA(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {showCTA && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <button
            onClick={() => handleRedirect('/audit')}
            className="flex items-center gap-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-4 rounded-full shadow-xl hover:shadow-green-500/30 transition-all duration-300 hover:scale-105"
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
