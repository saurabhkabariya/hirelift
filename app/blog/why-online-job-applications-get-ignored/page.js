'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaClock, FaUser, FaShare, FaBookmark, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import RelatedArticles from '@/components/RelatedArticles';

export default function WhyApplicationsIgnored() {

  const toc = [
    { id: "why-applications-ignored", title: "Why Online Applications Often Get Ignored" },
    { id: "ats-filtering", title: "ATS Filters Before Recruiters" },
    { id: "high-competition", title: "Thousands of Other Applicants" },
    { id: "same-resume", title: "Mass Applying With the Same Resume" },
    { id: "optimization-tools", title: "Not Optimizing Resume Properly" },
    { id: "job-search-checklist", title: "How to Improve Your Applications" }
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
            <span className="bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-semibold">
              Job Search Strategy
            </span>
            <span className="text-gray-500">Career Advice</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Why Online Job Applications Get Ignored
          </h1>

          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Many job seekers apply to dozens of online job postings but rarely receive responses.
            Understanding how hiring systems work can help explain why many applications go unnoticed.
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


          <section id="why-applications-ignored" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Why Online Applications Often Get Ignored
            </h2>

            <p className="text-gray-700 mb-6">
              Online job portals make it easy to apply for many roles quickly. However,
              this also means recruiters receive a massive number of applications for each job posting.
            </p>

            <p className="text-gray-700">
              Because of this competition and automated filtering systems,
              many applications never get reviewed by recruiters.
            </p>

          </section>


          <section id="ats-filtering" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              ATS Filters Before Recruiters
            </h2>

            <p className="text-gray-700">
              Most companies use Applicant Tracking Systems (ATS) to filter resumes before recruiters see them.
              If your resume doesn't match important keywords or formatting rules, it may get rejected automatically.
            </p>

          </section>


          <section id="high-competition" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Thousands of Other Applicants
            </h2>

            <p className="text-gray-700">
              Popular job postings often receive hundreds or even thousands of applications.
              Recruiters usually review only a small percentage of these applications.
            </p>

          </section>


          <section id="same-resume" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Mass Applying With the Same Resume
            </h2>

            <p className="text-gray-700">
              Sending the same resume to every job posting reduces your chances of matching the skills and keywords recruiters expect.
              Customizing your resume for each job can significantly improve your chances.
            </p>

          </section>


          <section id="optimization-tools" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Not Optimizing Your Resume Properly
            </h2>

            <p className="text-gray-700">
              Resume optimization is important for passing ATS filters and improving recruiter visibility.
              Tools like HireLift can help analyze resumes, identify missing keywords, and improve ATS compatibility.
            </p>

          </section>


          <section id="job-search-checklist" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              How to Improve Your Job Applications
            </h2>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">

              <ul className="space-y-2 text-gray-700">

                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Optimize resume for ATS systems</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Customize resume for each job</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Focus on relevant job postings</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Apply early to new job listings</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Use tools to optimize resumes faster</li>

              </ul>

            </div>


            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl p-8 mt-8">

              <h3 className="text-2xl font-bold mb-4">
                Optimize Your Resume Faster
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
        currentSlug="why-online-job-applications-get-ignored"
        category="Job Search Strategy"
      />

    </div>
  );
}