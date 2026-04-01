'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaClock, FaUser, FaShare, FaBookmark, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import RelatedArticles from '@/components/RelatedArticles';

export default function ResumeChecklistBeforeApplying() {

  const toc = [
    { id: "why-checklist-matters", title: "Why a Resume Checklist Matters" },
    { id: "keywords-optimization", title: "Optimize Important Keywords" },
    { id: "ats-format", title: "Use ATS Friendly Resume Formats" },
    { id: "necessary-sections", title: "Include Only Necessary Sections" },
    { id: "job-description", title: "Tailor Resume to Job Description" },
    { id: "apply-early", title: "Apply as an Early Applicant" },
    { id: "final-checklist", title: "Complete Resume Checklist" }
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
            Resume Checklist Before Applying to Any Job
          </h1>

          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Sending your resume without reviewing it carefully can reduce your chances of getting interviews.
            Use this simple checklist before applying to any job to make sure your resume passes ATS filters and catches recruiters' attention.
          </p>

          <div className="flex items-center justify-between flex-wrap gap-4 p-6 bg-white rounded-xl border">

            <div className="flex items-center gap-6 text-sm text-gray-600">
              <span className="flex items-center gap-2"><FaUser className="w-4 h-4" />HireLift Career Experts</span>
              <span className="flex items-center gap-2"><FaClock className="w-4 h-4" />7 min read</span>
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


          <section id="why-checklist-matters" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Why a Resume Checklist Matters
            </h2>

            <p className="text-gray-700 mb-6">
              Many candidates apply to dozens of jobs quickly without reviewing their resumes properly.
              Small mistakes like missing keywords or poor formatting can cause resumes to fail ATS screening instantly.
            </p>

            <p className="text-gray-700">
              Following a simple checklist before applying ensures your resume is optimized for both ATS systems and recruiters.
            </p>

          </section>


          <section id="keywords-optimization" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Optimize Important Keywords
            </h2>

            <p className="text-gray-700 mb-6">
              ATS systems scan resumes for keywords mentioned in the job description.
              These keywords usually represent the most important skills and technologies required for the role.
            </p>

            <p className="text-gray-700">
              Make sure your resume includes relevant keywords from the job posting in your skills, projects, and experience sections.
            </p>

          </section>


          <section id="ats-format" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Use ATS Friendly Resume Formats
            </h2>

            <p className="text-gray-700 mb-6">
              Fancy resume designs may look attractive but can confuse ATS systems.
              Using a clean and simple format helps ensure your resume is parsed correctly.
            </p>

            <ul className="space-y-2 text-gray-700">
              <li>• Use simple fonts like Arial or Calibri</li>
              <li>• Avoid tables, icons, and graphics</li>
              <li>• Use clear section headings</li>
              <li>• Keep formatting consistent</li>
            </ul>

          </section>


          <section id="necessary-sections" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Include Only Necessary Resume Sections
            </h2>

            <p className="text-gray-700 mb-6">
              A resume should highlight relevant information clearly.
              Including too many unnecessary sections can make it harder for recruiters and ATS systems to understand your profile.
            </p>

            <ul className="space-y-2 text-gray-700">
              <li>• Professional Summary</li>
              <li>• Skills</li>
              <li>• Projects or Experience</li>
              <li>• Education</li>
            </ul>

          </section>


          <section id="job-description" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Tailor Resume to Job Description
            </h2>

            <p className="text-gray-700 mb-6">
              Every job posting has slightly different requirements.
              Customizing your resume based on the job description significantly improves your chances of getting shortlisted.
            </p>

          </section>


          <section id="apply-early" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Apply as an Early Applicant
            </h2>

            <p className="text-gray-700">
              Many recruiters stop reviewing applications after receiving the first 100–150 candidates.
              Applying early increases the chances that your resume will actually be reviewed.
            </p>

          </section>


          <section id="final-checklist" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Complete Resume Checklist
            </h2>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">

              <ul className="space-y-2 text-gray-700">

                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Include important keywords</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Use ATS friendly formatting</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Keep only necessary sections</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Customize resume for job description</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Apply early to job postings</li>

              </ul>

            </div>


            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl p-8 mt-8">

              <h3 className="text-2xl font-bold mb-4">
                Check Your Resume Before Applying
              </h3>

              <p className="text-lg mb-6">
                Use HireLift to analyze your resume ATS score, identify missing keywords,
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
        currentSlug="resume-checklist-before-applying-to-any-job"
        category="Resume Optimization"
      />

    </div>
  );
}