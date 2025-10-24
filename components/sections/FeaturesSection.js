'use client';

import { motion } from 'framer-motion';
import { FaCheckCircle, FaBuilding, FaEdit } from 'react-icons/fa';

export default function FeaturesSection() {
  const features = [
    {
      icon: FaCheckCircle,
      title: "Resume Review",
      description: "Get instant feedback on your resume with our AI-powered Review. Identify exactly what's blocking your applications.",
      features: ["ATS Compatibility Score", "Keyword Optimization", "Section Analysis", "Instant Improvements"],
      badge: "FREE",
      badgeColor: "green"
    },
    {
      icon: FaBuilding,
      title: "HR Directory",
      description: "Access curated lists of HR contacts and company details. Connect directly with decision-makers.",
      features: ["Direct HR Contacts", "LinkedIn Profiles", "Company Details", "Social Profiles"],
      badge: "PRO",
      badgeColor: "purple"
    },
    {
      icon: FaEdit,
      title: "Smart Templates",
      description: "Use proven outreach templates that get responses. Customize professional emails and LinkedIn messages.",
      features: ["Email Templates", "LinkedIn Messages", "Live Preview", "Instant Download"],
      badge: "FREE",
      badgeColor: "green"
    }
  ];

  return (
    <section id="features" className="py-20 px-6 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 relative">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Everything You Need to Get Hired
          </h2>
          <p className="text-xl text-gray-300">
            Comprehensive toolkit for job search success
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300"
            >
              <div className="mb-6">
                <feature.icon className="w-12 h-12 text-blue-400 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
              
              <div className="space-y-3 mb-6">
                {feature.features.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="text-green-400">✓</span>
                    <span className="text-gray-300 text-sm">{item}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  feature.badgeColor === "green" ? "bg-green-500 text-white" : "bg-purple-500 text-white"
                }`}>
                  {feature.badge}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
