'use client';

import { motion } from 'framer-motion';
import { FaStar, FaQuoteLeft, FaShieldAlt, FaUsers, FaChartLine } from 'react-icons/fa';

export default function ProofTrustSection() {
  const testimonials = [
    {
      name: "Rahul Sharma",
      role: "Software Engineer at TCS",
      content: "HireLift's ATS optimization got me 5x more interview calls. The HR directory helped me connect directly with hiring managers!",
      rating: 5,
      image: "/testimonials/rahul.jpg"
    },
    {
      name: "Priya Patel", 
      role: "Marketing Manager at Wipro",
      content: "I was struggling for 6 months. After using HireLift's resume audit and cold email templates, I landed my dream job in 3 weeks!",
      rating: 5,
      image: "/testimonials/priya.jpg"
    },
    {
      name: "Arjun Reddy",
      role: "Data Analyst at Infosys", 
      content: "The ATS score feature showed me exactly what was wrong with my resume. Fixed it and got interviews from 3 companies in the same week!",
      rating: 5,
      image: "/testimonials/arjun.jpg"
    }
  ];

  const metrics = [
    {
      icon: FaUsers,
      value: "2,000+",
      label: "resumes audited",
      color: "from-cyan-500 to-cyan-600"
    },
    {
      icon: FaChartLine,
      value: "500+", 
      label: "HR contacts verified",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: FaShieldAlt,
      value: "100%",
      label: "secure & private",
      color: "from-cyan-600 to-blue-600"
    }
  ];

  return (
    <section id="proof-trust" className="py-20 px-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-cyan-100/30 to-transparent rounded-full"></div>
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-100 to-blue-100 px-4 py-2 rounded-full mb-6">
            <span className="text-gray-700 font-semibold">⭐ Trusted by 2000+ Job Seekers</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Real Results from <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">Real People</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how HireLift helped job seekers like you land their dream jobs
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 relative border border-cyan-100/50"
            >
              <FaQuoteLeft className="absolute top-6 right-6 w-6 h-6 text-cyan-200" />
              
              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FaStar key={i} className="w-4 h-4 text-yellow-500" />
                ))}
              </div>

              {/* Content */}
              <p className="text-gray-700 mb-6 leading-relaxed font-medium">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-gray-800">{testimonial.name}</div>
                  <div className="text-gray-600 text-sm">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="grid md:grid-cols-3 gap-8 mb-16"
        >
          {metrics.map((metric, index) => (
            <div key={index} className="text-center">
              <div className={`inline-flex p-4 bg-gradient-to-r ${metric.color} rounded-2xl mb-4`}>
                <metric.icon className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl font-bold text-gray-800 mb-2">{metric.value}</div>
              <div className="text-gray-600">{metric.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Privacy Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200 px-6 py-4 rounded-2xl">
            <FaShieldAlt className="w-6 h-6 text-cyan-600" />
            <div>
              <div className="font-bold text-gray-800">Your resume is 100% secure & private</div>
              <div className="text-gray-600 text-sm">We never share your data. Encrypted and protected.</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}