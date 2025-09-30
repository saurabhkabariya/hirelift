'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaRocket, FaFileAlt } from 'react-icons/fa';

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
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-6"
            >
              <span className="text-white">Get Hired Faster with</span><br />
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">ATS-Optimized Resumes</span>
              <span className="text-4xl"> 🚀</span>
            </motion.h1>
            
            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed"
            >
              HireLift helps Indian job seekers beat resume filters, connect with real HRs, and land more interviews.
            </motion.p>
            
            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center mb-8"
            >
              <button 
                onClick={() => handleRedirect('/audit')}
                className="group px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-xl rounded-xl shadow-xl hover:shadow-green-500/30 transition-all duration-300 flex items-center gap-3 hover:scale-105"
              >
                <FaRocket className="w-5 h-5" />
                Get Free Resume Audit
              </button>
              
              <button 
                onClick={() => handleRedirect('/jobs')}
                className="text-blue-200 font-semibold text-lg hover:text-blue-100 transition-all duration-300 flex items-center gap-2 hover:gap-3"
              >
                Free Jobs Access →
              </button>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-wrap justify-center lg:justify-start items-center gap-6 text-sm text-gray-300"
            >
              <div className="flex items-center gap-2">
                <span className="text-green-400 font-bold">✓</span>
                <span>2,000+ resumes audited</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400 font-bold">✓</span>
                <span>500+ HR contacts verified</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400 font-bold">✓</span>
                <span>100% secure & private</span>
              </div>
            </motion.div>
          </div>

          {/* Right Visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center"
          >
            <div className="relative pb-4">
              {/* Visual placeholder - laptop mockup style */}
              <Image className='rounded-lg' src={`/ATS_Transform.png`} alt='ATS Transform' height={100} width={500} objectFit='fill'/>
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-bounce">
                95% Pass Rate
              </div>
              <div className="absolute -bottom-4 -left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                Free Audit
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
