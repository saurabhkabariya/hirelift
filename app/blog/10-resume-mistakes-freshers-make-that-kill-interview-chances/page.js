'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaClock, FaUser, FaShare, FaBookmark, FaArrowLeft, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';
import RelatedArticles from '@/components/RelatedArticles';

export default function ResumeMistakesFreshers() {

  const toc = [
    { id: "why-interviews-missed", title: "Why Freshers Miss Interview Opportunities" },
    { id: "resume-mistakes", title: "10 Resume Mistakes Freshers Make" },
    { id: "how-to-fix", title: "How to Fix These Resume Mistakes" },
    { id: "final-checklist", title: "Resume Improvement Checklist" }
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
              Resume Optimization
            </span>
            <span className="text-gray-500">Freshers Job Search</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            10 Resume Mistakes Freshers Make That Kill Interview Chances
          </h1>

          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Many fresh graduates apply to hundreds of jobs but never receive interview calls. Often the issue isn't lack of skills — it's common resume mistakes that prevent recruiters and ATS systems from noticing your application.
          </p>

          <div className="flex items-center justify-between flex-wrap gap-4 p-6 bg-white rounded-xl border">

            <div className="flex items-center gap-6 text-sm text-gray-600">
              <span className="flex items-center gap-2"><FaUser className="w-4 h-4" />HireLift Career Experts</span>
              <span className="flex items-center gap-2"><FaClock className="w-4 h-4" />9 min read</span>
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


        {/* TABLE OF CONTENTS */}

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

          <section id="why-interviews-missed" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Why Freshers Miss Interview Opportunities
            </h2>

            <p className="text-gray-700 mb-6">
              Fresh graduates often believe that sending more job applications will eventually lead to interviews.
              However, most job seekers repeat the same mistakes that prevent their resumes from getting noticed.
            </p>

            <p className="text-gray-700">
              Recruiters today rely heavily on ATS systems and structured hiring processes. If your resume is not optimized
              properly, it can be rejected automatically before anyone reviews it.
            </p>

          </section>


          {/* SECTION 2 */}

          <section id="resume-mistakes" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              10 Resume Mistakes Freshers Make
            </h2>

            <div className="space-y-4">

              <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg">
                <h3 className="font-bold text-red-900">1. Ignoring Important Keywords</h3>
                <p>Many resumes fail ATS screening because they don't include keywords mentioned in the job description.</p>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r-lg">
                <h3 className="font-bold text-yellow-900">2. Applying with Low ATS Score</h3>
                <p>Applying with resumes scoring below 85 in ATS checks reduces your chances of getting shortlisted.</p>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
                <h3 className="font-bold text-blue-900">3. Not Optimizing Resume for Each Job</h3>
                <p>Using the same resume for every job application reduces relevance and lowers ATS ranking.</p>
              </div>

              <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-r-lg">
                <h3 className="font-bold text-purple-900">4. Designing Resume Only for Recruiters</h3>
                <p>Many candidates design resumes for humans but forget ATS systems scan them first.</p>
              </div>

              <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg">
                <h3 className="font-bold text-green-900">5. Not Reaching Out to Recruiters Directly</h3>
                <p>Cold emailing or messaging recruiters can significantly increase your chances of getting noticed.</p>
              </div>

              <div className="bg-indigo-50 border-l-4 border-indigo-500 p-6 rounded-r-lg">
                <h3 className="font-bold text-indigo-900">6. Doing Everything Manually</h3>
                <p>Tools like HireLift can help analyze resumes faster and save time when applying to multiple jobs.</p>
              </div>

              <div className="bg-pink-50 border-l-4 border-pink-500 p-6 rounded-r-lg">
                <h3 className="font-bold text-pink-900">7. Not Showcasing Skills Through Projects</h3>
                <p>Projects help demonstrate real abilities instead of just listing skills.</p>
              </div>

              <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-r-lg">
                <h3 className="font-bold text-orange-900">8. Building Only Tutorial Projects</h3>
                <p>Recruiters prefer projects solving real-world problems instead of basic tutorials.</p>
              </div>

              <div className="bg-gray-100 border-l-4 border-gray-600 p-6 rounded-r-lg">
                <h3 className="font-bold text-gray-900">9. Applying to Fake Job Posts</h3>
                <p>Some LinkedIn job posts are created just for engagement rather than real hiring.</p>
              </div>

              <div className="bg-teal-50 border-l-4 border-teal-500 p-6 rounded-r-lg">
                <h3 className="font-bold text-teal-900">10. Applying After Hundreds of Candidates</h3>
                <p>Many companies stop reviewing applications after the first 100 candidates.</p>
              </div>

            </div>

          </section>


          {/* SECTION 3 */}

          <section id="final-checklist" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Resume Improvement Checklist
            </h2>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">

              <ul className="space-y-2 text-gray-700">

                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Match resume keywords with job description</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Ensure ATS compatibility</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Showcase real-world projects</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Apply early to job posts</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Reach out to recruiters directly</li>

              </ul>

            </div>


            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl p-8 mt-8">

              <h3 className="text-2xl font-bold mb-4">
                Optimize Your Resume Faster
              </h3>

              <p className="text-lg mb-6">
                Instead of manually analyzing job descriptions, use HireLift to check your resume ATS score,
                identify missing keywords, and improve your chances of getting interview calls.
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
        currentSlug="resume-mistakes-freshers-make-kill-interview-chances"
        category="Resume Optimization"
      />

    </div>
  );
}