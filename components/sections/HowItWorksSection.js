'use client';

import { motion } from 'framer-motion';
import { FaUpload, FaChartLine, FaCrown } from 'react-icons/fa';

export default function HowItWorksSection({ handleRedirect }) {
  const steps = [
    {
      step: "1",
      title: "Upload Resume",
      description: "Simply upload your current resume in PDF format. Our AI will analyze it instantly and identify all the issues.",
      icon: FaUpload,
      color: "from-blue-500 to-blue-600"
    },
    {
      step: "2", 
      title: "Get ATS Score + Fix Suggestions",
      description: "Receive a detailed ATS compatibility score with specific suggestions on keywords, formatting, and content improvements.",
      icon: FaChartLine,
      color: "from-green-500 to-green-600"
    },
    {
      step: "3",
      title: "Upgrade for Unlimited Audits & HR Directory", 
      description: "Access unlimited resume audits, 500+ verified HR contacts, cold email templates, and job preparation tools.",
      icon: FaCrown,
      color: "from-purple-500 to-purple-600"
    }
  ];

  return (
    <section id="how-it-works" className="py-20 px-6 bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50"></div>
      <div className="relative max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-indigo-100 px-4 py-2 rounded-full mb-6">
            <span className="text-blue-600 font-semibold">🚀 Simple Process</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            How It <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">Works</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get from resume upload to interview calls in just 3 simple steps
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="relative group"
            >
              {/* Connecting Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-gray-300 to-gray-200 z-0 transform translate-x-4"></div>
              )}
              
              <div className="relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-center">
                {/* Step Number */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className={`w-8 h-8 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                    {step.step}
                  </div>
                </div>

                {/* Icon */}
                <div className={`inline-flex p-4 bg-gradient-to-r ${step.color} rounded-2xl mb-6 mt-4`}>
                  <step.icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <button 
            onClick={() => handleRedirect('/audit')}
            className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-xl rounded-xl shadow-xl hover:shadow-green-500/30 transition-all duration-300 hover:scale-105"
          >
            Try Your Free Audit Now
          </button>
          <p className="text-gray-500 mt-4">No credit card required • Takes less than 2 minutes</p>
        </motion.div>
      </div>
    </section>
  );
}