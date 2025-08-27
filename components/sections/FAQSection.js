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
      question: "What is ATS resume optimization and why do I need it?",
      answer: "ATS (Applicant Tracking System) resume optimization is the process of formatting and writing your resume to pass through automated screening systems used by 95% of Indian companies. HireLift's free ATS checker analyzes your resume against 50+ ATS criteria and provides instant feedback to improve your chances of getting past the initial screening. Without ATS optimization, your resume might be rejected before any human ever sees it.",
      category: "ATS Resume"
    },
    {
      question: "How do I get direct HR contacts in India?",
      answer: "HireLift provides India's most comprehensive HR directory with verified contacts of hiring managers, recruiters, and HR heads across 1000+ Indian companies. Our Pro plan includes direct email addresses, LinkedIn profiles, phone numbers, and company contact information. This allows you to bypass traditional job portals and reach decision-makers directly, increasing your response rate by 300%.",
      category: "HR Directory"
    },
    {
      question: "What are the best cold email templates for job applications in India?",
      answer: "HireLift's Cold Email Playground offers 50+ proven templates specifically designed for the Indian job market. These include job inquiry emails, follow-up sequences, networking messages, and LinkedIn DM templates. Our templates have a 75% average response rate and are customized for different industries, experience levels, and job roles popular in India.",
      category: "Cold Email"
    },
    {
      question: "How effective is HireLift compared to traditional job portals like Naukri?",
      answer: "HireLift users get hired 3x faster than traditional job portal users. While job portals have low response rates (2-5%), HireLift's direct approach through optimized resumes and HR outreach achieves 15-25% response rates. Our users report getting interview calls within 2-3 weeks compared to 2-3 months on traditional portals.",
      category: "Effectiveness"
    },
    {
      question: "Is HireLift suitable for freshers and experienced professionals?",
      answer: "Yes! HireLift works for all experience levels. For freshers, we provide entry-level resume templates, internship application emails, and contacts for companies actively hiring freshers. For experienced professionals, we offer senior-level templates, salary negotiation guides, and connections with senior HR managers and hiring directors.",
      category: "Experience Levels"
    },
    {
      question: "Which Indian cities and industries does HireLift cover?",
      answer: "HireLift covers all major Indian cities including Mumbai, Delhi NCR, Bangalore, Chennai, Hyderabad, Pune, Kolkata, and 20+ other cities. We support all industries including IT, Finance, Healthcare, Manufacturing, Consulting, E-commerce, Startups, and Government sectors. Our HR directory includes companies from Fortune 500 to emerging startups.",
      category: "Coverage"
    },
    {
      question: "How much does HireLift cost and what's included in each plan?",
      answer: "HireLift offers a free plan with 1 ATS resume audit and basic email templates. Our Pro plan costs ₹99/month (50% off launch price) and includes unlimited resume audits, complete HR directory access, premium email templates, priority support, and advanced job search tools. ROI is guaranteed - most users get job offers worth 10-50x the subscription cost.",
      category: "Pricing"
    },
    {
      question: "How quickly can I see results with HireLift?",
      answer: "Most HireLift users see results within 1-2 weeks. The ATS optimization shows immediate improvement in your resume score. Cold email outreach typically generates responses within 3-5 days. On average, our users report getting 2-5 interview calls in their first month, compared to 0-1 calls from traditional job applications.",
      category: "Results Timeline"
    },
    {
      question: "Is my personal data safe with HireLift?",
      answer: "Absolutely! HireLift follows strict data protection protocols. Your resume data is encrypted and never shared with third parties. We're compliant with Indian data protection laws and use enterprise-grade security. Your personal information and job search activities remain completely confidential.",
      category: "Privacy & Security"
    },
  ];

  return (
    <section className="py-20 px-6 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-full mb-6">
            <FaQuestionCircle className="w-4 h-4 text-blue-600" />
            <span className="text-blue-700 font-semibold">Frequently Asked Questions</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
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
              className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
            >
              <button
                onClick={() => handleToggle(index)}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {faq.question}
                  </h3>
                  <span className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    {faq.category}
                  </span>
                </div>
                <div className="ml-4">
                  {openIndex === index ? (
                    <FaChevronUp className="w-5 h-5 text-blue-600" />
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
            <button className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors">
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
