'use client';

import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import Image from 'next/image';

export default function NewHeroSection({ handleRedirect }) {
  return (
    <section id="home" className="relative pt-6 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 min-h-screen flex items-center overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 sm:top-20 right-1/4 w-48 h-48 sm:w-96 sm:h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 sm:bottom-20 left-1/4 w-40 h-40 sm:w-80 sm:h-80 bg-indigo-500/20 rounded-full blur-3xl"></div>
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
              Break free of the <br className="hidden sm:block"/> "No Experience"<br />
              Cycle. Get Hired Fast.
            </h1>
            
            <p className="text-base sm:text-lg lg:text-xl text-blue-100 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Feeling invisible to recruiters? HireLift's AI turns your potential into an undeniable profile, gives you unshakeable interview confidence, and connects you with companies eager to hire fresh talent.
            </p>

            <motion.button
              onClick={() => handleRedirect('/audit')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold text-base sm:text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <span className="whitespace-nowrap">Create My Winning Profile</span>
              <FaArrowRight className="group-hover:translate-x-1 transition-transform flex-shrink-0" />
            </motion.button>

            <p className="text-xs sm:text-sm text-blue-200">
              Stop stress-scrolling. Start now.
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
              <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl sm:rounded-3xl transform rotate-3"></div>
              
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
              <div className="relative rounded-xl sm:rounded-2xl p-3 sm:p-4 px-4 sm:px-8 shadow-2xl transform rotate-3">
              <Image 
                src="/laptop-mobile.webp" 
                alt="Laptop and Mobile Mockup" 
                width={500} 
                height={500}
                className="w-full h-auto"
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
