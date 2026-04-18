'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaClock, FaUser, FaShare, FaBookmark, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import RelatedArticles from '@/components/RelatedArticles';

export default function EmailHRForJobs() {

  const toc = [
    { id: "why-email-hr", title: "Why Emailing HR Can Help Your Job Search" },
    { id: "when-to-email", title: "When You Should Email HR" },
    { id: "example-email", title: "Example Email to HR for Job Opportunities" },
    { id: "tips-for-email", title: "Tips for Writing Effective Emails" },
    { id: "tools", title: "Use Tools to Simplify Job Outreach" },
    { id: "checklist", title: "Email Outreach Checklist" }
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
              Job Search Strategy
            </span>
            <span className="text-gray-500">Cold Outreach</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            How to Email HR for Job Opportunities (Examples)
          </h1>

          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Many job seekers rely only on job portals. However, emailing HR directly can help your profile stand out
            and improve your chances of getting noticed by recruiters.
          </p>

          <div className="flex items-center justify-between flex-wrap gap-4 p-6 bg-white rounded-xl border">

            <div className="flex items-center gap-6 text-sm text-gray-600">
              <span className="flex items-center gap-2"><FaUser className="w-4 h-4" />HireLift Career Experts</span>
              <span className="flex items-center gap-2"><FaClock className="w-4 h-4" />6 min read</span>
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


          <section id="why-email-hr" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Why Emailing HR Can Help Your Job Search
            </h2>

            <p className="text-gray-700">
              Many companies receive hundreds of applications through job portals.
              Sending a direct email to HR can help your resume stand out and increase
              the likelihood that your profile will be reviewed.
            </p>

          </section>


          <section id="when-to-email" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              When You Should Email HR
            </h2>

            <ul className="space-y-2 text-gray-700">
              <li>• After applying for a job role</li>
              <li>• When you discover a company you want to join</li>
              <li>• When you see a recruiter posting job openings</li>
            </ul>

          </section>


          <section id="example-email" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Example Email to HR for Job Opportunities
            </h2>

            <div className="bg-gray-100 rounded-lg p-6 text-gray-800">

              <p><strong>Subject:</strong> Inquiry Regarding Opportunities – [Job Role]</p>

              <p className="mt-4">
                Hello [HR Name],
              </p>

              <p className="mt-2">
                I hope you are doing well. My name is [Your Name], and I am interested in exploring
                opportunities for the role of <strong>[Job Role]</strong> at <strong>[Company Name]</strong>.
              </p>

              <p className="mt-2">
                I have experience with <strong>[key skills]</strong> and have worked on projects such as
                <strong> [project name]</strong> that demonstrate these skills.
              </p>

              <p className="mt-2">
                I would appreciate the opportunity to discuss potential openings that match my profile.
                I've attached my resume for your review.
              </p>

              <p className="mt-2">
                Thank you for your time and consideration.
              </p>

              <p className="mt-2">
                Best regards,<br/>
                [Your Name]
              </p>

            </div>

          </section>


          <section id="tips-for-email" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Tips for Writing Effective Emails
            </h2>

            <ul className="space-y-2 text-gray-700">
              <li>• Keep the email short and professional</li>
              <li>• Mention relevant skills and projects</li>
              <li>• Personalize the email for the company</li>
              <li>• Attach an optimized resume</li>
            </ul>

          </section>


          <section id="tools" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Use Tools to Simplify Job Outreach
            </h2>

            <p className="text-gray-700">
              Writing customized emails and optimizing resumes for every job can take time.
              Tools like HireLift can help generate optimized resumes, provide email templates,
              and help candidates discover fresh job opportunities more efficiently.
            </p>

          </section>


          <section id="checklist" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Email Outreach Checklist
            </h2>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">

              <ul className="space-y-2 text-gray-700">

                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Write a clear subject line</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Mention relevant skills</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Highlight meaningful projects</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Keep email concise</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Attach your optimized resume</li>

              </ul>

            </div>


            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl p-8 mt-8">

              <h3 className="text-2xl font-bold mb-4">
                Optimize Your Resume Before Reaching Out
              </h3>

              <p className="text-lg mb-6">
                Upload your resume to HireLift to analyze ATS compatibility, identify missing keywords,
                and improve your chances of getting recruiter responses.
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
        currentSlug="how-to-email-hr-for-job-opportunities-examples"
        category="Job Search Strategy"
      />

    </div>
  );
}