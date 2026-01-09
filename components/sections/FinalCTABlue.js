'use client';

import { motion } from 'framer-motion';
import { FaArrowRight, FaStar } from 'react-icons/fa';

export default function FinalCTABlue({ handleRedirect }) {
  return (
    <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-10 right-10 text-yellow-400/20 text-9xl">⭐</div>
        <div className="absolute bottom-20 left-20 text-yellow-400/20 text-7xl transform rotate-12">⭐</div>
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight">
            Your Dream Job is Waiting.
          </h2>

          <motion.button
            onClick={() => handleRedirect('/audit')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group inline-flex items-center gap-3 px-10 py-5 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold text-xl rounded-xl shadow-2xl hover:shadow-yellow-400/50 transition-all duration-300"
          >
            <span>Fix My Job Prep</span>
            <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
