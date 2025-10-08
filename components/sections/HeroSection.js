'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaRocket, FaFileAlt } from 'react-icons/fa';
import { useIsMobile } from '@/hooks/useIsMobile';
import { getMobileAnimationConfig } from '@/utils/animationConfig';

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
  const isMobile = useIsMobile();
  const animConfig = getMobileAnimationConfig(isMobile);

  return (
    <section id="home" className="relative flex items-center justify-center px-6 pt-22 pb-6 min-h-screen" style={{ willChange: isMobile ? 'auto' : 'transform' }}>
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/6 w-72 h-72 bg-gradient-to-r from-cyan-200/30 to-blue-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/6 w-96 h-96 bg-gradient-to-r from-blue-200/20 to-cyan-200/20 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            {/* Main Heading */}
            <motion.h1
              initial={animConfig.initial}
              animate={animConfig.animate}
              transition={animConfig.transition}
              className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-6"
            >
              <span className="text-gray-900">Get Hired Faster with</span><br />
              <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">ATS-Optimized Resumes</span>
              <span className="text-4xl"> 🚀</span>
            </motion.h1>
            
            {/* Subheadline */}
            <motion.p
              initial={animConfig.initial}
              animate={animConfig.animate}
              transition={{ ...animConfig.transition, delay: isMobile ? 0.1 : 0.1 }}
              className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed"
            >
              HireLift helps Indian job seekers beat resume filters, connect with real HRs, and land more interviews.
            </motion.p>
            
            {/* CTA Buttons */}
            <motion.div
              initial={animConfig.initial}
              animate={animConfig.animate}
              transition={{ ...animConfig.transition, delay: isMobile ? 0.15 : 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center mb-8"
            >
              <motion.button 
                onClick={() => handleRedirect('/audit')}
                whileHover={animConfig.hover}
                whileTap={animConfig.tap}
                className="group px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold text-xl rounded-xl shadow-xl hover:shadow-cyan-500/30 transition-all duration-200 flex items-center gap-3"
              >
                <FaRocket className="w-5 h-5" />
                Get Free Resume Audit
              </motion.button>
              
              <button 
                onClick={() => handleRedirect('/jobs')}
                className="text-cyan-600 font-semibold text-lg hover:text-cyan-700 transition-all duration-200 flex items-center gap-2 hover:gap-3"
              >
                Free Jobs Access →
              </button>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ ...animConfig.transition, delay: isMobile ? 0.2 : 0.3 }}
              className="flex flex-wrap justify-center lg:justify-start items-center gap-6 text-sm text-gray-600"
            >
              <div className="flex items-center gap-2">
                <span className="text-cyan-500 font-bold">✓</span>
                <span>2,000+ resumes audited</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-cyan-500 font-bold">✓</span>
                <span>500+ HR contacts verified</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-cyan-500 font-bold">✓</span>
                <span>100% secure & private</span>
              </div>
            </motion.div>
          </div>

          {/* Right Visual */}
          <motion.div
            initial={animConfig.initial}
            animate={animConfig.animate}
            transition={{ ...animConfig.transition, delay: isMobile ? 0.1 : 0.1 }}
            className="text-center"
          >
            <div className="relative pb-4">
              {/* Visual placeholder - laptop mockup style */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-cyan-100/90 via-cyan-50/80 to-blue-100/90 backdrop-blur-sm p-3 border border-cyan-200/50">
                <Image 
                  className='rounded-xl' 
                  src={`/ATS_Transform.webp`} 
                  alt='ATS Transform' 
                  height={100} 
                  width={600} 
                  objectFit='fill'
                />
              </div>
              {/* Floating elements - static on mobile for performance */}
              <div className={`absolute -top-4 -right-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg ${!isMobile ? 'animate-pulse' : ''}`}>
                95% Pass Rate
              </div>
              <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                Free Audit
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
