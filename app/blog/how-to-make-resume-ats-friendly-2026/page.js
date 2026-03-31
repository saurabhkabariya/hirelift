'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaClock, FaUser, FaShare, FaBookmark, FaArrowLeft, FaSearch, FaCheckCircle } from 'react-icons/fa';
import RelatedArticles from '@/components/RelatedArticles';

export default function ATSFriendlyResume2026() {

  const toc = [
    { id: "what-is-ats", title: "What is an ATS and Why It Matters" },
    { id: "keywords-optimization", title: "Optimizing Resume Keywords" },
    { id: "ats-format", title: "Using ATS Friendly Resume Formats" },
    { id: "resume-sections", title: "Using Only Necessary Resume Sections" },
    { id: "job-description-optimization", title: "Optimizing Based on Job Descriptions" },
    { id: "ats-checklist", title: "ATS Resume Optimization Checklist" }
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
            <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
              Resume Optimization
            </span>
            <span className="text-gray-500">ATS Resume Guide</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            How to Make Your Resume ATS Friendly in 2026
          </h1>

          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Most companies now use Applicant Tracking Systems (ATS) to filter resumes before recruiters see them.
            If your resume isn't optimized properly, it may be rejected automatically. Learn how to make your resume ATS friendly in 2026.
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


          {/* SECTION 1 */}

          <section id="what-is-ats" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              What is an ATS and Why It Matters
            </h2>

            <p className="text-gray-700 mb-6">
              Applicant Tracking Systems (ATS) are software tools used by companies to filter and organize job applications.
              Instead of reviewing every resume manually, recruiters rely on ATS systems to shortlist candidates automatically.
            </p>

            <p className="text-gray-700">
              If your resume does not match the required keywords or formatting standards, it may never reach a human recruiter.
            </p>

          </section>


          {/* SECTION 2 */}

          <section id="keywords-optimization" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Optimizing Resume Keywords
            </h2>

            <p className="text-gray-700 mb-6">
              ATS systems scan resumes for keywords mentioned in the job description.
              These keywords usually represent skills, technologies, and job responsibilities.
            </p>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">

              <h3 className="font-bold text-green-900 mb-3">
                Example keywords:
              </h3>

              <ul className="space-y-2 text-gray-700">
                <li>• Programming languages (JavaScript, Python, Java)</li>
                <li>• Tools (Docker, AWS, Git)</li>
                <li>• Skills (API development, debugging, performance optimization)</li>
              </ul>

            </div>

          </section>


          {/* SECTION 3 */}

          <section id="ats-format" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Using ATS Friendly Resume Formats
            </h2>

            <p className="text-gray-700 mb-6">
              Resume formatting plays an important role in ATS compatibility.
              Complex designs can confuse ATS systems and prevent them from reading your resume properly.
            </p>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">

              <h3 className="font-bold text-yellow-900 mb-3">
                ATS Friendly Formatting Tips
              </h3>

              <ul className="space-y-2 text-gray-700">
                <li>• Use simple fonts (Arial, Calibri)</li>
                <li>• Avoid tables and graphics</li>
                <li>• Use clear headings</li>
                <li>• Save resume as PDF or DOCX</li>
              </ul>

            </div>

          </section>


          {/* SECTION 4 */}

          <section id="resume-sections" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Using Only Necessary Resume Sections
            </h2>

            <p className="text-gray-700 mb-6">
              Many resumes contain unnecessary sections that distract recruiters and ATS systems.
              Keeping your resume concise improves readability and increases relevance.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">

              <h3 className="font-bold text-blue-900 mb-3">
                Essential Resume Sections
              </h3>

              <ul className="space-y-2 text-gray-700">
                <li>• Professional Summary</li>
                <li>• Skills</li>
                <li>• Experience or Projects</li>
                <li>• Education</li>
              </ul>

            </div>

          </section>


          {/* SECTION 5 */}

          <section id="job-description-optimization" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Optimizing Based on Job Descriptions
            </h2>

            <p className="text-gray-700 mb-6">
              Every job posting has slightly different requirements.
              Tailoring your resume based on the job description increases your chances of passing ATS filters.
            </p>

            <p className="text-gray-700">
              Focus especially on keywords that appear multiple times in the job description,
              as they usually represent the most important skills for the role.
            </p>

          </section>


          {/* CHECKLIST */}

          <section id="ats-checklist" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              ATS Resume Optimization Checklist
            </h2>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">

              <ul className="space-y-2 text-gray-700">

                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Include important keywords</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Use ATS friendly formatting</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Keep resume concise</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Tailor resume for each job</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Highlight relevant projects</li>

              </ul>

            </div>


            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl p-8 mt-8">

              <h3 className="text-2xl font-bold mb-4">
                Check Your Resume ATS Score
              </h3>

              <p className="text-lg mb-6">
                Upload your resume to HireLift and instantly check ATS compatibility,
                missing keywords, and optimization improvements.
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
        currentSlug="how-to-make-resume-ats-friendly-2026"
        category="Resume Optimization"
      />

    </div>
  );
}