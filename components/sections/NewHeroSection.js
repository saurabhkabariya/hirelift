'use client';

import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import Image from 'next/image';

export default function NewHeroSection({ handleRedirect }) {
  return (
    <section id="home" className="relative pt-6 min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        {/* <Image
          src="/hero-bg.webp"
          alt="Hero Background"
          fill
          priority
          quality={100}
          className="object-cover object-center"
          sizes="100vw"
        /> */}
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-blue-600/50"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
          
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white space-y-4 sm:space-y-6 text-center lg:text-left"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight">
              Break free of the <br className="hidden sm:block"/> <span className='text-red-400'> "No Responses" </span> Cycle. <br />
               Start Getting Interview Calls.
            </h1>
            
            <p className="text-base sm:text-lg lg:text-xl text-shadow-black text-shadow-xs text-white/95 leading-relaxed max-w-xl mx-auto lg:mx-0">
              No replies doesn’t mean no talent.
HireLift shows you exactly what’s wrong with your resume, helps you get best opportunities, and connects you with recruiters open to fresh candidates.
            </p>

            <motion.button
              onClick={() => handleRedirect('/audit')}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="group inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-1 sm:py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold text-base sm:text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <span className="whitespace-nowrap">Fix My Resume</span>
              <FaArrowRight className="group-hover:translate-x-1 transition-transform flex-shrink-0" />
            </motion.button>

            <p className="text-xs sm:text-sm text-shadow-xs text-shadow-black text-white/95">
              Stop stress-scrolling. Start now. Free resume review included.
            </p>
          </motion.div>

          {/* Right Content - Device Mockups */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative mt-8 lg:mt-0"
          >
            <div className="relative max-w-md mx-auto lg:max-w-none">
              {/* Green background card */}
              {/* <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl sm:rounded-3xl transform rotate-3"></div> */}
              
              {/* Laptop mockup */}
              {/* <div className="relative bg-blue-900 rounded-2xl p-4 shadow-2xl">
                <div className="bg-white rounded-lg overflow-hidden">
                  <div className="h-8 bg-gray-800 flex items-center px-4 gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="p-6 bg-white">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-16 h-16 bg-blue-200 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-800 rounded mb-2 w-32"></div>
                        <div className="h-3 bg-gray-400 rounded w-48"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 bg-gray-300 rounded w-full"></div>
                      <div className="h-2 bg-gray-300 rounded w-5/6"></div>
                      <div className="h-2 bg-gray-300 rounded w-4/6"></div>
                    </div>
                  </div>
                </div>
              </div> */}
              <div className="relative rounded-xl sm:rounded-2xl p-3 sm:p-4 px-4 sm:px-8 shadow-2xs transform rotate-3">
              <Image 
                src="/hero-img.webp" 
                alt="Resume Mockup" 
                width={500} 
                height={500}
                className="w-full h-auto rounded-lg sm:rounded-xl"
                priority
              />
              </div>

              {/* Mobile mockup */}
              {/* <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="absolute right-16 -top-10 w-40 bg-white rounded-3xl shadow-2xl p-3"
              >
                <div className="bg-green-400 rounded-2xl p-4 text-center">
                  <div className="w-8 h-8 bg-white rounded-full mx-auto mb-2"></div>
                  <div className="h-2 bg-white/80 rounded mb-1"></div>
                  <div className="h-2 bg-white/60 rounded w-2/3 mx-auto mb-3"></div>
                  <div className="bg-blue-600 text-white text-xs py-2 rounded-lg font-semibold">
                    Congratulations!
                  </div>
                </div>
              </motion.div> */}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
