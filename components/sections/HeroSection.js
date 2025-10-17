'use client';

import { motion } from 'framer-motion';
import { FaRocket, FaFileAlt } from 'react-icons/fa';
import { useIsMobile } from '@/hooks/useIsMobile';
import { getMobileAnimationConfig } from '@/utils/animationConfig';
import ATSProgressBar from '@/components/ui/ATSProgressBar';

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
    <section id="home" className="relative flex items-center justify-center px-2 sm:px-3 lg:px-4 pt-20 pb-8 min-h-screen" style={{ willChange: isMobile ? 'auto' : 'transform' }}>
      {/* Decorative background elements - optimized for all screens */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/6 w-48 sm:w-72 h-48 sm:h-72 bg-gradient-to-r from-cyan-200/30 to-blue-200/30 rounded-full blur-2xl sm:blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/6 w-64 sm:w-96 h-64 sm:h-96 bg-gradient-to-r from-blue-200/20 to-cyan-200/20 rounded-full blur-2xl sm:blur-3xl"></div>
      </div>
      
      <div className="w-full pl-6 mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center min-h-[calc(100vh-120px)]">
          {/* Left Content - Optimized spacing and alignment */}
          <div className="text-center lg:text-left space-y-4 lg:space-y-6 flex flex-col justify-center px-0 lg:px-0">
            {/* Main Heading - Responsive typography */}
            <motion.h1
              initial={animConfig.initial}
              animate={animConfig.animate}
              transition={animConfig.transition}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-black leading-[1.1] mb-4"
            >
              <span className="text-gray-900 block mb-2">Land Your Dream Job</span>
              <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent block">
                3x Faster with HireLift
              </span>
            </motion.h1>
            
            {/* Subheadline - Better responsive text sizing */}
            <motion.p
              initial={animConfig.initial}
              animate={animConfig.animate}
              transition={{ ...animConfig.transition, delay: isMobile ? 0.1 : 0.1 }}
              className="text-lg sm:text-xl lg:text-xl xl:text-2xl text-gray-700 leading-relaxed max-w-2xl mx-auto lg:mx-0 mb-6"
            >
              Join <span className="font-bold text-cyan-600">5,000+ professionals</span> who've used our resume optimizer to beat ATS filters and get <span className="font-bold">3x more interviews</span>
            </motion.p>

            {/* URGENCY + SCARCITY ELEMENT - Better mobile spacing */}
            <motion.div
              initial={animConfig.initial}
              animate={animConfig.animate}
              transition={{ ...animConfig.transition, delay: isMobile ? 0.15 : 0.15 }}
              className="bg-gradient-to-r from-orange-100 to-red-100 border border-orange-200 rounded-xl p-3 sm:p-4 mx-auto lg:mx-0"
            >
              <p className="text-sm sm:text-base text-orange-800 font-medium text-center lg:text-left">
                ⚡ <span className="font-bold">Limited Time:</span> Free Resume Audit worth $10
                <span className="block sm:inline mt-1 sm:mt-0 sm:ml-2"> (Today Only - 47 spots left)</span>
              </p>
            </motion.div>
            
            {/* CTA Buttons - Improved responsive layout */}
            <motion.div
              initial={animConfig.initial}
              animate={animConfig.animate}
              transition={{ ...animConfig.transition, delay: isMobile ? 0.2 : 0.2 }}
              className="flex flex-col sm:flex-row gap-4 lg:gap-6 justify-center lg:justify-start items-center sm:items-start mb-6"
            >
              <motion.button 
                onClick={() => handleRedirect('/audit')}
                whileHover={animConfig.hover}
                whileTap={animConfig.tap}
                className="group px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold text-lg sm:text-xl rounded-xl shadow-xl hover:shadow-cyan-500/30 transition-all duration-200 flex items-center gap-3 w-full sm:w-auto max-w-sm sm:max-w-none flex-col"
              >
                <div className='flex items-center gap-3'>
                <FaRocket className="w-5 h-5" />
                Get FREE Audit Now 
                </div>
                
                <span className='block'> (Worth $10) </span>
              </motion.button>
              
              <div className="text-center h-[-webkit-fill-available] flex flex-col justify-center lg:text-left">
                <p className="text-sm text-gray-600 font-medium">✅ 100% Free • No Credit Card Required</p>
                <p className="text-xs text-gray-500 mt-1">⭐ 4.9/5 rating from 1,000+ users</p>
              </div>
            </motion.div>

            {/* Enhanced Social Proof - Better responsive layout */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ ...animConfig.transition, delay: isMobile ? 0.3 : 0.3 }}
              className="flex flex-wrap justify-center lg:justify-start items-center gap-4 sm:gap-6 text-sm text-gray-600 mb-6"
            >
              <div className="flex items-center gap-2">
                <span className="text-cyan-500 font-bold text-base">✓</span>
                <span><strong>5,000+</strong> resumes optimized</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-cyan-500 font-bold text-base">✓</span>
                <span><strong>95%</strong> ATS pass rate</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-cyan-500 font-bold text-base">✓</span>
                <span><strong>3x</strong> more interviews guaranteed</span>
              </div>
            </motion.div>

            {/* Testimonial - Optimized for all screens */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ ...animConfig.transition, delay: isMobile ? 0.35 : 0.35 }}
              className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-lg p-4 sm:p-6 mx-auto lg:mx-0"
            >
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  S
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base sm:text-lg text-gray-800 italic leading-relaxed">"Got 5 interview calls in 6 days after using HireLift. Best investment ever!"</p>
                  <p className="text-sm sm:text-base text-gray-600 mt-2 font-medium">- Sarah K., Software Engineer</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Visual - Enhanced responsive design */}
          <motion.div
            initial={animConfig.initial}
            animate={animConfig.animate}
            transition={{ ...animConfig.transition, delay: isMobile ? 0.1 : 0.1 }}
            className="flex justify-center items-center order-last lg:order-last"
          >
            {/* ATS Progress Bar Component */}
            <ATSProgressBar />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
