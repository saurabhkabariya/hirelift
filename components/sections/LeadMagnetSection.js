'use client';

import { motion } from 'framer-motion';
import { FaFileAlt, FaEnvelope, FaGift, FaArrowRight } from 'react-icons/fa';

export default function LeadMagnetSection({ handleRedirect }) {
  const leadMagnets = [
    {
      icon: FaFileAlt,
      title: "Free Resume Audit",
      description: "Get your ATS score and detailed feedback instantly",
      cta: "Start Free Audit",
      link: "/audit",
      value: "Worth ₹299",
      color: "from-green-500 to-emerald-500",
      bgColor: "from-green-50 to-emerald-50"
    },
    {
      icon: FaEnvelope,
      title: "Free Email Templates",
      description: "50+ proven templates for HR outreach and networking",
      cta: "Browse Templates",
      link: "/playground",
      value: "Worth ₹199", 
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-50 to-cyan-50"
    }
  ];

  return (
    <section className="py-16 px-6 bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-gradient-to-br from-green-400 to-blue-400 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="relative max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-blue-100 px-4 py-2 rounded-full mb-6">
            <FaGift className="w-4 h-4 text-green-600" />
            <span className="text-green-700 font-semibold">Start Free Today</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Get Started with Free Tools
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Try our platform risk-free with valuable tools that help you land interviews faster
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {leadMagnets.map((magnet, index) => (
            <motion.div
              key={magnet.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative bg-gradient-to-br ${magnet.bgColor} p-8 rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer`}
              onClick={() => handleRedirect(magnet.link)}
            >
              {/* Value Badge */}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                <span className="text-sm font-bold text-gray-700">{magnet.value}</span>
              </div>

              {/* Icon */}
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${magnet.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <magnet.icon className="w-8 h-8 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{magnet.title}</h3>
              <p className="text-gray-700 mb-6 leading-relaxed">{magnet.description}</p>

              {/* CTA Button */}
              <div className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${magnet.color} text-white font-semibold rounded-lg group-hover:shadow-lg transition-all duration-300`}>
                <span>{magnet.cta}</span>
                <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"></div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 mb-4">Ready for unlimited audits and HR contacts?</p>
          <button
            onClick={() => handleRedirect('/pricing')}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 hover:scale-105 shadow-lg"
          >
            View Pro Plans
          </button>
        </motion.div>
      </div>
    </section>
  );
}
