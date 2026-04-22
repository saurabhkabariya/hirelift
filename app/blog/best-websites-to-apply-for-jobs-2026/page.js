'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaClock, FaUser, FaShare, FaBookmark, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import RelatedArticles from '@/components/RelatedArticles';

export default function BestJobWebsites2026() {

  const toc = [
    { id: "why-platform-matters", title: "Why Choosing the Right Platform Matters" },
    { id: "linkedin", title: "LinkedIn" },
    { id: "naukri", title: "Naukri" },
    { id: "indeed", title: "Indeed" },
    { id: "glassdoor", title: "Glassdoor" },
    { id: "company-careers", title: "Company Career Pages" },
    { id: "tools", title: "Use Tools to Improve Job Applications" },
    { id: "checklist", title: "Job Application Platform Checklist" }
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
            <span className="text-gray-500">Job Portals</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Best Websites to Apply for Jobs in 2026
          </h1>

          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Applying on the right job platforms can significantly improve your chances of getting interview calls.
            Knowing where to apply is just as important as how you apply.
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


          <section id="why-platform-matters" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Why Choosing the Right Platform Matters
            </h2>

            <p className="text-gray-700">
              Not all job platforms are equally effective. Some platforms have more competition,
              while others provide better visibility to recruiters. Choosing the right platforms
              can improve your chances of getting interview calls.
            </p>

          </section>


          <section id="linkedin" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              LinkedIn
            </h2>

            <p className="text-gray-700">
              LinkedIn is one of the most powerful platforms for job searching and networking.
              You can apply for jobs, connect with recruiters, and discover opportunities shared by companies.
            </p>

          </section>


          <section id="naukri" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Naukri
            </h2>

            <p className="text-gray-700">
              Naukri is one of the largest job portals in India with a wide range of opportunities
              for freshers and experienced professionals.
            </p>

          </section>


          <section id="indeed" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Indeed
            </h2>

            <p className="text-gray-700">
              Indeed aggregates job listings from multiple sources, making it easier to find opportunities
              across different companies and industries.
            </p>

          </section>


          <section id="glassdoor" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Glassdoor
            </h2>

            <p className="text-gray-700">
              Glassdoor provides job listings along with company reviews, helping candidates understand
              company culture and salary expectations.
            </p>

          </section>


          <section id="company-careers" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Company Career Pages
            </h2>

            <p className="text-gray-700">
              Applying directly through company career pages can sometimes increase your chances,
              as fewer candidates apply compared to large job portals.
            </p>

          </section>


          <section id="tools" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Use Tools to Improve Job Applications
            </h2>

            <p className="text-gray-700">
              Tools like HireLift can help you optimize your resume for ATS systems, tailor it for job descriptions,
              apply to fresh job opportunities, and reach out to recruiters directly using outreach templates,
              increasing your chances of getting interview calls.
            </p>

          </section>


          <section id="checklist" className="mb-12">

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Job Application Platform Checklist
            </h2>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">

              <ul className="space-y-2 text-gray-700">

                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Use multiple job platforms</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Apply early to new job postings</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Tailor resume for each job</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Optimize resume for ATS</li>
                <li className="flex items-center gap-2"><FaCheckCircle className="text-green-600"/> Reach out to recruiters directly</li>

              </ul>

            </div>


            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl p-8 mt-8">

              <h3 className="text-2xl font-bold mb-4">
                Improve Your Job Applications
              </h3>

              <p className="text-lg mb-6">
                Use HireLift to optimize your resume, tailor it for job descriptions,
                discover fresh job opportunities, and connect with recruiters more efficiently.
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
        currentSlug="best-websites-to-apply-for-jobs-2026"
        category="Job Search Strategy"
      />

    </div>
  );
}