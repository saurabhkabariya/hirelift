'use client';

import { motion } from 'framer-motion';
import { FaCheckCircle, FaBuilding, FaEdit, FaRocket } from 'react-icons/fa';

export default function HowItWorksSection({ handleRedirect }) {
  const steps = [
    {
      step: "1",
      title: "Fix Your ATS Score",
      description: "Our AI analyzes your resume and identifies exactly why you're getting rejected. Transform your low ATS score into a high-performing resume.",
      icon: FaCheckCircle,
      benefit: "85% ATS Pass Rate",
      stat: "2x More Interviews",
      color: "from-red-500 to-pink-500"
    },
    {
      step: "2", 
      title: "Connect with HRs Directly",
      description: "Access curated lists of HR contacts and company details. No more applying into the void - reach decision-makers directly.",
      icon: FaBuilding,
      benefit: "Direct HR Access",
      stat: "Skip the Queue",
      color: "from-blue-500 to-cyan-500"
    },
    {
      step: "3",
      title: "Send Winning Messages", 
      description: "Use our proven outreach templates that get responses. Customize professional emails and LinkedIn messages that make HRs want to interview you.",
      icon: FaEdit,
      benefit: "75% Response Rate",
      stat: "Land Your Dream Job",
      color: "from-green-500 to-emerald-500"
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
            <span className="text-blue-600 font-semibold">🚀 Proven Process</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            How It Works
          </h2>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Our proven 3-step process has helped <span className="font-bold text-blue-600">100+ professionals</span> land their dream jobs
          </p>
        </motion.div>

        <div className="relative">
          {/* Progress Line for Desktop */}
          <div className="hidden md:block absolute top-26 left-1/2 transform -translate-x-1/2 w-full max-w-4xl">
            <div className="flex justify-between items-center px-10">
              <div className="w-4 h-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-full"></div>
              <div className="flex-1 h-1 bg-gradient-to-r from-red-500 via-blue-500 to-green-500 mx-4"></div>
              <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
              <div className="flex-1 h-1 bg-gradient-to-r from-blue-500 to-green-500 mx-4"></div>
              <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="text-center group"
              >
                <div className="relative mb-8">
                  {/* Main Icon Container */}
                  <div className={`w-24 h-24 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 transition-all duration-300`}>
                    <step.icon className="w-12 h-12 text-white" />
                  </div>
                  
                  {/* Step Number Badge */}
                  <div className="absolute -top-3 -right-1 w-10 h-10 bg-white border-4 border-gray-100 rounded-full flex items-center justify-center text-gray-900 font-bold text-lg shadow-lg">
                    {step.step}
                  </div>
                  
                  {/* Benefit Badge */}
                  <div className="mt-8">
                    <span className={`inline-flex items-center px-3 py-1 bg-gradient-to-r ${step.color} text-white text-sm font-bold rounded-full shadow-lg`}>
                      ✨ {step.benefit}
                    </span>
                  </div>
                </div>
                
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                  {step.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed mb-6 text-base md:text-lg">
                  {step.description}
                </p>
                
                {/* Result Highlight */}
                <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 group-hover:shadow-xl transition-all duration-300">
                  <div className="text-sm text-gray-500 mb-1">Expected Result:</div>
                  <div className={`font-bold text-lg bg-gradient-to-r ${step.color} bg-clip-text text-transparent`}>
                    {step.stat}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Enhanced CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-white rounded-2xl p-8 shadow-2xl border border-gray-100 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-2xl">🎯</span>
              <span className="font-bold text-gray-900">Ready to Get Started?</span>
            </div>
            
            <p className="text-gray-600 mb-6">
              Join thousands of professionals who&apos;ve transformed their job search with our proven system
            </p>
            
            <button
              onClick={() => handleRedirect('/audit')}
              className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xl rounded-xl shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105 group"
            >
              <FaRocket className="w-6 h-6 group-hover:animate-bounce" />
              Start Your Success Story
              <span className="bg-yellow-300 text-yellow-900 text-sm px-4 py-2 rounded-full font-bold animate-pulse">
                FREE AUDIT
              </span>
            </button>
            
            <div className="flex items-center justify-center gap-6 mt-6 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <FaCheckCircle className="w-4 h-4 text-green-500" />
                No Credit Card Required
              </div>
              <div className="flex items-center gap-1">
                <FaCheckCircle className="w-4 h-4 text-green-500" />
                Instant Results
              </div>
              <div className="flex items-center gap-1">
                <FaCheckCircle className="w-4 h-4 text-green-500" />
                100% Free
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
