'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaClock, FaUser, FaShare, FaBookmark, FaArrowLeft, FaFileAlt, FaSearch, FaCheckCircle } from 'react-icons/fa';
import RelatedArticles from '@/components/RelatedArticles';

export default function ResumeRejectedIn6Seconds() {

  const toc = [
    { id: "why-resumes-rejected", title: "Why Recruiters Reject Resumes in Seconds" },
    { id: "ats-explained", title: "What is an ATS and How It Works" },
    { id: "use-ats-benefit", title: "How to Use ATS to Your Advantage" },
    { id: "resume-mistakes", title: "Common Resume Mistakes" },
    { id: "resume-checklist", title: "Resume Optimization Checklist" }
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
            <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
              Resume Optimization
            </span>
            <span className="text-gray-500">Job Search Strategy</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Why Your Resume Gets Rejected in 6 Seconds (And How to Fix It)
          </h1>

          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Most job seekers think recruiters carefully read every resume. In reality, most resumes are filtered by ATS software before a recruiter even sees them. Learn why resumes get rejected quickly and how to optimize yours to increase interview chances.
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


          {/* SECTION 1 */}

          <section id="why-resumes-rejected" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Why Recruiters Reject Resumes in Seconds
            </h2>

            <p className="text-gray-700 mb-6">
              Every job posting today can receive hundreds of applications. Recruiters simply do not have time to manually read every resume.
              Instead, companies use automated tools to filter resumes before a human ever reviews them.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-6">

              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6 text-center">
                <FaClock className="w-10 h-10 mx-auto mb-3" />
                <h3 className="font-bold text-3xl mb-2">6 sec</h3>
                <p className="text-blue-100">Average recruiter scan time</p>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-6 text-center">
                <FaSearch className="w-10 h-10 mx-auto mb-3" />
                <h3 className="font-bold text-3xl mb-2">75%</h3>
                <p className="text-purple-100">Resumes rejected by ATS</p>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-6 text-center">
                <FaFileAlt className="w-10 h-10 mx-auto mb-3" />
                <h3 className="font-bold text-3xl mb-2">250+</h3>
                <p className="text-green-100">Applicants per job posting</p>
              </div>

            </div>

            <p className="text-gray-700">
              If your resume doesn't match what the system is looking for, it may be rejected instantly — even if you're qualified.
            </p>

          </section>


          {/* SECTION 2 */}

          <section id="ats-explained" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              What is an ATS and How It Works
            </h2>

            <p className="text-gray-700 mb-6">
              An Applicant Tracking System (ATS) is software companies use to manage and filter job applications automatically.
              Instead of manually reviewing every resume, recruiters rely on ATS tools to shortlist candidates.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">

              <h3 className="font-bold text-blue-900 mb-3">
                What ATS systems typically analyze:
              </h3>

              <ul className="space-y-2 text-gray-700">
                <li>• Keywords that match the job description</li>
                <li>• Relevant skills and technologies</li>
                <li>• Experience related to the role</li>
                <li>• Resume structure and readability</li>
              </ul>

            </div>

          </section>


          {/* SECTION 3 */}

          <section id="use-ats-benefit" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              How to Use ATS to Your Advantage
            </h2>

            <p className="text-gray-700 mb-6">
              ATS systems are not designed to reject good candidates - they simply try to find resumes that best match the job description.
              By aligning your resume with the job requirements, you can significantly increase your chances of passing ATS filters.
            </p>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">

              <h3 className="font-bold text-green-900 mb-4">
                How to optimize your resume for ATS
              </h3>

              <ul className="space-y-2 text-gray-700">
                <li>• Analyze keywords from the job description</li>
                <li>• Add relevant technologies and tools</li>
                <li>• Use simple formatting</li>
                <li>• Highlight measurable achievements</li>
              </ul>

            </div>

          </section>


          {/* SECTION 4 */}

          <section id="resume-mistakes" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Common Resume Mistakes That Cause Rejection
            </h2>

            <div className="space-y-4">

              <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg">
                <h3 className="font-bold text-red-900 mb-2">Using the Same Resume for Every Job</h3>
                <p className="text-gray-700">
                  Every job description is different. Using the same resume for all applications reduces your chances of matching ATS filters.
                </p>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r-lg">
                <h3 className="font-bold text-yellow-900 mb-2">Missing Important Keywords</h3>
                <p className="text-gray-700">
                  If your resume does not include keywords from the job description, the ATS may assume you lack the required skills.
                </p>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
                <h3 className="font-bold text-blue-900 mb-2">Complex Resume Formatting</h3>
                <p className="text-gray-700">
                  Graphics, tables, icons, and fancy layouts can confuse ATS systems and cause your resume to be misread.
                </p>
              </div>

            </div>

          </section>


          {/* SECTION 5 */}

          <section id="resume-checklist" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Resume Optimization Checklist
            </h2>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">

              <ul className="space-y-2 text-gray-700">

                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600" /> Match keywords from job description</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600" /> Highlight relevant skills and technologies</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600" /> Use measurable achievements</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600" /> Keep resume formatting simple</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600" /> Customize resume for each job</li>

              </ul>

            </div>

            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl p-8 mt-8">

              <h3 className="text-2xl font-bold mb-4">
                Improve Your Resume Instantly
              </h3>

              <p className="text-lg mb-6">
                Upload your resume and let HireLift analyze it for ATS compatibility,
                missing keywords, and optimization improvements.
              </p>

              <div className="flex gap-4">

                <Link
                  href="/audit"
                  className="inline-block px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-50">
                  Analyze Resume →
                </Link>

                <Link
                  href="/company-search"
                  className="inline-block px-8 py-3 bg-white/10 backdrop-blur text-white font-bold rounded-lg hover:bg-white/20 border border-white/30">
                  Find Hiring Companies →
                </Link>

              </div>

            </div>

          </section>

        </motion.div>


        {/* AUTHOR */}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 p-8 bg-white rounded-xl border">

          <div className="flex items-start gap-6">

            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <FaFileAlt className="w-8 h-8 text-blue-600" />
            </div>

            <div>

              <h3 className="text-xl font-bold text-gray-900 mb-2">
                HireLift Career Experts
              </h3>

              <p className="text-gray-600 mb-4">
                We help job seekers improve resumes, connect with recruiters,
                and increase interview chances through smarter job search strategies.
              </p>

              <div className="flex gap-4">
                <Link href="/blog" className="text-blue-600 hover:underline">More Career Guides</Link>
                <Link href="/pricing" className="text-green-600 hover:underline">HireLift Tools</Link>
              </div>

            </div>

          </div>

        </motion.div>

      </article>

      <RelatedArticles
        currentSlug="why-resume-gets-rejected-in-6-seconds"
        category="Resume Optimization"
      />

    </div>
  );
}