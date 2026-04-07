'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaClock, FaUser, FaShare, FaBookmark, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import RelatedArticles from '@/components/RelatedArticles';

export default function NoInterviewsAfter100Applications() {

  const toc = [
    { id: "why-no-interviews", title: "Why You May Not Be Getting Interviews" },
    { id: "low-ats-score", title: "Low ATS Resume Score" },
    { id: "same-resume", title: "Applying Everywhere With the Same Resume" },
    { id: "irrelevant-skills", title: "Irrelevant Skills on Resume" },
    { id: "late-applications", title: "Applying Too Late to Job Posts" },
    { id: "optimization-tools", title: "Not Using Resume Optimization Tools" },
    { id: "job-search-checklist", title: "Job Search Improvement Checklist" }
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
            Applied to 100 Jobs but No Interviews? Here’s Why
          </h1>

          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Many job seekers apply to dozens or even hundreds of jobs but never receive interview calls. In most cases,
            the problem is not lack of effort but mistakes in resume optimization and job application strategy.
          </p>

          <div className="flex items-center justify-between flex-wrap gap-4 p-6 bg-white rounded-xl border">

            <div className="flex items-center gap-6 text-sm text-gray-600">
              <span className="flex items-center gap-2"><FaUser className="w-4 h-4" />HireLift Career Experts</span>
              <span className="flex items-center gap-2"><FaClock className="w-4 h-4" />8 min read</span>
              <span>Dec 2025</span>
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


          <section id="why-no-interviews" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Why You May Not Be Getting Interviews
            </h2>

            <p className="text-gray-700 mb-6">
              If you've applied to many jobs but haven't received interviews, it doesn't necessarily mean you're unqualified.
              Often the issue lies in how your resume is optimized and how you're applying for jobs.
            </p>

          </section>


          <section id="low-ats-score" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Low ATS Resume Score
            </h2>

            <p className="text-gray-700">
              Many companies use Applicant Tracking Systems to filter resumes. If your resume has a low ATS score,
              it may be rejected automatically before recruiters even see it.
            </p>

          </section>


          <section id="same-resume" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Applying Everywhere With the Same Resume
            </h2>

            <p className="text-gray-700">
              Each job description contains different requirements. Sending the same resume to every job reduces your chances
              of matching the keywords and skills that recruiters are looking for.
            </p>

          </section>


          <section id="irrelevant-skills" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Irrelevant Skills on Resume
            </h2>

            <p className="text-gray-700">
              Listing too many unrelated skills can confuse recruiters and ATS systems. Instead, focus on skills that are
              directly relevant to the job description.
            </p>

          </section>


          <section id="late-applications" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Applying Too Late to Job Posts
            </h2>

            <p className="text-gray-700">
              Many recruiters stop reviewing applications after receiving the first 100 candidates. Applying early increases
              your chances of being considered.
            </p>

          </section>


          <section id="optimization-tools" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Not Using Resume Optimization Tools
            </h2>

            <p className="text-gray-700">
              Optimizing resumes manually for every job can be time-consuming. Tools like HireLift can help identify missing
              keywords, improve ATS compatibility, and streamline the job application process.
            </p>

          </section>


          <section id="job-search-checklist" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Job Search Improvement Checklist
            </h2>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">

              <ul className="space-y-2 text-gray-700">

                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Improve ATS resume score</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Tailor resume for each job</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Highlight relevant skills</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Apply early to job postings</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Use resume optimization tools</li>

              </ul>

            </div>


            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl p-8 mt-8">

              <h3 className="text-2xl font-bold mb-4">
                Improve Your Resume Strategy
              </h3>

              <p className="text-lg mb-6">
                Upload your resume to HireLift to analyze ATS compatibility, find missing keywords,
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
        currentSlug="applied-to-100-jobs-no-interviews-why"
        category="Job Search Strategy"
      />

    </div>
  );
}