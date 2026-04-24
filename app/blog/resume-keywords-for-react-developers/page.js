'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaClock, FaUser, FaShare, FaBookmark, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import RelatedArticles from '@/components/RelatedArticles';

export default function ReactResumeKeywords() {

  const toc = [
    { id: "why-keywords", title: "Why Resume Keywords Matter for React Developers" },
    { id: "core-react", title: "Core React Keywords" },
    { id: "frontend", title: "Frontend Development Keywords" },
    { id: "mern", title: "MERN Stack Keywords" },
    { id: "project-keywords", title: "Project-Based Keywords" },
    { id: "optimization", title: "How to Use Keywords Effectively" },
    { id: "tools", title: "Use Tools to Optimize Your Resume" },
    { id: "checklist", title: "React Developer Resume Checklist" }
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
            <span className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold">
              Resume Optimization
            </span>
            <span className="text-gray-500">Developers</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Resume Keywords for React Developers
          </h1>

          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Using the right keywords in your resume is essential for passing ATS filters and getting shortlisted as a React developer.
            Recruiters and systems scan resumes for specific skills and technologies.
          </p>

          <div className="flex items-center justify-between flex-wrap gap-4 p-6 bg-white rounded-xl border">

            <div className="flex items-center gap-6 text-sm text-gray-600">
              <span className="flex items-center gap-2"><FaUser className="w-4 h-4" />HireLift Career Experts</span>
              <span className="flex items-center gap-2"><FaClock className="w-4 h-4" />8 min read</span>
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


        {/* TOC */}

        <motion.div className="mb-12 p-6 bg-blue-50 rounded-xl border border-blue-100">
          <h2 className="text-xl font-bold mb-4">Table of Contents</h2>
          <ul className="space-y-2">
            {toc.map((item, i) => (
              <li key={item.id}>
                <a href={`#${item.id}`} className="text-blue-600 hover:underline">
                  {i + 1}. {item.title}
                </a>
              </li>
            ))}
          </ul>
        </motion.div>


        <motion.div className="prose prose-lg max-w-none">


          <section id="why-keywords" className="mb-12">
            <h2>Why Resume Keywords Matter for React Developers</h2>
            <p>
              Most companies use Applicant Tracking Systems (ATS) to filter resumes.
              Without the right keywords, your resume may never reach a recruiter.
            </p>
          </section>


          <section id="core-react" className="mb-12">
            <h2>Core React Keywords</h2>

            <ul>
              <li>React.js</li>
              <li>Hooks (useState, useEffect)</li>
              <li>Component Lifecycle</li>
              <li>JSX</li>
              <li>State Management</li>
              <li>Redux / Context API</li>
            </ul>

          </section>


          <section id="frontend" className="mb-12">
            <h2>Frontend Development Keywords</h2>

            <ul>
              <li>JavaScript (ES6+)</li>
              <li>HTML5, CSS3</li>
              <li>Tailwind CSS</li>
              <li>Responsive Design</li>
              <li>REST API Integration</li>
            </ul>

          </section>


          <section id="mern" className="mb-12">
            <h2>MERN Stack Keywords</h2>

            <ul>
              <li>MongoDB</li>
              <li>Express.js</li>
              <li>Node.js</li>
              <li>Full Stack Development</li>
              <li>JWT Authentication</li>
            </ul>

          </section>


          <section id="project-keywords" className="mb-12">
            <h2>Project-Based Keywords</h2>

            <ul>
              <li>Built scalable web applications</li>
              <li>Improved performance and UI/UX</li>
              <li>Implemented authentication systems</li>
              <li>Deployed applications using Vercel</li>
            </ul>

          </section>


          <section id="optimization" className="mb-12">
            <h2>How to Use Keywords Effectively</h2>

            <ul>
              <li>Match keywords with job descriptions</li>
              <li>Include keywords naturally in experience</li>
              <li>Avoid keyword stuffing</li>
            </ul>

          </section>


          <section id="tools" className="mb-12">
            <h2>Use Tools to Optimize Your Resume</h2>

            <p>
              Tools like HireLift can help you optimize your resume for ATS, tailor it for job descriptions,
              apply to fresh job opportunities, and connect with recruiters through outreach templates.
            </p>
          </section>


          <section id="checklist" className="mb-12">

            <h2>React Developer Resume Checklist</h2>

            <div className="bg-green-50 p-6 rounded-lg border">

              <ul>

                <li>Use React and frontend keywords</li>
                <li>Include real project experience</li>
                <li>Optimize resume for ATS</li>
                <li>Tailor resume for job descriptions</li>
                <li>Highlight measurable achievements</li>

              </ul>

            </div>


            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl p-8 mt-8">

              <h3 className="text-2xl font-bold mb-4">
                Optimize Your Resume for React Roles
              </h3>

              <p className="mb-6">
                Use HireLift to analyze your resume, add missing keywords, tailor it for job descriptions,
                and increase your chances of getting shortlisted for React developer roles.
              </p>

              <div className="flex gap-4">

                <Link href="/audit" className="px-8 py-3 bg-white text-blue-600 font-bold rounded-lg">
                  Analyze Resume →
                </Link>

                <Link href="/company-search" className="px-8 py-3 border rounded-lg">
                  Find Jobs →
                </Link>

              </div>

            </div>

          </section>

        </motion.div>

      </article>

      <RelatedArticles
        currentSlug="resume-keywords-for-react-developers"
        category="Resume Optimization"
      />

    </div>
  );
}