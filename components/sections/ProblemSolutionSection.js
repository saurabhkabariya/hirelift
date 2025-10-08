'use client';

import { motion } from 'framer-motion';
import { FaTimes, FaCheck, FaFileAlt, FaUsers, FaTools } from 'react-icons/fa';

export default function ProblemSolutionSection({ handleRedirect }) {
  const problems = [
    {
      icon: FaTimes,
      title: "Resume gets rejected by ATS systems",
      description: "Your resume isn't optimized for Applicant Tracking Systems"
    },
    {
      icon: FaTimes,
      title: "No response from HR departments", 
      description: "You're applying blindly without direct HR contacts"
    },
    {
      icon: FaTimes,
      title: "Don't know what's wrong with applications",
      description: "No feedback or guidance on improving your job search"
    }
  ];

  const solutions = [
    {
      icon: FaFileAlt,
      title: "Unlimited Resume Audits",
      description: "Get detailed ATS scores and fix suggestions to beat resume filters",
      color: "from-cyan-500 to-cyan-600"
    },
    {
      icon: FaUsers,
      title: "Verified HR Directory", 
      description: "Direct access to 500+ verified HR contacts across top companies",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: FaTools,
      title: "Job Prep Tools",
      description: "Cold email templates, interview tips, and proven strategies",
      color: "from-cyan-600 to-blue-600"
    }
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Clean Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-cyan-100/30 to-transparent rounded-full"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-blue-100/30 to-transparent rounded-full"></div>
      
      <div className="relative max-w-7xl mx-auto">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center mb-12 sm:mb-16 lg:mb-20"
        >
          <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm px-6 py-3 rounded-full mb-6 border-2 border-cyan-200 shadow-lg">
            <span className="text-cyan-700 font-bold text-sm sm:text-base">⚡ Problem → Solution</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-gray-800 mb-4 sm:mb-6 leading-tight">
            Stop Struggling,<br className="sm:hidden" /> Start{' '}
            <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              Succeeding
            </span>
          </h2>
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            We've identified the exact problems keeping you from landing interviews - and built the perfect solutions.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-start">
          
          {/* Problems Side */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="order-2 lg:order-1"
          >
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-6 sm:mb-8 flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <FaTimes className="text-red-500 w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <span>Common Problems</span>
            </h3>
              
              <div className="space-y-4 sm:space-y-6">
              {problems.map((problem, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-start gap-4 p-6 bg-white/80 backdrop-blur-sm border-l-4 border-red-400 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <problem.icon className="w-6 h-6 text-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">{problem.title}</h4>
                    <p className="text-gray-600">{problem.description}</p>
                  </div>
                </motion.div>
              ))}
              </div>

              {/* Impact Statistics */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
                className="mt-8 p-6 bg-white/80 backdrop-blur-sm border-l-4 border-red-400 rounded-2xl shadow-lg"
              >
                <h4 className="text-lg font-bold text-gray-800 mb-4 text-center">
                  The Cost of These Problems
                </h4>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200">
                    <div className="text-2xl font-black text-red-500 mb-1">95%</div>
                    <div className="text-sm text-gray-600">Applications get rejected by ATS</div>
                  </div>
                  <div className="p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200">
                    <div className="text-2xl font-black text-red-500 mb-1">6+ months</div>
                    <div className="text-sm text-gray-600">Average job search time</div>
                  </div>
                  <div className="p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200">
                    <div className="text-2xl font-black text-red-500 mb-1">2%</div>
                    <div className="text-sm text-gray-600">Response rate on job portals</div>
                  </div>
                  <div className="p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200">
                    <div className="text-2xl font-black text-red-500 mb-1">100+</div>
                    <div className="text-sm text-gray-600">Applications before 1 interview</div>
                  </div>
                </div>
              </motion.div>

          </motion.div>

          {/* Solutions Side */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="order-1 lg:order-2"
          >
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-6 sm:mb-8 flex items-center gap-3">
              <div className="p-2 bg-cyan-100 rounded-lg">
                <FaCheck className="text-cyan-600 w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <span>HireLift Solutions</span>
            </h3>
            
            <div className="space-y-4 sm:space-y-6 mb-8">
              {solutions.map((solution, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
                  className="group p-6 sm:p-8 bg-white/80 backdrop-blur-sm border-l-4 border-cyan-400 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] relative overflow-hidden"
                >
                  
                  <div className="relative flex items-start gap-4 sm:gap-6">
                    <div className={`flex-shrink-0 p-3 sm:p-4 bg-gradient-to-r ${solution.color} rounded-xl sm:rounded-2xl shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
                      <solution.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-800 mb-2 sm:mb-3 text-lg sm:text-xl leading-tight group-hover:text-gray-700 transition-colors duration-300">
                        {solution.title}
                      </h4>
                      <p className="text-gray-600 text-sm sm:text-base leading-relaxed group-hover:text-gray-600 transition-colors duration-300">
                        {solution.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Enhanced CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
              className="text-center"
            >
              <button 
                onClick={() => handleRedirect('/audit')}
                className="group px-8 sm:px-12 py-4 sm:py-5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-lg sm:text-xl rounded-2xl shadow-xl hover:shadow-cyan-500/30 transition-all duration-300 hover:scale-105 hover:from-cyan-700 hover:to-blue-700 flex items-center gap-3 mx-auto"
              >
                <span>Start Free</span>
                <motion.span
                  className="text-xl"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  →
                </motion.span>
              </button>
              <p className="text-gray-500 text-sm sm:text-base mt-4">
                No credit card required • Get results in 2 minutes
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Pain Points Bridge Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mt-16 mb-12"
        >
          <div className="max-w-4xl mx-auto p-8 bg-white/80 backdrop-blur-sm border-l-4 border-cyan-400 rounded-2xl shadow-xl">
            <h4 className="text-2xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center gap-3">
              <span className="text-red-500">😔</span>
              Sound Familiar?
            </h4>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
              <div className="p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200">
                <div className="text-red-400 mb-2">💔</div>
                <p className="text-sm text-gray-600">"I've applied to 200+ jobs but only got 2 interviews"</p>
              </div>
              <div className="p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200">
                <div className="text-red-400 mb-2">🕳️</div>
                <p className="text-sm text-gray-600">"My resume disappears into a black hole"</p>
              </div>
              <div className="p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200">
                <div className="text-red-400 mb-2">❓</div>
                <p className="text-sm text-gray-600">"I don't know what I'm doing wrong"</p>
              </div>
              <div className="p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200">
                <div className="text-red-400 mb-2">😩</div>
                <p className="text-sm text-gray-600">"Job search is taking forever and draining me"</p>
              </div>
            </div>
            <div className="mt-6 text-center">
              <p className="text-lg font-semibold text-gray-700">
                <span className="text-cyan-600">Good news:</span> These problems have solutions! ⬇️
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}