'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaHome, FaSearch, FaFileAlt, FaEnvelope, FaArrowRight } from 'react-icons/fa';

export default function NotFound() {
  const suggestions = [
    {
      icon: FaHome,
      title: "Go to Homepage",
      description: "Start your job search journey from our main page",
      link: "/",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: FaFileAlt,
      title: "Free Resume Review",
      description: "Get instant ATS analysis of your resume",
      link: "/audit",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: FaEnvelope,
      title: "Email Templates",
      description: "Browse 50+ proven cold email templates",
      link: "/playground",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: FaSearch,
      title: "HR Directory",
      description: "Find direct contacts of hiring managers",
      link: "/company-search",
      color: "from-orange-500 to-red-500"
    }
  ];

  const popularSearches = [
    "ATS resume checker",
    "Cold email templates",
    "HR contacts Mumbai",
    "Job search tips",
    "Resume optimization",
    "Interview preparation",
    "LinkedIn outreach",
    "Salary negotiation"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-6">
      <div className="max-w-4xl mx-auto text-center">
        {/* Error Message */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="text-8xl font-bold text-gray-400 dark:text-gray-600 mb-6">404</div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Oops! Page Not Found
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Don't worry! Let's get you back on track to land your dream job in India.
          </p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {suggestions.map((suggestion, index) => (
            <Link
              key={suggestion.title}
              href={suggestion.link}
              className="group"
            >
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105"
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${suggestion.color} flex items-center justify-center mb-4 mx-auto`}>
                  <suggestion.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">{suggestion.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{suggestion.description}</p>
                <div className="flex items-center justify-center text-blue-600 group-hover:text-blue-700">
                  <span className="text-sm font-medium">Get Started</span>
                  <FaArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>

        {/* Popular Searches */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Popular Job Search Resources
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {popularSearches.map((search, index) => (
              <motion.span
                key={search}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + (index * 0.1) }}
                className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-100 cursor-pointer transition-colors"
              >
                {search}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Support Message */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 p-6 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl text-white"
        >
          <h3 className="text-xl font-bold mb-2">Need Help Finding Something?</h3>
          <p className="mb-4">
            Our career experts are here to help you navigate your job search in India
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/blog"
              className="px-6 py-3 bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Browse Job Search Guides
            </Link>
            <button className="px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Contact Support
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
