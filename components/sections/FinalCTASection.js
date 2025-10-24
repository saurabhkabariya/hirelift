'use client';

import { motion } from 'framer-motion';
import { FaRocket, FaArrowRight } from 'react-icons/fa';

export default function FinalCTASection({ handleRedirect }) {
  return (
    <section className="py-20 px-6 bg-gradient-to-br from-slate-900 via-cyan-950 to-blue-950 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-8"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
            Stop getting rejected by ATS.
            <br />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Start getting interview calls.
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed">
            Join 2,000+ Indian job seekers who transformed their job search with HireLift
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="mb-8"
        >
          <button 
            onClick={() => handleRedirect('/audit')}
            className="group px-12 py-6 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-2xl rounded-2xl shadow-2xl hover:shadow-cyan-500/30 transition-all duration-200 hover:scale-[1.02] flex items-center gap-4 mx-auto"
          >
            <FaRocket className="w-6 h-6 group-hover:rotate-12 transition-transform duration-200" />
            Get Free Review
            <FaArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          className="flex flex-wrap justify-center items-center gap-6 md:gap-8 text-sm text-gray-300"
        >
          <div className="flex items-center gap-2">
            <span className="text-green-400 font-bold">✓</span>
            <span>Free forever</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-400 font-bold">✓</span>
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-400 font-bold">✓</span>
            <span>Instant results</span>
          </div>
        </motion.div>

        {/* Urgency Element */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-12 inline-flex items-center gap-2 bg-red-500/20 border border-red-400/40 rounded-full px-6 py-3 text-red-200"
        >
          <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></span>
          <span className="font-semibold">Over 500 people used HireLift this week</span>
        </motion.div>
      </div>
    </section>
  );
}