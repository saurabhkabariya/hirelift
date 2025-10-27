'use client';

import { motion } from 'framer-motion';
import { FaRocket, FaHeart, FaBrain } from 'react-icons/fa';

export default function FinalCTASection({ handleRedirect }) {
  return (
    <section className="py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Subtle background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-5xl mx-auto text-center">
        
        {/* Emotional Hook */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-8 leading-tight">
            You Deserve Better
            <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Than the Black Hole
            </span>
          </h2>
          
          <p className="text-xl sm:text-2xl lg:text-3xl text-gray-200 font-light leading-relaxed max-w-4xl mx-auto">
            Your skills matter. Your dreams matter. <br />
            <span className="font-semibold text-white">You matter.</span>
          </p>
        </motion.div>

        {/* Trust Elements */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-12 text-gray-300"
        >
          <div className="flex items-center gap-3">
            <FaBrain className="text-cyan-400 text-2xl" />
            <span className="font-medium">AI-Powered Intelligence</span>
          </div>
          <div className="flex items-center gap-3">
            <FaHeart className="text-red-400 text-2xl" />
            <span className="font-medium">Human-Centered Care</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-green-400 font-bold text-xl">✓</span>
            <span className="text-green-400 font-bold text-xl">5,000+</span>
            <span className="font-medium">Lives Changed</span>
          </div>
        </motion.div>

        {/* Main CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="space-y-6"
        >
          <motion.button 
            onClick={() => handleRedirect('/audit')}
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
            className="group px-16 py-8 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white font-black text-2xl lg:text-3xl rounded-3xl shadow-2xl hover:shadow-cyan-500/30 transition-all duration-300 flex items-center gap-6 mx-auto relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <FaRocket className="w-8 h-8 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
            <span className="relative z-10">Start Your Transformation</span>
          </motion.button>
          
          <p className="text-gray-400 text-lg">
            Free forever • No strings attached • Your success is our mission
          </p>
        </motion.div>

        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 max-w-3xl mx-auto"
        >
          <p className="text-white text-xl font-medium leading-relaxed mb-4">
            "I went from 200 applications with no response to 5 interviews in 2 weeks. 
            HireLift didn't just fix my resume - it fixed my hope."
          </p>
          <p className="text-cyan-300 font-semibold">
            - Priya S., Product Manager at Microsoft
          </p>
        </motion.div>

      </div>
    </section>
  );
}
//         </motion.div>

//         <motion.div
//           initial={{ opacity: 0 }}
//           whileInView={{ opacity: 1 }}
//           viewport={{ once: true, margin: "-50px" }}
//           transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
//           className="flex flex-wrap justify-center items-center gap-6 md:gap-8 text-sm text-gray-300"
//         >
//           <div className="flex items-center gap-2">
//             <span className="text-green-400 font-bold">✓</span>
//             <span>Free forever</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <span className="text-green-400 font-bold">✓</span>
//             <span>No credit card required</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <span className="text-green-400 font-bold">✓</span>
//             <span>Instant results</span>
//           </div>
//         </motion.div>

//         {/* Urgency Element */}
//         <motion.div
//           initial={{ opacity: 0, scale: 0.9 }}
//           whileInView={{ opacity: 1, scale: 1 }}
//           viewport={{ once: true }}
//           transition={{ delay: 0.6 }}
//           className="mt-12 inline-flex items-center gap-2 bg-red-500/20 border border-red-400/40 rounded-full px-6 py-3 text-red-200"
//         >
//           <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></span>
//           <span className="font-semibold">Over 500 people used HireLift this week</span>
//         </motion.div>
//       </div>
//     </section>
//   );
// }