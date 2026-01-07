'use client';

import { motion } from 'framer-motion';
import { FaFileAlt, FaEnvelope, FaBullseye } from 'react-icons/fa';

export default function ToolkitSection() {
  const tools = [
    {
      icon: FaFileAlt,
      title: "AI Resume Review",
      description: "Get instant ATS optimization with AI-powered analysis. Know exactly why recruiters ignore your resume and fix it in minutes.",
      color: "from-green-400 to-emerald-500",
      bgColor: "bg-green-50"
    },
    {
      icon: FaEnvelope,
      title: "Smart Email Templates",
      description: "Access 50+ proven cold email and LinkedIn templates. Get responses from hiring managers and land interviews faster.",
      color: "from-blue-500 to-indigo-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: FaBullseye,
      title: "Smart Job Matching",
      description: "Access 100+ curated jobs and connect directly with hiring managers. Skip the application black hole entirely.",
      color: "from-purple-500 to-pink-600",
      bgColor: "bg-purple-50"
    }
  ];

  return (
    <section id="toolkit" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-4">
            Your Complete Toolkit to Get Hired.
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need for your complete end-to-end job search.
          </p>
        </motion.div>

        {/* Tools Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {tools.map((tool, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`${tool.bgColor} rounded-2xl p-8 hover:shadow-xl transition-all duration-300`}
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${tool.color} rounded-2xl flex items-center justify-center mb-6`}>
                <tool.icon className="text-3xl text-white" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {tool.title}
              </h3>
              
              <p className="text-gray-700 leading-relaxed">
                {tool.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
