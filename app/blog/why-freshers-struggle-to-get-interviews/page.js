'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaClock, FaUser, FaShare, FaBookmark, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import RelatedArticles from '@/components/RelatedArticles';

export default function WhyFreshersStruggleInterviews() {

  const toc = [
    { id: "why-interviews-hard", title: "Why Freshers Often Struggle to Get Interviews" },
    { id: "ats-format", title: "Non ATS Friendly Resume Format" },
    { id: "lack-experience", title: "Lack of Experience in Resume" },
    { id: "resume-optimization", title: "Resume Not Optimized for Job Descriptions" },
    { id: "job-strategy", title: "Ineffective Job Application Strategy" },
    { id: "tools", title: "Use Tools to Improve Interview Chances" },
    { id: "checklist", title: "Checklist to Improve Interview Chances" }
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
              Career Advice
            </span>
            <span className="text-gray-500">Freshers</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Why Freshers Struggle to Get Interviews
          </h1>

          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Many fresh graduates apply to multiple job openings but rarely receive interview calls.
            Understanding the common reasons behind this problem can help improve your job search results.
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

          <section id="why-interviews-hard" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Why Freshers Often Struggle to Get Interviews
            </h2>

            <p className="text-gray-700">
              Recruiters often receive hundreds of applications for entry-level positions.
              If your resume is not optimized properly or does not clearly demonstrate your skills,
              it may get filtered before reaching human recruiters.
            </p>

          </section>


          <section id="ats-format" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Non ATS Friendly Resume Format
            </h2>

            <p className="text-gray-700">
              Many resumes fail ATS screening because of complex layouts, images, or unsupported formats.
              Using a clean ATS-friendly format ensures that your resume can be properly read by automated systems.
            </p>

          </section>


          <section id="lack-experience" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Lack of Experience in Resume
            </h2>

            <p className="text-gray-700">
              Fresh graduates often worry about having no experience. However, projects, internships,
              and skill demonstrations can effectively showcase your abilities.
            </p>

          </section>


          <section id="resume-optimization" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Resume Not Optimized for Job Descriptions
            </h2>

            <p className="text-gray-700">
              Sending the same resume to every company can reduce your chances of getting shortlisted.
              Tailoring your resume with relevant keywords from job descriptions increases your chances
              of passing ATS filters.
            </p>

          </section>


          <section id="job-strategy" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Ineffective Job Application Strategy
            </h2>

            <p className="text-gray-700">
              Applying randomly to hundreds of jobs often leads to poor results.
              A structured strategy that includes early applications and recruiter outreach
              can improve your chances significantly.
            </p>

          </section>


          <section id="tools" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Use Tools to Improve Interview Chances
            </h2>

            <p className="text-gray-700">
              Tools like HireLift can help fresh graduates optimize resumes for ATS systems,
              tailor resumes for specific job descriptions, apply to fresh job opportunities,
              and reach out directly to recruiters using outreach templates.
            </p>

          </section>


          <section id="checklist" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Checklist to Improve Interview Chances
            </h2>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">

              <ul className="space-y-2 text-gray-700">

                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Use ATS-friendly resume format</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Highlight projects and skills</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Tailor resume for job descriptions</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Apply early to job postings</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Reach out to recruiters directly</li>

              </ul>

            </div>

            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl p-8 mt-8">

              <h3 className="text-2xl font-bold mb-4">
                Improve Your Interview Chances
              </h3>

              <p className="text-lg mb-6">
                Upload your resume to HireLift to optimize it for ATS, tailor it for job descriptions,
                discover fresh job opportunities, and connect with recruiters more efficiently.
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
        currentSlug="why-freshers-struggle-to-get-interviews"
        category="Career Advice"
      />

    </div>
  );
}