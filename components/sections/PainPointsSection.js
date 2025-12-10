'use client';

import { motion } from 'framer-motion';
import { FaFileAlt, FaUsers, FaBriefcase } from 'react-icons/fa';

export default function PainPointsSection() {
  const painPoints = [
    {
      icon: FaFileAlt,
      title: "Ditch Blank Page Anxiety",
      description: "Get expert guidance on crafting resumes that highlight your strengths, even with limited experience. Turn confusion into confidence.",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    {
      icon: FaUsers,
      title: "Get Noticed by HRs",
      description: "Use proven cold email templates that actually get responses. Reach hiring managers directly and skip the resume black hole.",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600"
    },
    {
      icon: FaBriefcase,
      title: "Stop Getting Ghosted",
      description: "Access verified HR contacts and connect directly with hiring managers. Skip the application black hole entirely.",
      bgColor: "bg-pink-50",
      iconColor: "text-pink-600"
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-4">
            We Know It Feels Hopeless. Here's Your Unfair Advantage.
          </h2>
        </motion.div>

        {/* Pain Points Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {painPoints.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className={`w-20 h-20 ${point.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                <point.icon className={`text-4xl ${point.iconColor}`} />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {point.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {point.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
