'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaQuestionCircle } from 'react-icons/fa';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (index) => {
    console.log('FAQ clicked:', index, 'Current openIndex:', openIndex);
    const newIndex = openIndex === index ? null : index;
    console.log('Setting new index:', newIndex);
    setOpenIndex(newIndex);
  };

  // Debug render
  console.log('Component render - openIndex:', openIndex);

  const faqs = [
    {
      question: "Is my resume data safe?",
      answer: "Yes, your resume data is 100% secure. We use enterprise-grade encryption to protect your information and never share your data with third parties. All uploads are processed securely and your privacy is our top priority.",
      category: "Privacy & Security"
    },
    {
      question: "Does HireLift guarantee jobs?",
      answer: "No, we don't guarantee jobs, but we maximize your interview chances. HireLift optimizes your resume for ATS systems, provides direct HR contacts, and gives you proven templates - significantly improving your odds of landing interviews and job offers.",
      category: "Expectations"
    },
    {
      question: "Why only ₹99?",
      answer: "We believe every fresher and job seeker in India deserves access to quality job search tools. At ₹99, HireLift is affordable for everyone while providing premium features that typically cost 10x more on other platforms.",
      category: "Pricing"
    },
    {
      question: "How effective is HireLift compared to traditional job portals?",
      answer: "HireLift users get hired 3x faster than traditional job portal users. While job portals have low response rates (2-5%), HireLift's direct approach through optimized resumes and HR outreach achieves 15-25% response rates.",
      category: "Effectiveness"
    },
    {
      question: "What happens after I review my resume?",
      answer: "After your free review, you'll receive a detailed ATS score with specific suggestions to improve your resume. You can then upgrade to get unlimited reviews, access to our HR directory, and proven cold email templates.",
      category: "Process"
    },
    {
      question: "How quickly can I see results?",
      answer: "Most users see results within 1-2 weeks. The ATS optimization shows immediate improvement in your resume score. Cold email outreach typically generates responses within 3-5 days of sending.",
      category: "Timeline"
    }
  ];

  return (
    <section className="py-20 px-6 relative overflow-hidden">
      <div className="absolute top-1/4 left-0 w-72 h-72 bg-gradient-to-br from-cyan-100/30 to-transparent rounded-full"></div>
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-cyan-100 px-4 py-2 rounded-full mb-6">
            <FaQuestionCircle className="w-4 h-4 text-cyan-600" />
            <span className="text-cyan-700 font-semibold">Frequently Asked Questions</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Everything You Need to Know About Job Search in India
          </h2>
          <p className="text-xl text-gray-600">
            Get answers to common questions about ATS optimization, HR contacts, and job hunting strategies
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 overflow-hidden"
            >
              <button
                onClick={() => handleToggle(index)}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-cyan-50/30 transition-colors"
              >
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {faq.question}
                  </h3>
                  <span className="text-sm text-cyan-600 bg-cyan-50 px-3 py-1 rounded-full">
                    {faq.category}
                  </span>
                </div>
                <div className="ml-4">
                  {openIndex === index ? (
                    <FaChevronUp className="w-5 h-5 text-cyan-600" />
                  ) : (
                    <FaChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </div>
              </button>
              
              {/* Simple version without animation for testing */}
              {openIndex === index && (
                <div className="px-6 pb-6 border-t border-gray-100">
                  <p className="text-gray-700 leading-relaxed pt-4">
                    {faq.answer}
                  </p>
                </div>
              )}

              {/* Animated version 
              <AnimatePresence mode="wait">
                {openIndex === index && (
                  <motion.div
                    key={`faq-${index}`}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div className="px-6 pb-6 border-t border-gray-100">
                      <p className="text-gray-700 leading-relaxed pt-4">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              */}
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        {/* <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16 p-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white"
        >
          <h3 className="text-2xl font-bold mb-4">
            Still Have Questions? We're Here to Help!
          </h3>
          <p className="text-lg mb-6 opacity-90">
            Get personalized job search guidance from our career experts
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-white/90 backdrop-blur-sm text-cyan-600 font-semibold rounded-lg hover:bg-white/80 transition-colors">
              Contact Support
            </button>
            <button className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors">
              Schedule Demo
            </button>
          </div>
        </motion.div> */}
      </div>
    </section>
  );
}
