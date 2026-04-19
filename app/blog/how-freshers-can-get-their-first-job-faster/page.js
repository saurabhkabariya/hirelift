'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaClock, FaUser, FaShare, FaBookmark, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import RelatedArticles from '@/components/RelatedArticles';

export default function FirstJobForFreshers() {

  const toc = [
    { id: "why-first-job-hard", title: "Why Getting the First Job Is Hard for Freshers" },
    { id: "build-relevant-skills", title: "Build Skills and Relevant Projects" },
    { id: "optimize-resume", title: "Optimize Your Resume for Job Descriptions" },
    { id: "apply-smart", title: "Apply Smart Instead of Applying Everywhere" },
    { id: "network-outreach", title: "Network and Reach Out to Recruiters" },
    { id: "tools", title: "Use Tools to Improve Interview Chances" },
    { id: "checklist", title: "Checklist to Get Your First Job Faster" }
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
              Career Advice
            </span>
            <span className="text-gray-500">Freshers</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            How Freshers Can Get Their First Job Faster
          </h1>

          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Many fresh graduates struggle to get interview calls despite applying to many jobs.
            Understanding the right strategy can significantly increase your chances of landing your first job faster.
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


          <section id="why-first-job-hard" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Why Getting the First Job Is Hard for Freshers
            </h2>

            <p className="text-gray-700">
              Many companies prefer candidates with experience, which makes the first job challenging for fresh graduates. However, focusing on the right strategy can significantly improve your chances.
            </p>

          </section>


          <section id="build-relevant-skills" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Build Skills and Relevant Projects
            </h2>

            <p className="text-gray-700">
              Projects that demonstrate real-world problem solving help recruiters understand your practical abilities. Highlight projects that show how you used technologies to build solutions.
            </p>

          </section>


          <section id="optimize-resume" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Optimize Your Resume for Job Descriptions
            </h2>

            <p className="text-gray-700">
              Recruiters often use Applicant Tracking Systems (ATS) to filter resumes. Optimizing your resume with relevant keywords from job descriptions improves the chances of passing these filters.
            </p>

          </section>


          <section id="apply-smart" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Apply Smart Instead of Applying Everywhere
            </h2>

            <p className="text-gray-700">
              Instead of applying randomly, focus on roles that match your skills and apply early when the number of applicants is still low.
            </p>

          </section>


          <section id="network-outreach" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Network and Reach Out to Recruiters
            </h2>

            <p className="text-gray-700">
              Connecting with recruiters through LinkedIn, email, or professional networks can increase your chances of getting noticed.
            </p>

          </section>


          <section id="tools" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Use Tools to Improve Interview Chances
            </h2>

            <p className="text-gray-700">
              Tools like HireLift can help analyze resumes, identify missing keywords, and optimize your resume to increase interview chances.
            </p>

          </section>


          <section id="checklist" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Checklist to Get Your First Job Faster
            </h2>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">

              <ul className="space-y-2 text-gray-700">

                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Build projects that demonstrate skills</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Optimize your resume for ATS</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Apply early to job postings</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Reach out to recruiters</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Continuously improve your skills</li>

              </ul>

            </div>


            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl p-8 mt-8">

              <h3 className="text-2xl font-bold mb-4">
                Increase Your Interview Chances
              </h3>

              <p className="text-lg mb-6">
                Upload your resume to HireLift to analyze ATS compatibility, identify missing keywords, and improve your chances of getting interview calls.
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
        currentSlug="how-freshers-can-get-their-first-job-faster"
        category="Career Advice"
      />

    </div>
  );
}