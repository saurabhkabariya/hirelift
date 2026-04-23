'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaClock, FaUser, FaShare, FaBookmark, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import RelatedArticles from '@/components/RelatedArticles';

export default function TechnicalInterviewPrep() {

  const toc = [
    { id: "why-technical-interview", title: "What to Expect in a Technical Interview" },
    { id: "core-concepts", title: "Strengthen Your Core Concepts" },
    { id: "coding-practice", title: "Practice Coding Problems" },
    { id: "projects", title: "Prepare Your Projects for Discussion" },
    { id: "resume-prep", title: "Optimize Resume Before Interviews" },
    { id: "tools", title: "Use Tools to Improve Your Preparation" },
    { id: "checklist", title: "Technical Interview Preparation Checklist" }
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
            <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-sm font-semibold">
              Interview Preparation
            </span>
            <span className="text-gray-500">Technical</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            How to Prepare for Your First Technical Interview
          </h1>

          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Your first technical interview can feel challenging, especially if you don’t know what to expect.
            A structured preparation strategy can significantly improve your confidence and performance.
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


          <section id="why-technical-interview" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              What to Expect in a Technical Interview
            </h2>

            <p className="text-gray-700">
              Technical interviews typically evaluate your problem-solving ability,
              understanding of core concepts, and how you approach real-world scenarios.
            </p>

          </section>


          <section id="core-concepts" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Strengthen Your Core Concepts
            </h2>

            <p className="text-gray-700">
              Focus on fundamentals such as data structures, algorithms, and programming concepts.
              Strong basics help you solve problems more efficiently during interviews.
            </p>

          </section>


          <section id="coding-practice" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Practice Coding Problems
            </h2>

            <p className="text-gray-700">
              Regular coding practice improves problem-solving speed and confidence.
              Focus on common patterns and gradually increase difficulty.
            </p>

          </section>


          <section id="projects" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Prepare Your Projects for Discussion
            </h2>

            <p className="text-gray-700">
              Be ready to explain your projects clearly. Recruiters often ask about your approach,
              challenges faced, and how your solution works.
            </p>

          </section>


          <section id="resume-prep" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Optimize Resume Before Interviews
            </h2>

            <p className="text-gray-700">
              Your resume is often the first step to getting an interview.
              Ensure it is optimized with relevant keywords and clearly highlights your skills and projects.
            </p>

          </section>


          <section id="tools" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Use Tools to Improve Your Preparation
            </h2>

            <p className="text-gray-700">
              Tools like HireLift can help you optimize your resume for ATS systems,
              tailor it for job descriptions, apply to fresh job opportunities,
              and connect with recruiters through outreach templates, improving your chances
              of getting interview calls.
            </p>

          </section>


          <section id="checklist" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Technical Interview Preparation Checklist
            </h2>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">

              <ul className="space-y-2 text-gray-700">

                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Revise core programming concepts</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Practice coding problems regularly</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Prepare project explanations</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Optimize resume for ATS</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Apply and reach out to recruiters</li>

              </ul>

            </div>


            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl p-8 mt-8">

              <h3 className="text-2xl font-bold mb-4">
                Improve Your Interview Chances
              </h3>

              <p className="text-lg mb-6">
                Use HireLift to optimize your resume, tailor it for job descriptions,
                apply to fresh opportunities, and connect with recruiters to increase your chances
                of getting technical interview calls.
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
        currentSlug="how-to-prepare-for-your-first-technical-interview"
        category="Interview Preparation"
      />

    </div>
  );
}