'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaClock, FaUser, FaShare, FaBookmark, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import RelatedArticles from '@/components/RelatedArticles';

export default function StandOutApplicants() {

  const toc = [
    { id: "why-competition-high", title: "Why Competition Is High for Job Applications" },
    { id: "apply-early", title: "Become an Early Applicant" },
    { id: "keywords-projects", title: "Use Relevant Keywords and Projects" },
    { id: "projects-explain-skills", title: "Projects That Explain Your Skills" },
    { id: "soft-skills", title: "Soft Skills That Help You Stand Out" },
    { id: "resume-tools", title: "Use Tools to Optimize Your Resume" },
    { id: "checklist", title: "Checklist to Stand Out in Job Applications" }
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
              Job Search Strategy
            </span>
            <span className="text-gray-500">Career Advice</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            How to Stand Out Among Hundreds of Applicants
          </h1>

          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Many job postings receive hundreds of applications. To get noticed by recruiters,
            candidates must go beyond simply submitting resumes and focus on strategies that make their applications stand out.
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


          <section id="why-competition-high" className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Why Competition Is High for Job Applications
            </h2>

            <p className="text-gray-700">
              Online job platforms make it easy for candidates to apply quickly. As a result,
              many job postings receive hundreds of applications, making it harder for recruiters
              to review every resume carefully.
            </p>
          </section>


          <section id="apply-early" className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Become an Early Applicant and Do Cold Outreach
            </h2>

            <p className="text-gray-700 mb-6">
              Applying early increases the chances that recruiters will review your application
              before the candidate pool becomes too large.
            </p>

            <p className="text-gray-700">
              Cold outreach through professional platforms like LinkedIn can also help bring
              your profile directly to the attention of recruiters.
            </p>
          </section>


          <section id="keywords-projects" className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Use Relevant Keywords and Projects
            </h2>

            <p className="text-gray-700">
              Analyze the job description carefully and include the most important skills
              and technologies in your resume. These keywords help ATS systems and recruiters
              quickly identify that your profile matches the job requirements.
            </p>
          </section>


          <section id="projects-explain-skills" className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Projects That Explain Your Skills
            </h2>

            <p className="text-gray-700">
              Recruiters want evidence of your skills. Projects that demonstrate real-world
              problem solving and practical application of technologies help your resume stand out.
            </p>
          </section>


          <section id="soft-skills" className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Soft Skills That Help You Stand Out
            </h2>

            <p className="text-gray-700 mb-6">
              In addition to technical expertise, recruiters look for candidates with strong
              interpersonal skills.
            </p>

            <ul className="space-y-2 text-gray-700">
              <li>• Communication</li>
              <li>• Problem solving</li>
              <li>• Team collaboration</li>
              <li>• Time management</li>
            </ul>
          </section>


          <section id="resume-tools" className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Use Tools to Optimize Your Resume
            </h2>

            <p className="text-gray-700">
              Tools like HireLift can help analyze resumes, identify missing keywords,
              and improve ATS compatibility so your resume performs better during job applications.
            </p>
          </section>


          <section id="checklist" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Checklist to Stand Out in Job Applications
            </h2>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">

              <ul className="space-y-2 text-gray-700">

                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Apply early to job postings</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Reach out to recruiters</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Use keywords from job descriptions</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Highlight meaningful projects</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Showcase strong soft skills</li>

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
        currentSlug="how-to-stand-out-among-hundreds-of-applicants"
        category="Job Search Strategy"
      />

    </div>
  );
}