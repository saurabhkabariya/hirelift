'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaClock, FaUser, FaShare, FaBookmark, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import RelatedArticles from '@/components/RelatedArticles';

export default function BestDeveloperResumeFormat() {

  const toc = [
    { id: "why-format-matters", title: "Why Resume Format Matters for Developers" },
    { id: "best-resume-format", title: "Best ATS Friendly Resume Format" },
    { id: "avoid-photo", title: "Why You Should Avoid Photos on Resume" },
    { id: "keywords-optimization", title: "Optimize Important Keywords" },
    { id: "necessary-sections", title: "Essential Resume Sections" },
    { id: "resume-tools", title: "Use Tools to Save Time" },
    { id: "resume-checklist", title: "Developer Resume Checklist" }
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
            <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold">
              Resume Optimization
            </span>
            <span className="text-gray-500">Software Developer Careers</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Best Resume Format for Software Developers (ATS Friendly)
          </h1>

          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Choosing the right resume format can significantly increase your chances of passing ATS filters and getting interview calls. In this guide, we explain the best ATS friendly resume format for software developers.
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


          <section id="why-format-matters" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Why Resume Format Matters for Developers
            </h2>

            <p className="text-gray-700 mb-6">
              Most tech companies use Applicant Tracking Systems (ATS) to filter resumes before recruiters see them. If your resume format is not ATS friendly, it may never reach a human recruiter.
            </p>

            <p className="text-gray-700">
              Using a clean and structured resume format helps ATS systems identify your skills, projects, and experience easily.
            </p>

          </section>


          <section id="best-resume-format" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Best ATS Friendly Resume Format
            </h2>

            <p className="text-gray-700 mb-6">
              One of the most widely recommended ATS friendly resume formats is the popular <strong>Jake's Resume Format</strong>.
            </p>

            <p className="text-gray-700">
              This format is widely used by software developers because it is simple, structured, and easily readable by ATS systems.
            </p>

          </section>


          <section id="avoid-photo" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Avoid Adding a Photo to Your Resume
            </h2>

            <p className="text-gray-700">
              Photos are not necessary for most software developer roles and can sometimes confuse ATS systems.
              It is best to keep your resume clean and focused on skills and achievements instead.
            </p>

          </section>


          <section id="keywords-optimization" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Optimize Important Keywords
            </h2>

            <p className="text-gray-700">
              ATS systems scan resumes for keywords mentioned in job descriptions. Make sure your resume includes relevant technologies, tools, and skills required for the role.
            </p>

          </section>


          <section id="necessary-sections" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Essential Resume Sections
            </h2>

            <ul className="space-y-2 text-gray-700">
              <li>• Professional Summary</li>
              <li>• Technical Skills</li>
              <li>• Projects or Work Experience</li>
              <li>• Education</li>
            </ul>

          </section>


          <section id="resume-tools" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Use Tools to Save Time
            </h2>

            <p className="text-gray-700">
              Instead of manually optimizing resumes for every job application, tools like HireLift can analyze your resume,
              identify missing keywords, and improve your ATS compatibility quickly.
            </p>

          </section>


          <section id="resume-checklist" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Developer Resume Checklist
            </h2>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">

              <ul className="space-y-2 text-gray-700">

                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Use ATS friendly resume format</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Include relevant keywords</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Avoid photos and complex layouts</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Highlight projects and skills clearly</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Use tools to analyze resume quality</li>

              </ul>

            </div>


            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl p-8 mt-8">

              <h3 className="text-2xl font-bold mb-4">
                Check Your Resume Instantly
              </h3>

              <p className="text-lg mb-6">
                Upload your resume to HireLift to check ATS compatibility, find missing keywords,
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
        currentSlug="best-resume-format-software-developers-ats-friendly"
        category="Resume Optimization"
      />

    </div>
  );
}