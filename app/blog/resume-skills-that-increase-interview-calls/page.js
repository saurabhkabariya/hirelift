'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaClock, FaUser, FaShare, FaBookmark, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import RelatedArticles from '@/components/RelatedArticles';

export default function ResumeSkillsInterviewCalls() {

  const toc = [
    { id: "why-skills-matter", title: "Why Resume Skills Matter" },
    { id: "job-description-skills", title: "Choose Skills Based on Job Descriptions" },
    { id: "technical-skills", title: "Technical Skills That Increase Interview Chances" },
    { id: "ai-skills", title: "Emerging Skills Like AI" },
    { id: "soft-skills", title: "Soft Skills Recruiters Look For" },
    { id: "resume-tools", title: "Use Tools to Save Time" },
    { id: "skills-checklist", title: "Resume Skills Checklist" }
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
            <span className="text-gray-500">Career Strategy</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Resume Skills That Increase Interview Calls
          </h1>

          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            The skills listed on your resume play a major role in whether recruiters shortlist you for interviews. Choosing the right combination of technical skills, emerging technologies, and soft skills can significantly improve your chances.
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


          <section id="why-skills-matter" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Why Resume Skills Matter
            </h2>

            <p className="text-gray-700 mb-6">
              Recruiters often scan resumes quickly to identify key skills that match the job requirements. If your resume clearly highlights relevant skills, it becomes easier for recruiters to evaluate your profile.
            </p>

            <p className="text-gray-700">
              Including the right skills also improves your chances of passing ATS filters used by many companies.
            </p>

          </section>


          <section id="job-description-skills" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Choose Skills Based on Job Descriptions
            </h2>

            <p className="text-gray-700 mb-6">
              The most effective way to choose resume skills is by analyzing job descriptions carefully.
            </p>

            <p className="text-gray-700">
              Look for technologies, tools, and responsibilities mentioned multiple times in the job posting. These often represent the most important skills recruiters are looking for.
            </p>

          </section>


          <section id="technical-skills" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Technical Skills That Increase Interview Chances
            </h2>

            <ul className="space-y-2 text-gray-700">
              <li>• JavaScript</li>
              <li>• Python</li>
              <li>• React</li>
              <li>• Node.js</li>
              <li>• SQL</li>
              <li>• Cloud technologies</li>
            </ul>

          </section>


          <section id="ai-skills" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Emerging Skills Like AI
            </h2>

            <p className="text-gray-700 mb-6">
              As artificial intelligence becomes increasingly important across industries, many companies look for candidates with basic AI-related knowledge.
            </p>

            <ul className="space-y-2 text-gray-700">
              <li>• Machine Learning basics</li>
              <li>• Prompt engineering</li>
              <li>• AI tool usage</li>
              <li>• Data analysis</li>
            </ul>

          </section>


          <section id="soft-skills" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Soft Skills Recruiters Look For
            </h2>

            <p className="text-gray-700 mb-6">
              Soft skills are equally important because they demonstrate how well you work with teams and communicate ideas.
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
              Use Tools to Save Time
            </h2>

            <p className="text-gray-700">
              Instead of manually analyzing resumes and job descriptions, tools like HireLift can help identify missing skills and keywords automatically.
            </p>

          </section>


          <section id="skills-checklist" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Resume Skills Checklist
            </h2>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">

              <ul className="space-y-2 text-gray-700">

                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Include skills from job description</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Add emerging AI skills</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Highlight important technical skills</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Include soft skills like communication</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Keep resume ATS friendly</li>

              </ul>

            </div>


            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl p-8 mt-8">

              <h3 className="text-2xl font-bold mb-4">
                Optimize Your Resume Skills
              </h3>

              <p className="text-lg mb-6">
                Upload your resume to HireLift to identify missing skills and keywords automatically and improve your chances of getting interview calls.
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
        currentSlug="resume-skills-that-increase-interview-calls"
        category="Resume Optimization"
      />

    </div>
  );
}