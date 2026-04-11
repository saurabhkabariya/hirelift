'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaClock, FaUser, FaShare, FaBookmark, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import RelatedArticles from '@/components/RelatedArticles';

export default function FresherJobApplicationStrategy() {

  const toc = [
    { id: "why-strategy-matters", title: "Why Freshers Need a Job Application Strategy" },
    { id: "keywords-projects", title: "Mention Relevant Keywords and Projects" },
    { id: "ats-format", title: "Use ATS Friendly Resume Format" },
    { id: "low-competition-jobs", title: "Apply to Low Competition Job Posts" },
    { id: "optimization-tools", title: "Use Tools for Resume Optimization" },
    { id: "strategy-checklist", title: "Fresher Job Application Checklist" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">

      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link href="/blog" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
            <FaArrowLeft className="w-4 h-4" />Back to Blog
          </Link>
        </div>
      </nav>

      <article className="max-w-4xl mx-auto px-6 py-12">

        <motion.header initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-12">

          <div className="flex items-center gap-3 mb-6">
            <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
              Job Search Strategy
            </span>
            <span className="text-gray-500">Freshers Guide</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Job Application Strategy That Works for Freshers
          </h1>

          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Many fresh graduates apply to dozens of jobs but rarely receive interview calls. Often the issue is not skills but the strategy used while applying for jobs.
          </p>

          <div className="flex items-center justify-between flex-wrap gap-4 p-6 bg-white rounded-xl border">

            <div className="flex items-center gap-6 text-sm text-gray-600">
              <span className="flex items-center gap-2"><FaUser className="w-4 h-4" />HireLift Career Experts</span>
              <span className="flex items-center gap-2"><FaClock className="w-4 h-4" />7 min read</span>
              <span>Jan 2026</span>
            </div>

            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <FaShare className="w-4 h-4" />Share
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
                <FaBookmark className="w-4 h-4" />Save
              </button>
            </div>

          </div>

        </motion.header>


        {/* Table of Contents */}

        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12 p-6 bg-blue-50 rounded-xl border border-blue-100">

          <h2 className="text-xl font-bold text-gray-900 mb-4">Table of Contents</h2>

          <ul className="space-y-2">
            {toc.map((item, index) => (
              <li key={item.id}>
                <a href={`#${item.id}`} className="text-blue-600 hover:text-blue-700 hover:underline">
                  {index + 1}. {item.title}
                </a>
              </li>
            ))}
          </ul>

        </motion.div>


        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="prose prose-lg max-w-none">


          <section id="why-strategy-matters" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Why Freshers Need a Job Application Strategy
            </h2>

            <p className="text-gray-700">
              Applying randomly to many jobs rarely works. Recruiters receive hundreds of applications for each job posting, so having a structured strategy improves your chances significantly.
            </p>

          </section>


          <section id="keywords-projects" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Mention Relevant Keywords and Projects
            </h2>

            <p className="text-gray-700 mb-6">
              Carefully analyze the job description and identify the most important skills mentioned. Include these keywords naturally in your resume.
            </p>

            <p className="text-gray-700">
              If you are a fresher, your projects become very important. Highlight projects that demonstrate your ability to solve real problems and apply relevant technologies.
            </p>

          </section>


          <section id="ats-format" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Use ATS Friendly Resume Format
            </h2>

            <p className="text-gray-700">
              Most companies use Applicant Tracking Systems to filter resumes. Using a clean and ATS-friendly resume format ensures your resume is parsed correctly by these systems.
            </p>

          </section>


          <section id="low-competition-jobs" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Apply to Job Posts With Fewer Applicants
            </h2>

            <p className="text-gray-700">
              Applying to recently posted jobs or opportunities with fewer than 100 applicants increases the probability that recruiters will review your resume.
            </p>

          </section>


          <section id="optimization-tools" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Use Tools for Resume Optimization
            </h2>

            <p className="text-gray-700">
              Optimizing resumes manually for every job can take time. Tools like HireLift can analyze resumes, identify missing keywords, and improve ATS compatibility quickly.
            </p>

          </section>


          <section id="strategy-checklist" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Fresher Job Application Checklist
            </h2>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">

              <ul className="space-y-2 text-gray-700">

                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Use keywords from job descriptions</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Highlight relevant projects</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Use ATS friendly resume format</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Apply to low competition job posts</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Optimize resumes using tools</li>

              </ul>

            </div>


            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl p-8 mt-8">

              <h3 className="text-2xl font-bold mb-4">
                Optimize Your Resume Strategy
              </h3>

              <p className="text-lg mb-6">
                Upload your resume to HireLift to analyze ATS compatibility, identify missing keywords,
                and improve your chances of getting interview calls.
              </p>

              <div className="flex gap-4">

                <Link href="/audit" className="inline-block px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-50">
                  Analyze Resume →
                </Link>

                <Link href="/company-search" className="inline-block px-8 py-3 bg-white/10 backdrop-blur text-white font-bold rounded-lg hover:bg-white/20 border border-white/30">
                  Find Hiring Companies →
                </Link>

              </div>

            </div>

          </section>

        </motion.div>

      </article>

      <RelatedArticles
        currentSlug="job-application-strategy-for-freshers"
        category="Job Search Strategy"
      />

    </div>
  );
}