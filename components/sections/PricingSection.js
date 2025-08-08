'use client';

import { motion } from 'framer-motion';
import { FaCheckCircle, FaUsers, FaCrown, FaChartLine, FaShieldAlt, FaInfinity, FaUserTie } from 'react-icons/fa';

export default function PricingSection({ handleRedirect }) {
  const benefits = [
    { icon: FaChartLine, title: "Fast Analysis", desc: "Get your ATS score in seconds" },
    { icon: FaShieldAlt, title: "Secure & Private", desc: "Your data is protected" },
    { icon: FaInfinity, title: "Unlimited Audits", desc: "Improve continuously" },
    { icon: FaUserTie, title: "Expert Support", desc: "Get help when needed" }
  ];

  return (
    <section id="pricing" className="py-20 px-6 bg-gradient-to-br from-gray-50 to-blue-50 relative">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Choose Your Success Plan
          </h2>
          <p className="text-xl text-gray-700">
            Get unlimited resume audits and land your dream job
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {/* Free Plan */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <FaUsers className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Free</h3>
              <div className="text-4xl font-bold text-gray-900 mb-4">₹0</div>
              <p className="text-gray-600">Perfect for trying out our service</p>
            </div>
            
            <div className="space-y-4 mb-8">
              {[
                "1 Basic Resume Audit",
                "Email/DM Templates",
                "Basic ATS Score",
                "Standard Support"
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <FaCheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
            
            <button
              onClick={() => handleRedirect('/audit')}
              className="w-full py-3 px-6 rounded-lg bg-gray-600 text-white font-bold text-center block hover:bg-gray-700 transition-all duration-300"
            >
              Get Started
            </button>
          </motion.div>

          {/* Pro Plan */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-xl border-2 border-purple-300 p-8 relative"
          >
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-center py-3 text-sm font-bold rounded-t-2xl">
              MOST POPULAR • 50% OFF
            </div>
            
            <div className="text-center mb-8 pt-8">
              <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <FaCrown className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Pro</h3>
              <div className="mb-4">
                <span className="text-2xl text-gray-500 line-through">₹199</span>
                <span className="text-4xl font-bold text-green-600 ml-2">₹99</span>
                <span className="text-gray-600">/month</span>
              </div>
              <p className="text-gray-600">Most popular for job seekers</p>
            </div>
            
            <div className="space-y-4 mb-8">
              {[
                "Unlimited Resume Audits",
                "Curated HR & Company Lists", 
                "Personalized Outreach Templates",
                "Advanced ATS Analysis",
                "Keyword Optimization",
                "Priority Support"
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <FaCheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
            
            <button 
              onClick={() => handleRedirect('/pricing')}
              className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-center block hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
            >
              Get 50% OFF Now
            </button>
          </motion.div>
        </div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <benefit.icon className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">{benefit.title}</h4>
              <p className="text-gray-600 text-sm">{benefit.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
