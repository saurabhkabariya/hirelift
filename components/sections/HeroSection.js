'use client';

import { motion } from 'framer-motion';
import { FaRocket, FaBrain, FaHeart, FaArrowRight } from 'react-icons/fa';
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
    <section id="home" className="relative flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20 pb-12 min-h-screen">
      {/* Subtle background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-gradient-to-r from-cyan-100/20 to-blue-100/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-100/15 to-cyan-100/15 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-4xl mx-auto space-y-8">
          
          {/* Emotional Hook + Value Prop */}
          <motion.div
            initial={animConfig.initial}
            animate={animConfig.animate}
            transition={animConfig.transition}
            className="space-y-6"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight">
              <span className="text-gray-900 block mb-2">Your Dream Job Is</span>
              <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 bg-clip-text text-transparent block">
               One Click Away
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl lg:text-3xl text-gray-600 font-light max-w-3xl mx-auto leading-relaxed">
              Stop hoping. Start knowing. <br />
              <span className="font-semibold text-gray-800">AI-powered job hunt assistant</span> that gets you hired.
            </p>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={animConfig.initial}
            animate={animConfig.animate}
            transition={{ ...animConfig.transition, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 text-gray-600"
          >
            <div className="flex items-center gap-2">
              <FaBrain className="text-cyan-500 text-xl" />
              <span className="font-medium">AI-Powered Analysis</span>
            </div>
            <div className="hidden sm:block w-1 h-1 bg-gray-300 rounded-full"></div>
            <div className="flex items-center gap-2">
              <FaHeart className="text-red-400 text-xl" />
              <span className="font-medium">Human-Centered Approach</span>
            </div>
            <div className="hidden sm:block w-1 h-1 bg-gray-300 rounded-full"></div>
            <div className="flex items-center gap-2">
              <span className="text-green-400 font-bold text-xl">✓</span>
              <span className="text-green-500 font-bold">95%</span>
              <span className="font-medium">Success Rate</span>
            </div>
          </motion.div>

          {/* Primary CTA */}
          <motion.div
            initial={animConfig.initial}
            animate={animConfig.animate}
            transition={{ ...animConfig.transition, delay: 0.4 }}
            className="space-y-4"
          >
            <motion.button 
              onClick={() => handleRedirect('/audit')}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="group px-12 py-6 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white font-bold text-xl rounded-2xl shadow-2xl hover:shadow-cyan-500/30 transition-all duration-300 flex items-center gap-4 mx-auto relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <FaRocket className="w-6 h-6 relative z-10" />
              <span className="relative z-10">Discover What's Holding You Back</span>
              <FaArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
            </motion.button>
            
            <p className="text-sm text-gray-500">
              Free AI analysis • No credit card required • Instant results
            </p>
          </motion.div>

          {/* Social Proof Simplified */}
          <motion.div
            initial={animConfig.initial}
            animate={animConfig.animate}
            transition={{ ...animConfig.transition, delay: 0.6 }}
            className="bg-white/60 backdrop-blur-sm border border-cyan-100 rounded-2xl p-6 max-w-2xl mx-auto"
          >
            <div className="grid grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-black text-cyan-600 mb-1">5K+</div>
                <div className="text-sm text-gray-600">Professionals Helped</div>
              </div>
              <div>
                <div className="text-3xl font-black text-blue-600 mb-1">3x</div>
                <div className="text-sm text-gray-600">Faster Hiring</div>
              </div>
              <div>
                <div className="text-3xl font-black text-purple-600 mb-1">24hrs</div>
                <div className="text-sm text-gray-600">First Interview</div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

//             {/* Enhanced Social Proof - Better responsive layout */}
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ ...animConfig.transition, delay: isMobile ? 0.3 : 0.3 }}
//               className="flex flex-wrap justify-center lg:justify-start items-center gap-4 sm:gap-6 text-sm text-gray-600 mb-6"
//             >
//               <div className="flex items-center gap-2">
//                 <span className="text-cyan-500 font-bold text-base">✓</span>
//                 <span><strong>5,000+</strong> careers transformed</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <span className="text-cyan-500 font-bold text-base">✓</span>
//                 <span><strong>Average 60%</strong> salary increase</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <span className="text-cyan-500 font-bold text-base">✓</span>
//                 <span><strong>2 weeks</strong> to first interview</span>
//               </div>
//             </motion.div>

//             {/* Testimonial - Optimized for all screens */}
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ ...animConfig.transition, delay: isMobile ? 0.35 : 0.35 }}
//               className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-lg p-4 sm:p-6 mx-auto lg:mx-0"
//             >
//               <div className="flex items-start gap-3 sm:gap-4">
//                 <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
//                   S
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <p className="text-base sm:text-lg text-gray-800 italic leading-relaxed">"I was unemployed for 8 months, felt worthless. After HireLift found my resume mistakes, I got 3 offers in 2 weeks. Changed my life completely."</p>
//                   <p className="text-sm sm:text-base text-gray-600 mt-2 font-medium">- Sarah K., Now Senior Software Engineer</p>
//                 </div>
//               </div>
//             </motion.div>
//           </div>

//           {/* Right Visual - Enhanced responsive design */}
//           <motion.div
//             initial={animConfig.initial}
//             animate={animConfig.animate}
//             transition={{ ...animConfig.transition, delay: isMobile ? 0.1 : 0.1 }}
//             className="flex justify-center items-center order-last lg:order-last"
//           >
//             {/* ATS Progress Bar Component */}
//             <ATSProgressBar />
//           </motion.div>
//         </div>
//       </div>
//     </section>
//   );
// }
