'use client';

import { motion } from 'framer-motion';
import { FaUpload, FaBrain, FaRocket, FaArrowRight } from 'react-icons/fa';

export default function HowItWorksSection({ handleRedirect }) {
  const steps = [
    {
      number: "01",
      icon: FaUpload,
      title: "Upload Your Resume",
      description: "Drag, drop, done. Our AI starts analyzing immediately.",
      color: "from-cyan-400 to-cyan-500"
    },
    {
      number: "02", 
      icon: FaBrain,
      title: "AI Reveals the Truth",
      description: "See exactly what's blocking you from interviews. No sugar-coating.",
      color: "from-green-400 to-green-500"
    },
    {
      number: "03",
      icon: FaRocket,
      title: "Transform & Get Hired",
      description: "Fix the issues, connect with hiring managers, land interviews.",
      color: "from-purple-400 to-purple-500"
    }
  ];

  return (
    <section id="how-it-works" className="py-20 lg:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100">
      
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto mb-20"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-8 leading-tight">
            <span className="text-gray-900 drop-shadow-sm">From Rejection to</span>
            <span className="block bg-gradient-to-r from-cyan-700 to-purple-700 bg-clip-text text-transparent mt-2 drop-shadow-sm">
              Job Offer in 3 Steps
            </span>
          </h2>
          
          <p className="text-xl lg:text-2xl text-gray-800 font-semibold max-w-2xl mx-auto leading-relaxed drop-shadow-sm">
            Simple. Fast. Effective. <br />
            <span className="font-black text-gray-900">Start seeing results in minutes.</span>
          </p>
        </motion.div>

        {/* Steps */}
        <div className="space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-12 mb-16">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="relative group text-center lg:text-left flex flex-col"
            >
              {/* Step Number Background */}
              <div className="text-6xl lg:text-7xl ml-auto font-black text-gray-500/80 mb-2 select-none leading-none drop-shadow-sm">
                {step.number}
              </div>
              
              {/* Icon */}
              <div className="relative mb-6 -mt-8 lg:-mt-10">
                <div className={`w-18 h-18 lg:w-20 lg:h-20 bg-gradient-to-r ${step.color} rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 mx-auto lg:mx-0 shadow-lg`}>
                  <step.icon className="text-white text-2xl lg:text-3xl" />
                </div>
                <div className={`absolute -inset-4 bg-gradient-to-r ${step.color} opacity-20 rounded-3xl blur-xl group-hover:opacity-40 transition-opacity duration-300`}></div>
              </div>
              
              {/* Content */}
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg max-w-xs mx-auto lg:mx-0">
                {step.description}
              </p>
              
              {/* Arrow for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-25 -right-6 transform -translate-y-1/2 z-10">
                  <div className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center">
                    <FaArrowRight className="text-gray-400 text-lg" />
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center bg-white/60 backdrop-blur-sm rounded-3xl p-8 lg:p-12 shadow-xl border border-gray-200/50"
        >
          <motion.button 
            onClick={() => handleRedirect('/audit')}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="px-16 py-6 bg-gradient-to-r from-cyan-600 to-purple-600 text-white font-bold text-xl lg:text-2xl rounded-2xl shadow-2xl hover:shadow-cyan-500/40 transition-all duration-300 flex items-center gap-4 mx-auto hover:from-cyan-700 hover:to-purple-700"
          >
            <FaBrain className="w-7 h-7" />
            Start Your AI Analysis Now
            <FaArrowRight className="w-6 h-6" />
          </motion.button>
          
          <p className="text-gray-700 mt-6 text-lg font-medium">
            <span className="text-green-600 font-bold">✨ Free forever</span> • 
            <span className="text-blue-600 font-bold"> ⚡ Results in 30 seconds</span> • 
            <span className="text-purple-600 font-bold"> 🎯 95% accuracy</span>
          </p>
        </motion.div>

      </div>
    </section>
  );
}