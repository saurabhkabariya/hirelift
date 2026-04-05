'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaClock, FaUser, FaShare, FaBookmark, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import RelatedArticles from '@/components/RelatedArticles';

export default function DeveloperResumeKeywords() {

  const toc = [
    { id: "why-keywords-matter", title: "Why Resume Keywords Matter" },
    { id: "programming-keywords", title: "Programming Language Keywords" },
    { id: "framework-keywords", title: "Framework and Library Keywords" },
    { id: "tool-keywords", title: "Developer Tools Keywords" },
    { id: "how-to-use-keywords", title: "How to Use Keywords in Resume" },
    { id: "resume-checklist", title: "Developer Resume Keyword Checklist" }
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
            <span className="text-gray-500">Software Developer Careers</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Resume Keywords for Software Developer Jobs
          </h1>

          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Many resumes get rejected because they don't include the right keywords. Using relevant programming, framework, and developer tool keywords can help your resume pass ATS systems and reach recruiters.
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


          <section id="why-keywords-matter" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Why Resume Keywords Matter
            </h2>

            <p className="text-gray-700 mb-6">
              Applicant Tracking Systems scan resumes for keywords related to the job description. If your resume does not contain these keywords, it may never reach recruiters.
            </p>

            <p className="text-gray-700">
              Using relevant keywords helps ATS systems understand your skills and improves your chances of getting shortlisted.
            </p>

          </section>


          <section id="programming-keywords" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Programming Language Keywords
            </h2>

            <ul className="space-y-2 text-gray-700">
              <li>• JavaScript</li>
              <li>• Python</li>
              <li>• Java</li>
              <li>• C++</li>
              <li>• TypeScript</li>
              <li>• Go</li>
              <li>• Rust</li>
            </ul>

          </section>


          <section id="framework-keywords" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Framework and Library Keywords
            </h2>

            <ul className="space-y-2 text-gray-700">
              <li>• React.js</li>
              <li>• Next.js</li>
              <li>• Node.js</li>
              <li>• Express.js</li>
              <li>• Django</li>
              <li>• Spring Boot</li>
            </ul>

          </section>


          <section id="tool-keywords" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Developer Tools Keywords
            </h2>

            <ul className="space-y-2 text-gray-700">
              <li>• Git</li>
              <li>• Docker</li>
              <li>• Kubernetes</li>
              <li>• AWS</li>
              <li>• MongoDB</li>
              <li>• PostgreSQL</li>
            </ul>

          </section>


          <section id="how-to-use-keywords" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              How to Use Keywords in Resume
            </h2>

            <p className="text-gray-700 mb-6">
              Keywords should appear naturally in different sections of your resume including skills, projects, and experience.
            </p>

            <p className="text-gray-700">
              Always match keywords with the job description to increase your chances of passing ATS screening.
            </p>

          </section>


          <section id="resume-checklist" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Developer Resume Keyword Checklist
            </h2>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">

              <ul className="space-y-2 text-gray-700">

                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Include programming language keywords</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Add relevant frameworks</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Mention developer tools</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Match keywords from job description</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Keep resume ATS friendly</li>

              </ul>

            </div>


            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl p-8 mt-8">

              <h3 className="text-2xl font-bold mb-4">
                Optimize Your Resume Automatically
              </h3>

              <p className="text-lg mb-6">
                Upload your resume to HireLift to analyze missing keywords,
                improve ATS compatibility, and increase your chances of getting interview calls.
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
        currentSlug="resume-keywords-software-developer-jobs"
        category="Resume Optimization"
      />

    </div>
  );
}