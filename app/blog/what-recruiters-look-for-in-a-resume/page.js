'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaClock, FaUser, FaShare, FaBookmark, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import RelatedArticles from '@/components/RelatedArticles';

export default function WhatRecruitersLookFor() {

  const toc = [
    { id: "how-recruiters-review", title: "How Recruiters Review Resumes" },
    { id: "keywords-job-description", title: "Relevant Keywords From Job Description" },
    { id: "projects-skills", title: "Projects That Demonstrate Skills" },
    { id: "soft-skills", title: "Soft Skills Recruiters Value" },
    { id: "resume-clarity", title: "Clear and Structured Resume" },
    { id: "resume-checklist", title: "Recruiter Friendly Resume Checklist" }
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
            <span className="text-gray-500">Career Advice</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            What Recruiters Actually Look for in a Resume
          </h1>

          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Recruiters often spend only a few seconds scanning each resume. Understanding what they actually look for can significantly improve your chances of getting shortlisted.
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


          <section id="how-recruiters-review" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              How Recruiters Review Resumes
            </h2>

            <p className="text-gray-700">
              Recruiters often review dozens or even hundreds of resumes for a single job posting. Because of this, they quickly scan resumes to find the most relevant information.
            </p>

          </section>


          <section id="keywords-job-description" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Relevant Keywords From Job Description
            </h2>

            <p className="text-gray-700 mb-6">
              One of the first things recruiters and ATS systems look for is whether your resume contains relevant keywords from the job description.
            </p>

            <p className="text-gray-700">
              Including these keywords helps recruiters quickly see that your profile matches the role requirements.
            </p>

          </section>


          <section id="projects-skills" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Projects That Demonstrate Skills
            </h2>

            <p className="text-gray-700 mb-6">
              Recruiters want to see how you have applied your skills in real situations.
            </p>

            <p className="text-gray-700">
              Projects are especially important for freshers because they demonstrate your ability to build solutions and apply technical knowledge.
            </p>

          </section>


          <section id="soft-skills" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Soft Skills Recruiters Value
            </h2>

            <p className="text-gray-700 mb-6">
              In addition to technical skills, recruiters also look for soft skills that indicate how well you will work with teams and communicate ideas.
            </p>

            <ul className="space-y-2 text-gray-700">
              <li>• Communication</li>
              <li>• Problem solving</li>
              <li>• Team collaboration</li>
              <li>• Time management</li>
            </ul>

          </section>


          <section id="resume-clarity" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Clear and Structured Resume
            </h2>

            <p className="text-gray-700">
              A well-organized resume with clear sections helps recruiters quickly understand your experience, skills, and projects.
            </p>

          </section>


          <section id="resume-checklist" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Recruiter Friendly Resume Checklist
            </h2>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">

              <ul className="space-y-2 text-gray-700">

                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Use keywords from job descriptions</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Highlight projects that demonstrate skills</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Include important soft skills</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Keep resume clear and structured</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Optimize resume for ATS systems</li>

              </ul>

            </div>


            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl p-8 mt-8">

              <h3 className="text-2xl font-bold mb-4">
                Improve Your Resume Strategy
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
        currentSlug="what-recruiters-look-for-in-a-resume"
        category="Resume Optimization"
      />

    </div>
  );
}