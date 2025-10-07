'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaUsers, FaCrown, FaChartLine, FaShieldAlt, FaInfinity, FaUserTie, FaStar, FaAward, FaGem } from 'react-icons/fa';
import { getPricingForCountry } from '@/utils/getUserCountry';

export default function PricingSection({ handleRedirect }) {
  const [pricingConfig, setPricingConfig] = useState(getPricingForCountry('IN'));
  const [locationLoading, setLocationLoading] = useState(true);

  // Detect user location and update pricing
  useEffect(() => {
    const detectLocation = async () => {
      try {
        const response = await fetch('/api/detect-location');
        if (response.ok) {
          const locationData = await response.json();
          setPricingConfig(getPricingForCountry(locationData.country));
        }
      } catch (error) {
        console.error('Error detecting location:', error);
        // Keep default India pricing
      } finally {
        setLocationLoading(false);
      }
    };

    detectLocation();
  }, []);
  const benefits = [
    { icon: FaChartLine, title: "Fast Analysis", desc: "Get your ATS score in seconds" },
    { icon: FaShieldAlt, title: "Secure & Private", desc: "Your data is protected" },
    { icon: FaInfinity, title: "Expert Support", desc: "Professional guidance included" },
    { icon: FaUserTie, title: "Proven Results", desc: "Join 10k+ successful candidates" }
  ];

  const plans = [
    {
      name: "Free",
      price: `${pricingConfig.symbol}0`,
      period: "",
      description: "Perfect for trying out our service",
      icon: FaUsers,
      bgColor: "bg-gray-100",
      iconColor: "text-gray-600",
      buttonColor: "bg-gray-600 hover:bg-gray-700",
      popular: false,
      features: [
        "1 Basic Resume Audit",
        "Email/DM Templates",
        "Basic ATS Score",
        "Standard Support"
      ]
    },
    {
      name: "Basic",
      price: `${pricingConfig.symbol}${pricingConfig.amounts.basic}`,
      period: "/30 days",
      description: "Unlimited audits for job seekers",
      icon: FaStar,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
      popular: false,
      features: [
        "Unlimited Resume Audits",
        "Advanced ATS Analysis",
        "Keyword Optimization",
        "Priority Support"
      ]
    },
    {
      name: "Professional",
      price: `${pricingConfig.symbol}${pricingConfig.amounts.professional}`,
      period: "one-time",
      description: "Complete resume rewrite",
      icon: FaAward,
      bgColor: "bg-cyan-100",
      iconColor: "text-cyan-600",
      buttonColor: "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700",
      popular: true,
      features: [
        "Complete Resume Rewrite",
        "2 Revisions Included",
        "Personal Consultation",
        "ATS Optimization"
      ]
    }
  ];

  return (
    <section id="pricing" className="py-20 px-6 relative">
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-cyan-50/40 to-transparent rounded-full"></div>
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Choose Your Success Plan
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            From free audits to professional resume rewrites - we've got you covered
          </p>
          
          {/* New pricing highlight */}
          <div className="inline-flex items-center gap-2 bg-cyan-100 border border-cyan-200 px-6 py-3 rounded-full">
            <FaGem className="text-cyan-600" />
            <span className="text-cyan-700 font-bold">
              ✨ New Plans Available - Starting {pricingConfig.symbol}{pricingConfig.amounts.basic}
            </span>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {locationLoading ? (
            /* Loading state for pricing cards */
            [...Array(3)].map((_, i) => (
              <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-8 animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="h-8 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="space-y-2 mb-6">
                  {[...Array(4)].map((_, j) => (
                    <div key={j} className="h-3 bg-gray-200 rounded"></div>
                  ))}
                </div>
                <div className="h-10 bg-gray-300 rounded"></div>
              </div>
            ))
          ) : (
            plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl ${plan.popular ? 'border-2 border-cyan-300' : 'border border-gray-200'} p-8 relative`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-center py-3 text-sm font-bold rounded-t-2xl">
                  MOST POPULAR
                </div>
              )}
              
              <div className={`text-center mb-8 ${plan.popular ? 'pt-8' : ''}`}>
                <div className={`w-16 h-16 ${plan.bgColor} rounded-xl flex items-center justify-center mx-auto mb-6`}>
                  <plan.icon className={`w-8 h-8 ${plan.iconColor}`} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-800">{plan.price}</span>
                  {plan.period && <span className="text-gray-600 ml-1">{plan.period}</span>}
                </div>
                <p className="text-gray-600">{plan.description}</p>
              </div>
              
              <div className="space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <FaCheckCircle className="w-5 h-5 text-cyan-500" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
              
              <button
                onClick={() => handleRedirect('/pricing')}
                className={`w-full py-3 px-6 rounded-lg text-white font-bold text-center block transition-all duration-300 ${plan.buttonColor}`}
              >
                {plan.name === 'Free' ? 'Get Started' : 'Choose Plan'}
              </button>
            </motion.div>
            ))
          )}
        </div>

        {/* View All Plans Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <button
            onClick={() => handleRedirect('/pricing')}
            className="inline-flex items-center gap-2 cursor-pointer text-cyan-600 hover:text-cyan-700 font-semibold text-lg underline hover:no-underline transition-all duration-200"
          >
            View All 5 Plans & Pricing Details
            <FaChartLine className="w-4 h-4" />
          </button>
        </motion.div>

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
              <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <benefit.icon className="w-6 h-6 text-cyan-600" />
              </div>
              <h4 className="font-bold text-gray-800 mb-2">{benefit.title}</h4>
              <p className="text-gray-600 text-sm">{benefit.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
