'use client';

import { motion } from 'framer-motion';
import { FaRocket } from 'react-icons/fa';

const scrollToSection = (sectionId) => {
  const element = document.querySelector(sectionId);
  if (element) {
    const headerHeight = 70;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};

export default function HeroSection({ handleRedirect }) {
  return (
    <section id="home" className="relative flex items-center justify-center px-6 pt-22 pb-6 min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950">
      <div className="max-w-5xl mx-auto text-center relative z-10">
        {/* Power Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-6 py-3 bg-green-500/20 border border-green-400/40 rounded-full text-green-200 text-sm font-bold mb-8 backdrop-blur-sm"
        >
          ✅ <span>95% Success Rate • 100+ Hired • Proven Results</span>
        </motion.div>
        
        {/* Main Heading - SEO Optimized */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight mb-8"
        >
          <span className="text-white">India's Favourite</span><br />
          <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Job Hunt Assistant</span><br />
          <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">Get Hired 3x Faster</span>
        </motion.h1>
        
        {/* Value Proposition - Keyword Rich */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto mb-12 leading-relaxed"
        >
          Free ATS resume checker + Cold email templates + HR directory + Job search tools = 
          <span className="text-green-300 font-bold"> Success for 100+ Indian job seekers</span>
        </motion.p>
        
        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
        >
          <button 
            onClick={() => handleRedirect('/audit')}
            className="group px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-xl rounded-xl shadow-xl hover:shadow-green-500/30 transition-all duration-300 flex items-center gap-3 hover:scale-105"
          >
            <FaRocket className="w-5 h-5" />
            Start First Audit
            <span className="bg-yellow-300 text-yellow-900 text-sm px-2 py-1 rounded-full font-bold">FREE</span>
          </button>
          
          <button 
            onClick={() => handleRedirect('/jobs')}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold text-xl rounded-xl shadow-xl hover:shadow-blue-500/30 transition-all duration-300 flex items-center gap-3 hover:scale-105"
          >
            Browse Free Jobs
            <span className="bg-green-300 text-green-900 text-sm px-2 py-1 rounded-full font-bold">1000+</span>
          </button>
        </motion.div>

        {/* Secondary CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="flex justify-center mb-4"
        >
          <button 
            onClick={() => scrollToSection('#pricing')}
            className="px-6 py-3 border-2 border-blue-400/60 text-blue-200 font-semibold text-lg rounded-xl hover:bg-blue-400/10 transition-all duration-300 hover:scale-105"
          >
            View All Plans
          </button>
        </motion.div>
        
        {/* Social Proof */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="flex flex-wrap justify-center items-center gap-6 md:gap-8 text-sm text-gray-300"
        >
          <div className="flex items-center gap-2">
            <span className="text-green-400 font-bold">✓</span>
            <span>100+ Success Stories</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-400 font-bold">✓</span>
            <span>95% Interview Rate</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-400 font-bold">✓</span>
            <span>No Credit Card Required</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
