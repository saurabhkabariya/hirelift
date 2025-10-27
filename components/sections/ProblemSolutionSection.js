'use client';

import { motion } from 'framer-motion';
import { FaBrain, FaUsers, FaRocket, FaHeart, FaArrowRight } from 'react-icons/fa';

export default function ProblemSolutionSection({ handleRedirect }) {
  
  return (
    <section className="py-20 lg:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-white">
      
      <div className="max-w-6xl mx-auto">
        
        {/* Emotional Problem Statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto mb-20"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight">
            You're Not Getting Hired Because
            <span className="block bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              Nobody Sees Your Resume
            </span>
          </h2>
          
          <p className="text-xl sm:text-2xl text-gray-600 font-light leading-relaxed mb-8">
            87% of resumes never reach human eyes. <br />
            <span className="font-semibold text-gray-800">You deserve better than the black hole.</span>
          </p>
          
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 inline-block">
            <p className="text-red-700 font-medium">
              "I sent 200+ applications. Got 3 interviews. Something was wrong."
            </p>
            <p className="text-red-600 text-sm mt-1">- Sarah, Marketing Manager (now employed)</p>
          </div>
        </motion.div>

        {/* Solution Features */}
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 mb-16">
          
          {/* AI Analysis */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="group text-center"
          >
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                <FaBrain className="text-white text-3xl" />
              </div>
              <div className="absolute -inset-4 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              AI-Powered Resume Analysis
            </h3>
            <p className="text-gray-600 leading-relaxed">
              See exactly what ATS systems think of your resume. No guessing. Just facts.
            </p>
          </motion.div>

          {/* Human Connection */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="group text-center"
          >
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-pink-400 to-red-500 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                <FaHeart className="text-white text-3xl" />
              </div>
              <div className="absolute -inset-4 bg-gradient-to-r from-pink-400/20 to-red-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Human-Centered Approach
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Technology serves you, not the other way around. Personal, caring, effective.
            </p>
          </motion.div>

          {/* Direct Access */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="group text-center"
          >
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                <FaUsers className="text-white text-3xl" />
              </div>
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-400/20 to-indigo-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Direct Access to Hiring Managers
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Skip the queue. Connect directly with decision-makers who can hire you today.
            </p>
          </motion.div>
        </div>

        {/* Success Story */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-3xl p-8 lg:p-12 text-center max-w-4xl mx-auto"
        >
          <div className="mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaRocket className="text-white text-2xl" />
            </div>
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
              "Got 5 interviews in 2 weeks"
            </h3>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              "I was ready to give up. Then HireLift showed me exactly what was wrong. 
              Fixed my resume, got the right contacts, landed my dream job at a Fortune 500 company."
            </p>
            <p className="text-green-600 font-semibold">
              - Michael Chen, Software Engineer at Google
            </p>
          </div>
          
          <motion.button 
            onClick={() => handleRedirect('/audit')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-green-500/30 transition-all duration-300 flex items-center gap-3 mx-auto"
          >
            Start Your Success Story
            <FaArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>

      </div>
    </section>
  );
}
      
//       <div className="relative max-w-7xl mx-auto">
        
//         {/* Section Header */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true, margin: "-50px" }}
//           transition={{ duration: 0.5, ease: "easeOut" }}
//           className="text-center mb-12 sm:mb-16 lg:mb-20"
//         >
//           <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm px-6 py-3 rounded-full mb-6 border-2 border-cyan-200 shadow-lg">
//             <span className="text-cyan-700 font-bold text-sm sm:text-base">⚡ Problem → Solution</span>
//           </div>
//           <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-gray-800 mb-4 sm:mb-6 leading-tight">
//             Stop Wondering Why,<br className="sm:hidden" /> Start{' '}
//             <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
//               Getting Hired
//             </span>
//           </h2>
//           <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
//             You're talented. You deserve better than endless rejections. We'll show you exactly what's holding you back - and how to fix it.
//           </p>
//         </motion.div>

//           {/* Pain Points Bridge Section */}
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true, margin: "-50px" }}
//           transition={{ duration: 0.6, ease: "easeOut" }}
//           className="mt-16 mb-12"
//         >
//           <div className="max-w-4xl mx-auto p-8 bg-white/80 backdrop-blur-sm border-l-4 border-cyan-400 rounded-2xl shadow-xl">
//             <h4 className="text-2xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center gap-3">
//               Sound Familiar?
//             </h4>
//             <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
//               <div className="p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200">
//                 <p className="text-sm text-gray-600">"I've sent 200+ applications but my phone never rings"</p>
//               </div>
//               <div className="p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200">
//                 <p className="text-sm text-gray-600">"My savings are running out and I'm starting to panic"</p>
//               </div>
//               <div className="p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200">
//                 <p className="text-sm text-gray-600">"I feel like I'm not good enough for any job"</p>
//               </div>
//               <div className="p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200">
//                 <p className="text-sm text-gray-600">"Everyone else seems to be getting hired except me"</p>
//               </div>
//             </div>
//             <div className="mt-6 text-center">
//               <p className="text-lg font-semibold text-gray-700">
//                 <span className="text-cyan-600">The truth:</span> It's not your fault - it's your approach
//               </p>
//             </div>
//           </div>
//         </motion.div>
//         <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-start">

          
//           {/* Problems Side */}
//           <motion.div
//             initial={{ opacity: 0, x: -20 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             viewport={{ once: true, margin: "-50px" }}
//             transition={{ duration: 0.5, ease: "easeOut" }}
//             className="order-1 lg:order-1"
//           >
//             <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-6 sm:mb-8 flex items-center gap-3">
//               <div className="p-2 bg-red-100 rounded-lg">
//                 <FaTimes className="text-red-500 w-5 h-5 sm:w-6 sm:h-6" />
//               </div>
//               <span>Common Problems</span>
//             </h3>
              
//               <div className="space-y-4 sm:space-y-6">
//               {problems.map((problem, index) => (
//                 <motion.div
//                   key={index}
//                   initial={{ opacity: 0, y: 20 }}
//                   whileInView={{ opacity: 1, y: 0 }}
//                   viewport={{ once: true }}
//                   transition={{ delay: 0.3 + index * 0.1 }}
//                   className="flex items-start gap-4 p-6 bg-white/80 backdrop-blur-sm border-l-4 border-red-400 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
//                 >
//                   <problem.icon className="w-6 h-6 text-red-500 mt-1 flex-shrink-0" />
//                   <div>
//                     <h4 className="font-semibold text-gray-800 mb-2">{problem.title}</h4>
//                     <p className="text-gray-600">{problem.description}</p>
//                   </div>
//                 </motion.div>
//               ))}
//               </div>

//               {/* Impact Statistics */}
//               <motion.div
//                 initial={{ opacity: 0, y: 15 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true, margin: "-30px" }}
//                 transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
//                 className="mt-8 p-6 bg-white/80 backdrop-blur-sm border-l-4 border-red-400 rounded-2xl shadow-lg"
//               >
//                 <h4 className="text-lg font-bold text-gray-800 mb-4 text-center">
//                   The Cost of These Problems
//                 </h4>
//                 <div className="grid grid-cols-2 gap-4 text-center">
//                   <div className="p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200">
//                     <div className="text-2xl font-black text-red-500 mb-1">95%</div>
//                     <div className="text-sm text-gray-600">Applications get rejected by ATS</div>
//                   </div>
//                   <div className="p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200">
//                     <div className="text-2xl font-black text-red-500 mb-1">6+ months</div>
//                     <div className="text-sm text-gray-600">Average job search time</div>
//                   </div>
//                   <div className="p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200">
//                     <div className="text-2xl font-black text-red-500 mb-1">2%</div>
//                     <div className="text-sm text-gray-600">Response rate on job portals</div>
//                   </div>
//                   <div className="p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200">
//                     <div className="text-2xl font-black text-red-500 mb-1">100+</div>
//                     <div className="text-sm text-gray-600">Applications before 1 interview</div>
//                   </div>
//                 </div>
//               </motion.div>

//           </motion.div>

//           {/* Solutions Side */}
//           <motion.div
//             initial={{ opacity: 0, x: 20 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             viewport={{ once: true, margin: "-50px" }}
//             transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
//             className="order-2 lg:order-2"
//           >
//             <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-6 sm:mb-8 flex items-center gap-3">
//               <div className="p-2 bg-cyan-100 rounded-lg">
//                 <FaCheck className="text-cyan-600 w-5 h-5 sm:w-6 sm:h-6" />
//               </div>
//               <span>HireLift Solutions</span>
//             </h3>
            
//             <div className="space-y-4 sm:space-y-6 mb-8">
//               {solutions.map((solution, index) => (
//                 <motion.div
//                   key={index}
//                   initial={{ opacity: 0, y: 15 }}
//                   whileInView={{ opacity: 1, y: 0 }}
//                   viewport={{ once: true, margin: "-30px" }}
//                   transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
//                   className="group p-6 sm:p-8 bg-white/80 backdrop-blur-sm border-l-4 border-cyan-400 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] relative overflow-hidden"
//                 >
                  
//                   <div className="relative flex items-start gap-4 sm:gap-6">
//                     <div className={`flex-shrink-0 p-3 sm:p-4 bg-gradient-to-r ${solution.color} rounded-xl sm:rounded-2xl shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
//                       <solution.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <h4 className="font-bold text-gray-800 mb-2 sm:mb-3 text-lg sm:text-xl leading-tight group-hover:text-gray-700 transition-colors duration-300">
//                         {solution.title}
//                       </h4>
//                       <p className="text-gray-600 text-sm sm:text-base leading-relaxed group-hover:text-gray-600 transition-colors duration-300">
//                         {solution.description}
//                       </p>
//                     </div>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>

//             {/* Enhanced CTA */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ delay: 0.8 }}
//               className="text-center"
//             >
//               <button 
//                 onClick={() => handleRedirect('/audit')}
//                 className="group px-8 sm:px-12 py-4 sm:py-5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-lg sm:text-xl rounded-2xl shadow-xl hover:shadow-cyan-500/30 transition-all duration-300 hover:scale-105 hover:from-cyan-700 hover:to-blue-700 flex items-center gap-3 mx-auto"
//               >
//                 <span>Start Free</span>
//                 <motion.span
//                   className="text-xl"
//                   animate={{ x: [0, 5, 0] }}
//                   transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
//                 >
//                   →
//                 </motion.span>
//               </button>
//               <p className="text-gray-500 text-sm sm:text-base mt-4">
//                 No credit card required • Get results in 2 minutes
//               </p>
//             </motion.div>
//           </motion.div>
//         </div>

        
//       </div>
//     </section>
//   );
// }