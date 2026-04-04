'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaClock, FaUser, FaShare, FaBookmark, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import RelatedArticles from '@/components/RelatedArticles';

export default function ResumeWithNoExperience() {

  const toc = [
    { id: "why-no-experience-resume", title: "Can You Get a Job Without Experience?" },
    { id: "highlight-skills", title: "Highlight Relevant Skills from Job Description" },
    { id: "projects-showcase", title: "Showcase Skills Through Projects" },
    { id: "internships", title: "Get Internships to Add Experience" },
    { id: "ats-format", title: "Use ATS Friendly Resume Format" },
    { id: "resume-tools", title: "Use Tools to Save Time" },
    { id: "resume-checklist", title: "Resume Checklist for Freshers" }
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
            <span className="text-gray-500">Fresher Career Guide</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            How to Write a Resume With No Experience
          </h1>

          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Many fresh graduates believe they cannot get a job without experience. However, recruiters often look for skills, potential, and problem-solving ability. With the right resume strategy, even candidates with no work experience can stand out.
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


          <section id="why-no-experience-resume" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Can You Get a Job Without Experience?
            </h2>

            <p className="text-gray-700 mb-6">
              Many companies hiring fresh graduates understand that candidates may not have professional work experience yet. Instead, recruiters look for strong fundamentals, practical skills, and the ability to learn quickly.
            </p>

            <p className="text-gray-700">
              A well-structured resume can highlight your potential even if you haven't worked in a company before.
            </p>

          </section>


          <section id="highlight-skills" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Highlight Relevant Skills from Job Description
            </h2>

            <p className="text-gray-700 mb-6">
              The first step to writing a strong resume without experience is identifying the skills mentioned in the job description.
            </p>

            <p className="text-gray-700">
              Focus on technologies, tools, and skills that appear multiple times in the job posting. These keywords help your resume pass ATS filters.
            </p>

          </section>


          <section id="projects-showcase" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Showcase Skills Through Relevant Projects
            </h2>

            <p className="text-gray-700 mb-6">
              Projects are one of the best ways to demonstrate your skills if you don't have professional experience.
            </p>

            <p className="text-gray-700">
              Instead of tutorial projects, try building projects that solve real-world problems. This helps recruiters understand how you apply your skills practically.
            </p>

          </section>


          <section id="internships" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Get Internships to Add Experience
            </h2>

            <p className="text-gray-700 mb-6">
              Internships can provide valuable hands-on experience and strengthen your resume significantly.
            </p>

            <p className="text-gray-700">
              Even short internships can demonstrate that you have worked in real environments and collaborated with teams.
            </p>

          </section>


          <section id="ats-format" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Use ATS Friendly Resume Format
            </h2>

            <p className="text-gray-700 mb-6">
              Using a simple and structured resume format ensures that ATS systems can read your resume correctly.
            </p>

            <ul className="space-y-2 text-gray-700">
              <li>• Use simple fonts</li>
              <li>• Avoid graphics or icons</li>
              <li>• Use clear section headings</li>
              <li>• Keep formatting consistent</li>
            </ul>

          </section>


          <section id="resume-tools" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Use Tools to Save Time
            </h2>

            <p className="text-gray-700">
              Instead of manually analyzing resumes and job descriptions, tools like HireLift can help identify missing keywords, analyze ATS compatibility, and improve resume quality faster.
            </p>

          </section>


          <section id="resume-checklist" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Resume Checklist for Freshers
            </h2>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">

              <ul className="space-y-2 text-gray-700">

                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Highlight relevant skills</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Showcase practical projects</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Gain internship experience</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Use ATS friendly format</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Optimize resume keywords</li>

              </ul>

            </div>


            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl p-8 mt-8">

              <h3 className="text-2xl font-bold mb-4">
                Improve Your Resume Instantly
              </h3>

              <p className="text-lg mb-6">
                Upload your resume to HireLift to check ATS compatibility, identify missing keywords,
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
        currentSlug="how-to-write-resume-with-no-experience"
        category="Resume Optimization"
      />

    </div>
  );
}