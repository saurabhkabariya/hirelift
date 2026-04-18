'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaClock, FaUser, FaShare, FaBookmark, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import RelatedArticles from '@/components/RelatedArticles';

export default function ContactRecruitersDirectly() {

  const toc = [
    { id: "why-contact-recruiters", title: "Why Contacting Recruiters Directly Works" },
    { id: "where-to-find-recruiters", title: "Where to Find Recruiters" },
    { id: "linkedin-email", title: "Contacting Recruiters via LinkedIn and Email" },
    { id: "hr-directory", title: "Using HR Directories to Find Recruiters" },
    { id: "outreach-templates", title: "Using Outreach Templates to Save Time" },
    { id: "checklist", title: "Recruiter Outreach Checklist" }
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
              Job Search Strategy
            </span>
            <span className="text-gray-500">Recruiter Outreach</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            How to Contact Recruiters Directly for Job Opportunities
          </h1>

          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Many job seekers apply to hundreds of jobs through portals but rarely get responses.
            Contacting recruiters directly can significantly improve your chances of getting noticed.
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


          <section id="why-contact-recruiters" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Why Contacting Recruiters Directly Works
            </h2>

            <p className="text-gray-700">
              Recruiters often receive hundreds of applications through job portals.
              When you reach out directly, your profile becomes visible and recruiters
              are more likely to review your resume.
            </p>

          </section>


          <section id="where-to-find-recruiters" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Where to Find Recruiters
            </h2>

            <ul className="space-y-2 text-gray-700">
              <li>• LinkedIn recruiter profiles</li>
              <li>• Company career pages</li>
              <li>• HR directories and hiring contact lists</li>
            </ul>

          </section>


          <section id="linkedin-email" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Contacting Recruiters via LinkedIn and Email
            </h2>

            <p className="text-gray-700">
              LinkedIn messages and professional emails are two of the most effective
              ways to reach recruiters. Keep your message short, professional,
              and highlight relevant skills and projects.
            </p>

          </section>


          <section id="hr-directory" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Using HR Directories to Find Recruiters
            </h2>

            <p className="text-gray-700">
              HR directories can help candidates identify recruiters working at
              companies that are hiring. Access to these contacts makes it easier
              to send personalized outreach messages.
            </p>

          </section>


          <section id="outreach-templates" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Using Outreach Templates to Save Time
            </h2>

            <p className="text-gray-700">
              Writing personalized outreach messages for every job can take time.
              Tools like HireLift provide HR directories and free cold outreach
              templates that help candidates contact recruiters more efficiently
              and improve response rates.
            </p>

          </section>


          <section id="checklist" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Recruiter Outreach Checklist
            </h2>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">

              <ul className="space-y-2 text-gray-700">

                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Identify recruiters from hiring companies</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Send short and professional messages</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Mention relevant skills and projects</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Personalize every message</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Attach your optimized resume</li>

              </ul>

            </div>


            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl p-8 mt-8">

              <h3 className="text-2xl font-bold mb-4">
                Find Recruiter Contacts Faster
              </h3>

              <p className="text-lg mb-6">
                Use HireLift to access HR directories, generate outreach templates,
                and optimize your resume to improve your chances of getting recruiter responses.
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
        currentSlug="how-to-contact-recruiters-directly-for-job-opportunities"
        category="Job Search Strategy"
      />

    </div>
  );
}