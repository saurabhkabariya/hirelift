'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaArrowRight, FaBookOpen, FaLightbulb } from 'react-icons/fa';

export default function RelatedArticles({ currentSlug, category }) {
  const allArticles = [
    {
      slug: "software-engineer-interview-questions-2025",
      title: "Software Engineer Interview Questions 2025: Complete FAANG Guide",
      category: "Interview Prep",
      readTime: "22 min read",
      description: "150+ questions, system design patterns, and insider tips for $200K+ offers"
    },
    {
      slug: "entry-level-software-engineer-jobs-2025",
      title: "Entry-Level Software Engineer Jobs 2025: Fresh Graduate Guide",
      category: "Entry-Level Jobs",
      readTime: "18 min read",
      description: "Land your first tech job with proven strategies and salary insights"
    },
    {
      slug: "remote-developer-jobs-2025",
      title: "Remote Developer Jobs 2025: $100K-$200K Opportunities",
      category: "Remote Work",
      readTime: "20 min read",
      description: "Discover 500+ companies hiring remote developers worldwide"
    },
    {
      slug: "tech-resume-us-uk-2025",
      title: "Tech Resume for US & UK Markets 2025: ATS-Optimized Format",
      category: "Resume Optimization",
      readTime: "16 min read",
      description: "Perfect resume format with keywords that get interviews"
    },
    {
      slug: "ai-ml-engineer-career-guide-2025",
      title: "AI/ML Engineer Career Guide 2025: $150K-$350K Salaries",
      category: "AI/ML Careers",
      readTime: "19 min read",
      description: "Complete guide to AI careers, skills roadmap, and top companies"
    },
    {
      slug: "why-your-resume-gets-rejected-in-6-seconds",
      title: "Why Your Resume Gets Rejected in 6 Seconds (And How to Fix It)",
      category: "Resume Optimization",
      readTime: "8 min read",
      description: "Learn why most resumes get rejected in seconds due to ATS filters and how to optimize your resume with the right keywords, formatting, and strategies to get more interview calls.",
    },
    {
      slug: "how-to-tailor-your-resume-to-a-job-description",
      title: "How to Tailor Your Resume to a Job Description (Step-by-Step)",
      category: "Resume Optimization",
      readTime: "8 min read",
      description: "Learn how to tailor your resume to a job description step-by-step. Discover how to identify keywords, match skills, and optimize your resume to pass ATS systems and increase interview chances.",
    },
    {
      slug: "10-resume-mistakes-freshers-make-that-kill-interview-chances",
      title: "10 Resume Mistakes Freshers Make That Kill Interview Chances",
      category: "Resume Optimization",
      readTime: "9 min read",
      description: "Discover the most common resume mistakes freshers make that prevent interview calls. Learn how ATS filters work, how to optimize resumes, and how to avoid job application mistakes.",
    },
    {
      slug: "how-to-make-resume-ats-friendly-2026",
      title: "How to Make Your Resume ATS Friendly in 2026",
      category: "Resume Optimization",
      readTime: "8 min read",
      description: "Learn how to make your resume ATS friendly in 2026. Discover keyword optimization strategies, ATS-friendly formatting tips, and resume optimization techniques to pass applicant tracking systems.",
    },
    {
      slug: "resume-checklist-before-applying-to-any-job",
      title: "Resume Checklist Before Applying to Any Job",
      category: "Resume Optimization",
      readTime: "7 min read",
      description: "Use this resume checklist before applying to any job. Learn how to optimize keywords, use ATS friendly formatting, tailor resumes for job descriptions, and apply early to increase interview chances.",
    },
    {
      slug: "how-to-improve-resume-score-quickly",
      title: "How to Improve Your Resume Score Quickly",
      category: "Resume Optimization",
      readTime: "7 min read",
      description: "Learn how to improve your resume score quickly by optimizing keywords, using ATS friendly formats, tailoring resumes to job descriptions, and using tools like HireLift to save time.",
    },
    {
      slug: "best-resume-format-software-developers-ats-friendly",
      title: "Best Resume Format for Software Developers (ATS Friendly)",
      category: "Resume Optimization",
      readTime: "8 min read",
      description: "Learn the best ATS friendly resume format for software developers. Discover keyword optimization tips, necessary resume sections, and how tools like HireLift can help improve your resume.",
    },

  ];

  // Filter out current article and show related articles
  const relatedArticles = allArticles
    .filter(article => article.slug !== currentSlug)
    .filter(article => category ? article.category === category : true)
    .slice(0, 3);

  // If we don't have enough from same category, fill with others
  if (relatedArticles.length < 3) {
    const additionalArticles = allArticles
      .filter(article => article.slug !== currentSlug)
      .filter(article => !relatedArticles.some(rel => rel.slug === article.slug))
      .slice(0, 3 - relatedArticles.length);
    
    relatedArticles.push(...additionalArticles);
  }

  if (relatedArticles.length === 0) return null;

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-full mb-6">
            <FaLightbulb className="w-4 h-4 text-blue-600" />
            <span className="text-blue-700 font-semibold">Continue Reading</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Related Career Guides
          </h2>
          <p className="text-gray-600">
            Explore more expert insights to accelerate your tech career
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {relatedArticles.map((article, index) => (
            <motion.article
              key={article.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                    {article.category}
                  </span>
                  <span className="text-gray-500 text-sm">{article.readTime}</span>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-3">
                  {article.title}
                </h3>
                
                <p className="text-gray-600 mb-4 text-sm">
                  {article.description}
                </p>
                
                <Link
                  href={`/blog/${article.slug}`}
                  className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors group"
                >
                  <FaBookOpen className="w-4 h-4" />
                  Read Article
                  <FaArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center p-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl text-white"
        >
          <h3 className="text-2xl font-bold mb-4">
            Ready to Accelerate Your Career?
          </h3>
          <p className="text-lg mb-6 opacity-90">
            Use HireLift's free tools to optimize your job search and land interviews faster
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/audit"
              className="px-8 py-3 bg-white text-green-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors shadow-lg"
            >
              Free ATS Resume Check
            </Link>
            <Link
              href="/referrals"
              className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
            >
              Get Employee Referrals
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
