'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaClock, FaUser, FaShare, FaBookmark, FaCheckCircle, FaArrowLeft } from 'react-icons/fa';
import RelatedArticles from '@/components/RelatedArticles';

export default function ATSResumeGuide() {
  const tableOfContents = [
    { id: "what-is-ats", title: "What is ATS and Why It Matters in India" },
    { id: "ats-statistics", title: "ATS Usage Statistics in Indian Companies" },
    { id: "resume-format", title: "ATS-Friendly Resume Format" },
    { id: "keyword-optimization", title: "Keyword Optimization Strategies" },
    { id: "common-mistakes", title: "Common ATS Resume Mistakes to Avoid" },
    { id: "testing-tools", title: "Free ATS Testing Tools" },
    { id: "industry-specific", title: "Industry-Specific ATS Tips" },
    { id: "next-steps", title: "Next Steps After ATS Optimization" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link 
            href="/blog"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <FaArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </div>
      </nav>

      <article className="max-w-4xl mx-auto px-6 py-12">
        {/* Article Header */}
        <motion.header
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
              ATS Resume Guide
            </span>
            <span className="text-gray-500">Featured Article</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Complete ATS Resume Optimization Guide for India 2025
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Master ATS resume optimization with our comprehensive guide. Learn how to format your resume, 
            choose the right keywords, and pass through Indian company ATS systems with 95% success rate.
          </p>
          
          <div className="flex items-center justify-between flex-wrap gap-4 p-6 bg-white rounded-xl border">
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <span className="flex items-center gap-2">
                <FaUser className="w-4 h-4" />
                HireLift Team
              </span>
              <span className="flex items-center gap-2">
                <FaClock className="w-4 h-4" />
                12 min read
              </span>
              <span>August 25, 2025</span>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <FaShare className="w-4 h-4" />
                Share
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <FaBookmark className="w-4 h-4" />
                Save
              </button>
            </div>
          </div>
        </motion.header>

        {/* Table of Contents */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12 p-6 bg-blue-50 rounded-xl border border-blue-100"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">Table of Contents</h2>
          <ul className="space-y-2">
            {tableOfContents.map((item, index) => (
              <li key={item.id}>
                <a 
                  href={`#${item.id}`}
                  className="text-blue-600 hover:text-blue-700 hover:underline"
                >
                  {index + 1}. {item.title}
                </a>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Article Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="prose prose-lg max-w-none"
        >
          <section id="what-is-ats" className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">What is ATS and Why It Matters in India</h2>
            <p className="text-gray-700 mb-4">
              Applicant Tracking System (ATS) is software used by companies to manage job applications. 
              In India, over 95% of large companies and 70% of mid-size companies use ATS to screen resumes 
              before they reach human recruiters.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
              <h3 className="font-bold text-gray-900 mb-2">Key Fact:</h3>
              <p className="text-gray-700">
                75% of resumes are rejected by ATS before any human sees them. This means your resume 
                formatting and keywords are more important than your actual experience!
              </p>
            </div>
          </section>

          <section id="ats-statistics" className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">ATS Usage Statistics in Indian Companies</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white border rounded-lg p-6">
                <h3 className="font-bold text-2xl text-blue-600 mb-2">95%</h3>
                <p className="text-gray-700">Fortune 500 companies in India use ATS</p>
              </div>
              <div className="bg-white border rounded-lg p-6">
                <h3 className="font-bold text-2xl text-green-600 mb-2">70%</h3>
                <p className="text-gray-700">Mid-size companies (100-500 employees)</p>
              </div>
              <div className="bg-white border rounded-lg p-6">
                <h3 className="font-bold text-2xl text-purple-600 mb-2">40%</h3>
                <p className="text-gray-700">Small companies (50-100 employees)</p>
              </div>
              <div className="bg-white border rounded-lg p-6">
                <h3 className="font-bold text-2xl text-red-600 mb-2">6 seconds</h3>
                <p className="text-gray-700">Average time ATS spends on each resume</p>
              </div>
            </div>
          </section>

          <section id="resume-format" className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">ATS-Friendly Resume Format</h2>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <h3 className="font-bold text-green-800 mb-4 flex items-center gap-2">
                <FaCheckCircle className="w-5 h-5" />
                Do's for ATS Resume Format
              </h3>
              <ul className="space-y-2 text-green-700">
                <li>• Use standard fonts: Arial, Calibri, or Times New Roman</li>
                <li>• Save as .docx or .pdf (check job posting preference)</li>
                <li>• Use standard section headings: Experience, Education, Skills</li>
                <li>• Keep formatting simple - no tables, text boxes, or graphics</li>
                <li>• Use bullet points for achievements</li>
                <li>• Include contact information in text format</li>
              </ul>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
              <h3 className="font-bold text-red-800 mb-4">Don'ts for ATS Resume Format</h3>
              <ul className="space-y-2 text-red-700">
                <li>• Don't use creative templates with graphics</li>
                <li>• Don't put important information in headers/footers</li>
                <li>• Don't use tables or columns for layout</li>
                <li>• Don't use images or logos</li>
                <li>• Don't use unconventional fonts or colors</li>
                <li>• Don't save as .jpg, .png, or .txt</li>
              </ul>
            </div>
          </section>

          <section id="keyword-optimization" className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Keyword Optimization Strategies</h2>
            <p className="text-gray-700 mb-6">
              Keywords are the most critical factor for ATS success. Here's how to optimize your resume keywords 
              for Indian job market:
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h3 className="font-bold text-blue-800 mb-4">Step-by-Step Keyword Process:</h3>
              <ol className="space-y-3 text-blue-700">
                <li>1. <strong>Analyze Job Descriptions:</strong> Copy 5-10 similar job postings and identify repeated keywords</li>
                <li>2. <strong>Use Exact Match:</strong> Use the exact phrases from job descriptions (e.g., "Project Management" not "Managing Projects")</li>
                <li>3. <strong>Include Variations:</strong> Add both acronyms and full forms (e.g., "SEO" and "Search Engine Optimization")</li>
                <li>4. <strong>Context Matters:</strong> Place keywords in context, not as random lists</li>
                <li>5. <strong>Test Your Resume:</strong> Use HireLift's free ATS checker to verify keyword optimization</li>
              </ol>
            </div>
          </section>

          <section id="common-mistakes" className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Common ATS Resume Mistakes to Avoid</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-red-500 pl-6">
                <h3 className="font-bold text-gray-900 mb-2">1. Using Creative Templates</h3>
                <p className="text-gray-700">
                  90% of creative resume templates fail ATS parsing. Stick to simple, text-based formats.
                </p>
              </div>
              <div className="border-l-4 border-red-500 pl-6">
                <h3 className="font-bold text-gray-900 mb-2">2. Wrong File Format</h3>
                <p className="text-gray-700">
                  Always check job posting requirements. When in doubt, use .docx format.
                </p>
              </div>
              <div className="border-l-4 border-red-500 pl-6">
                <h3 className="font-bold text-gray-900 mb-2">3. Missing Keywords</h3>
                <p className="text-gray-700">
                  Not matching job description keywords is the #1 reason for ATS rejection.
                </p>
              </div>
            </div>
          </section>

          <section id="testing-tools" className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Free ATS Testing Tools</h2>
            <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl p-8 mb-6">
              <h3 className="text-2xl font-bold mb-4">🚀 Test Your Resume Now!</h3>
              <p className="text-lg mb-6">
                Use HireLift's free ATS checker to analyze your resume and get instant feedback on:
              </p>
              <ul className="space-y-2 mb-6">
                <li>• ATS compatibility score</li>
                <li>• Keyword optimization analysis</li>
                <li>• Format and structure review</li>
                <li>• Improvement recommendations</li>
              </ul>
              <Link 
                href="/audit"
                className="inline-block px-8 py-3 bg-white text-green-600 font-bold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Get Free ATS Analysis →
              </Link>
            </div>
          </section>

          <section id="next-steps" className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Next Steps After ATS Optimization</h2>
            <p className="text-gray-700 mb-6">
              Once your resume passes ATS, focus on these strategies to maximize your job search success:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white border rounded-lg p-6">
                <h3 className="font-bold text-gray-900 mb-3">Direct HR Outreach</h3>
                <p className="text-gray-700 mb-4">
                  Skip job portals and reach hiring managers directly using HireLift's HR directory.
                </p>
                <Link href="/company-search" className="text-blue-600 hover:underline">
                  Access HR Directory →
                </Link>
              </div>
              <div className="bg-white border rounded-lg p-6">
                <h3 className="font-bold text-gray-900 mb-3">Cold Email Templates</h3>
                <p className="text-gray-700 mb-4">
                  Use proven email templates to get 75% response rate from Indian recruiters.
                </p>
                <Link href="/playground" className="text-blue-600 hover:underline">
                  Browse Templates →
                </Link>
              </div>
            </div>
          </section>
        </motion.div>

        {/* Author Bio */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 p-8 bg-white rounded-xl border"
        >
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <FaUser className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">HireLift Team</h3>
              <p className="text-gray-600 mb-4">
                Career experts helping 10,000+ Indian job seekers land their dream jobs through 
                ATS optimization, direct HR networking, and proven job search strategies.
              </p>
              <div className="flex gap-4">
                <Link href="/blog" className="text-blue-600 hover:underline">
                  More Articles
                </Link>
                <Link href="/audit" className="text-green-600 hover:underline">
                  Free Resume Review
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </article>

      {/* Related Articles Section */}
      <RelatedArticles currentSlug="ats-resume-optimization-guide-india-2025" category="ATS Resume" />
    </div>
  );
}
