'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaClock, FaUser, FaShare, FaBookmark, FaArrowLeft, FaSearch, FaFileAlt, FaCheckCircle } from 'react-icons/fa';
import RelatedArticles from '@/components/RelatedArticles';

export default function TailorResumeToJobDescription() {

  const toc = [
    { id: "why-tailor-resume", title: "Why Tailoring Your Resume Matters" },
    { id: "analyze-job-description", title: "How to Analyze a Job Description" },
    { id: "identify-keywords", title: "How to Identify Important Keywords" },
    { id: "prioritize-keywords", title: "Prioritizing Keywords in Your Resume" },
    { id: "resume-checklist", title: "Resume Tailoring Checklist" }
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
            How to Tailor Your Resume to a Job Description (Step-by-Step)
          </h1>

          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Sending the same resume to every job rarely works. Learn how to analyze job descriptions, identify important keywords, and tailor your resume so it matches what recruiters and ATS systems are looking for.
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


          <section id="why-tailor-resume" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Why Tailoring Your Resume Matters
            </h2>

            <p className="text-gray-700 mb-6">
              Many job seekers apply to dozens of jobs using the same resume. Unfortunately, this strategy rarely works.
              Recruiters and ATS systems expect your resume to match the specific requirements mentioned in the job description.
            </p>

            <p className="text-gray-700">
              When your resume clearly reflects the skills and experience required for the role, it significantly increases
              your chances of passing ATS filters and getting shortlisted by recruiters.
            </p>

          </section>


          <section id="analyze-job-description" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              How to Analyze a Job Description
            </h2>

            <p className="text-gray-700 mb-6">
              The first step to tailoring your resume is carefully reading the job description.
              Most job descriptions contain important clues about what recruiters are looking for.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">

              <h3 className="font-bold text-blue-900 mb-3">
                Key areas to focus on:
              </h3>

              <ul className="space-y-2 text-gray-700">
                <li>• Required technical skills</li>
                <li>• Tools and technologies mentioned</li>
                <li>• Experience level expectations</li>
                <li>• Key responsibilities</li>
              </ul>

            </div>

          </section>


          <section id="identify-keywords" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              How to Identify Important Keywords
            </h2>

            <p className="text-gray-700 mb-6">
              Keywords are specific skills, technologies, and responsibilities mentioned in the job description.
              ATS systems often use these keywords to determine whether your resume matches the role.
            </p>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">

              <h3 className="font-bold text-green-900 mb-4">
                Examples of keywords:
              </h3>

              <ul className="space-y-2 text-gray-700">
                <li>• Programming languages (React, Python, JavaScript)</li>
                <li>• Tools (Docker, AWS, Git)</li>
                <li>• Skills (API development, performance optimization)</li>
              </ul>

            </div>

          </section>


          <section id="prioritize-keywords" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Prioritizing Keywords in Your Resume
            </h2>

            <p className="text-gray-700 mb-6">
              Once you identify the important keywords, update your resume so that relevant skills and experiences
              appear clearly in your skills, projects, and experience sections.
            </p>

            <p className="text-gray-700">
              Focus especially on keywords that appear multiple times in the job description — these usually indicate
              the most important requirements for the role.
            </p>

          </section>


          <section id="resume-checklist" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Resume Tailoring Checklist
            </h2>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">

              <ul className="space-y-2 text-gray-700">

                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600" /> Carefully read the job description</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600" /> Identify important keywords</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600" /> Add matching skills and experiences</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600" /> Highlight relevant projects</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600" /> Ensure ATS friendly formatting</li>

              </ul>

            </div>


            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl p-8 mt-8">

              <h3 className="text-2xl font-bold mb-4">
                Optimize Your Resume Faster
              </h3>

              <p className="text-lg mb-6">
                Instead of manually comparing resumes with job descriptions,
                use HireLift to analyze your resume and identify missing keywords instantly.
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

      </article>

      <RelatedArticles
        currentSlug="tailor-resume-to-job-description-step-by-step"
        category="Resume Optimization"
      />

    </div>
  );
}