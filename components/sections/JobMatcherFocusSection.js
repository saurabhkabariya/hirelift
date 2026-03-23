'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function JobMatcherFocusSection() {
  return (
    <section id="job-matcher-focus" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-14"
        >
          <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs sm:text-sm font-semibold mb-4">
            Most Important Feature
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4">
            Resume-Job Match: Know Your Real Chances Before You Apply
          </h2>
          <p className="text-gray-300 text-base sm:text-lg max-w-3xl mx-auto">
            Generic resume tips are not enough. Every job description is different, and one mismatch can block your application before a recruiter even sees it.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-10 sm:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl p-6 sm:p-8 bg-white/5 border border-white/10"
          >
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">Why You Need It</h3>
            <ul className="space-y-2 text-gray-300">
              <li>• ATS systems rank your resume against each job’s keywords.</li>
              <li>• Small gaps in skills or phrasing reduce interview chances.</li>
              <li>• Applying blindly wastes time and lowers confidence.</li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl p-6 sm:p-8 bg-white/5 border border-white/10"
          >
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">How It Helps You</h3>
            <ul className="space-y-2 text-gray-300">
              <li>• Get a clear match score for any role instantly.</li>
              <li>• Identify missing skills, keywords, and weak sections.</li>
              <li>• Receive AI suggestions to improve your resume for that job.</li>
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex flex-col items-center justify-center gap-4"
        >
          <Link
            href="/job-matcher"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-gray-900 font-bold text-base sm:text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Start Resume - Job Match
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <p className="text-sm text-gray-400 text-center">
            Direct access to Job Matcher • Try it free
          </p>
        </motion.div>
      </div>
    </section>
  );
}
