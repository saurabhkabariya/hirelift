'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaClock, FaUser, FaShare, FaBookmark, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import RelatedArticles from '@/components/RelatedArticles';

export default function LinkedinMessageRecruiters() {

  const toc = [
    { id: "why-linkedin-outreach", title: "Why Messaging Recruiters on LinkedIn Works" },
    { id: "when-to-message", title: "When You Should Message Recruiters" },
    { id: "linkedin-template", title: "LinkedIn Message Template to Recruiters" },
    { id: "personalize-message", title: "How to Personalize Your LinkedIn Message" },
    { id: "tools", title: "Use Tools to Improve Outreach Results" },
    { id: "checklist", title: "LinkedIn Outreach Checklist" }
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
            <span className="text-gray-500">LinkedIn Outreach</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            LinkedIn Message Template to Ask Recruiters for Jobs
          </h1>

          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            LinkedIn is one of the most powerful platforms for connecting with recruiters.
            A simple and professional message can help your profile stand out and increase your chances of getting job opportunities.
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

          <section id="why-linkedin-outreach" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Why Messaging Recruiters on LinkedIn Works
            </h2>

            <p className="text-gray-700">
              Recruiters actively use LinkedIn to discover candidates. Sending a short and professional
              message can help your profile get noticed faster than applying only through job portals.
            </p>

          </section>


          <section id="when-to-message" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              When You Should Message Recruiters
            </h2>

            <ul className="space-y-2 text-gray-700">
              <li>• After applying for a job opening</li>
              <li>• When recruiters share job posts</li>
              <li>• When you want to explore opportunities at a company</li>
            </ul>

          </section>


          <section id="linkedin-template" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              LinkedIn Message Template to Recruiters
            </h2>

            <div className="bg-gray-100 rounded-lg p-6 text-gray-800">

              <p>Hello [Recruiter Name],</p>

              <p className="mt-3">
                I hope you're doing well. I came across your profile while exploring
                opportunities at <strong>[Company Name]</strong>.
              </p>

              <p className="mt-2">
                I am currently looking for opportunities as a <strong>[Job Role]</strong>
                and have experience with <strong>[key skills]</strong>. I’ve also built
                projects such as <strong>[project name]</strong> demonstrating these skills.
              </p>

              <p className="mt-2">
                I would appreciate the opportunity to connect and learn about any relevant
                openings in your team.
              </p>

              <p className="mt-2">
                Thank you for your time!
              </p>

              <p className="mt-2">
                Best regards,<br/>
                [Your Name]
              </p>

            </div>

          </section>


          <section id="personalize-message" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              How to Personalize Your LinkedIn Message
            </h2>

            <p className="text-gray-700">
              Mention the company name, job role, and relevant skills or projects.
              Personalized messages show genuine interest and increase response rates.
            </p>

          </section>


          <section id="tools" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Use Tools to Improve Outreach Results
            </h2>

            <p className="text-gray-700">
              Writing outreach messages and optimizing resumes for each job can take time.
              Tools like HireLift provide free templates and help optimize resumes so candidates
              can increase their chances of getting recruiter responses.
            </p>

          </section>


          <section id="checklist" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              LinkedIn Outreach Checklist
            </h2>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">

              <ul className="space-y-2 text-gray-700">

                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Keep the message short</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Mention relevant skills</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Highlight meaningful projects</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Personalize the message</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Attach or link your resume</li>

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
        currentSlug="linkedin-message-template-ask-recruiters-for-jobs"
        category="Job Search Strategy"
      />

    </div>
  );
}