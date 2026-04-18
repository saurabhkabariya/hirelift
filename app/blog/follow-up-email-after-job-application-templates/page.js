'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaClock, FaUser, FaShare, FaBookmark, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import RelatedArticles from '@/components/RelatedArticles';

export default function FollowUpEmailJobApplication() {

  const toc = [
    { id: "why-follow-up", title: "Why Follow-Up Emails Matter" },
    { id: "when-to-follow-up", title: "When to Send a Follow-Up Email" },
    { id: "email-template", title: "Follow-Up Email Template" },
    { id: "personalize", title: "How to Personalize Your Follow-Up Email" },
    { id: "tools", title: "Use Tools to Improve Your Outreach" },
    { id: "checklist", title: "Follow-Up Email Checklist" }
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
            Follow-Up Email After Job Application (Templates)
          </h1>

          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            After applying for a job, many candidates wait silently for a response. Sending a professional follow-up email can help remind recruiters about your application and increase your chances of getting noticed.
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

          <section id="why-follow-up" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Why Follow-Up Emails Matter
            </h2>

            <p className="text-gray-700">
              Recruiters often manage hundreds of applications for a single role. A polite follow-up email can remind them about your application and show your interest in the role.
            </p>

          </section>


          <section id="when-to-follow-up" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              When to Send a Follow-Up Email
            </h2>

            <ul className="space-y-2 text-gray-700">
              <li>• 5–7 days after submitting your job application</li>
              <li>• After completing an interview round</li>
              <li>• When you have not received updates about your application</li>
            </ul>

          </section>


          <section id="email-template" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Follow-Up Email Template
            </h2>

            <div className="bg-gray-100 rounded-lg p-6 text-gray-800">

              <p><strong>Subject:</strong> Follow-Up on Job Application – [Job Role]</p>

              <p className="mt-4">
                Hello [Recruiter Name],
              </p>

              <p className="mt-2">
                I hope you're doing well. I recently applied for the <strong>[Job Role]</strong> position at <strong>[Company Name]</strong> and wanted to follow up regarding the status of my application.
              </p>

              <p className="mt-2">
                I remain very interested in this opportunity and would appreciate the chance to discuss how my skills and projects could contribute to your team.
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


          <section id="personalize" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              How to Personalize Your Follow-Up Email
            </h2>

            <p className="text-gray-700">
              Mention the company name, job role, and relevant skills or projects. Personalizing your email helps recruiters understand your genuine interest in the opportunity.
            </p>

          </section>


          <section id="tools" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Use Tools to Improve Your Outreach
            </h2>

            <p className="text-gray-700">
              Writing outreach emails and optimizing resumes for every application can take time.
              Tools like HireLift provide free templates and help optimize resumes so candidates can increase recruiter responses more efficiently.
            </p>

          </section>


          <section id="checklist" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Follow-Up Email Checklist
            </h2>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">

              <ul className="space-y-2 text-gray-700">

                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Wait at least 5–7 days before following up</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Use a clear and professional subject line</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Mention the job role you applied for</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Keep the email short and polite</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Attach an optimized resume</li>

              </ul>

            </div>

            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl p-8 mt-8">

              <h3 className="text-2xl font-bold mb-4">
                Improve Your Resume Before Following Up
              </h3>

              <p className="text-lg mb-6">
                Upload your resume to HireLift to analyze ATS compatibility, identify missing keywords, and improve your chances of getting recruiter responses.
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
        currentSlug="follow-up-email-after-job-application-templates"
        category="Job Search Strategy"
      />

    </div>
  );
}