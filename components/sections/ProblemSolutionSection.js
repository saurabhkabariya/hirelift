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
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: FaUsers,
      title: "Verified HR Directory", 
      description: "Direct access to 500+ verified HR contacts across top companies",
      color: "from-green-500 to-green-600"
    },
    {
      icon: FaTools,
      title: "Job Prep Tools",
      description: "Cold email templates, interview tips, and proven strategies",
      color: "from-purple-500 to-purple-600"
    }
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50"></div>
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-green-200/20 rounded-full blur-3xl"></div>
      
      <div className="relative max-w-7xl mx-auto">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16 lg:mb-20"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-100 to-green-100 px-4 py-2 rounded-full mb-6 border border-gray-200/50 shadow-sm">
            <span className="text-gray-700 font-semibold text-sm sm:text-base">⚡ Problem → Solution</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-gray-900 mb-4 sm:mb-6 leading-tight">
            Stop Struggling,<br className="sm:hidden" /> Start{' '}
            <span className="bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
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
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="order-2 lg:order-1"
          >
            <div className="sticky top-24">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 flex items-center gap-3">
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
                  className="flex items-start gap-4 p-4 bg-red-50 border border-red-200 rounded-xl"
                >
                  <problem.icon className="w-6 h-6 text-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">{problem.title}</h4>
                    <p className="text-gray-600">{problem.description}</p>
                  </div>
                </motion.div>
              ))}
              </div>

              {/* Impact Statistics */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="mt-8 p-6 bg-gradient-to-br from-red-50 to-orange-50 border border-red-100 rounded-2xl"
              >
                <h4 className="text-lg font-bold text-gray-900 mb-4 text-center">
                  The Cost of These Problems
                </h4>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-white/70 rounded-xl">
                    <div className="text-2xl font-black text-red-500 mb-1">95%</div>
                    <div className="text-sm text-gray-600">Applications get rejected by ATS</div>
                  </div>
                  <div className="p-3 bg-white/70 rounded-xl">
                    <div className="text-2xl font-black text-red-500 mb-1">6+ months</div>
                    <div className="text-sm text-gray-600">Average job search time</div>
                  </div>
                  <div className="p-3 bg-white/70 rounded-xl">
                    <div className="text-2xl font-black text-red-500 mb-1">2%</div>
                    <div className="text-sm text-gray-600">Response rate on job portals</div>
                  </div>
                  <div className="p-3 bg-white/70 rounded-xl">
                    <div className="text-2xl font-black text-red-500 mb-1">100+</div>
                    <div className="text-sm text-gray-600">Applications before 1 interview</div>
                  </div>
                </div>
              </motion.div>

              {/* Pain Points */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 }}
                className="mt-6 p-6 bg-gradient-to-br from-gray-50 to-blue-50 border border-gray-200 rounded-2xl"
              >
                <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-red-500">😔</span>
                  Sound Familiar?
                </h4>
                <div className="grid sm:grid-cols-2 gap-3 text-sm text-gray-600">
                  <div className="flex items-start gap-2">
                    <span className="text-red-400 mt-0.5 flex-shrink-0">•</span>
                    <span>"I've applied to 200+ jobs but only got 2 interviews"</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-red-400 mt-0.5 flex-shrink-0">•</span>
                    <span>"My resume disappears into a black hole"</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-red-400 mt-0.5 flex-shrink-0">•</span>
                    <span>"I don't know what I'm doing wrong"</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-red-400 mt-0.5 flex-shrink-0">•</span>
                    <span>"Job search is taking forever and draining me"</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Solutions Side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="order-1 lg:order-2"
          >
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FaCheck className="text-green-500 w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <span>HireLift Solutions</span>
            </h3>
            
            <div className="space-y-4 sm:space-y-6 mb-8">
              {solutions.map((solution, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="group p-6 sm:p-8 bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:border-gray-300 relative overflow-hidden"
                >
                  {/* Subtle background pattern */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative flex items-start gap-4 sm:gap-6">
                    <div className={`flex-shrink-0 p-3 sm:p-4 bg-gradient-to-r ${solution.color} rounded-xl sm:rounded-2xl shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
                      <solution.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 mb-2 sm:mb-3 text-lg sm:text-xl leading-tight group-hover:text-gray-800 transition-colors duration-300">
                        {solution.title}
                      </h4>
                      <p className="text-gray-600 text-sm sm:text-base leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
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
                className="group px-8 sm:px-12 py-4 sm:py-5 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-lg sm:text-xl rounded-2xl shadow-xl hover:shadow-green-500/30 transition-all duration-300 hover:scale-105 hover:from-green-600 hover:to-emerald-600 flex items-center gap-3 mx-auto"
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
      </div>
    </section>
  );
}