'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaArrowRight, FaBookOpen, FaLightbulb } from 'react-icons/fa';

export default function RelatedArticles({ currentSlug, category }) {
  const allArticles = [
    {
      slug: "ats-resume-optimization-guide-india-2024",
      title: "Complete ATS Resume Optimization Guide for India 2024",
      category: "ATS Resume",
      readTime: "12 min read",
      description: "Master ATS resume optimization with 95% success rate"
    },
    {
      slug: "cold-email-templates-job-applications-india",
      title: "50+ Cold Email Templates for Job Applications in India",
      category: "Cold Email",
      readTime: "10 min read", 
      description: "Proven email templates with 75% response rate"
    },
    {
      slug: "hr-contacts-directory-guide-direct-hiring-managers",
      title: "How to Find HR Contacts in Indian Companies",
      category: "HR Networking",
      readTime: "8 min read",
      description: "Direct access to hiring managers and recruiters"
    },
    {
      slug: "job-search-strategy-mumbai-delhi-bangalore",
      title: "City-Wise Job Search Strategy for Indian Markets",
      category: "Location Guide", 
      readTime: "15 min read",
      description: "Tailored strategies for Mumbai, Delhi, and Bangalore"
    },
    {
      slug: "fresher-job-search-guide-india-2024",
      title: "Complete Fresher Job Search Guide for India",
      category: "Freshers",
      readTime: "18 min read",
      description: "Land your first job with proven strategies"
    },
    {
      slug: "linkedin-optimization-indian-job-seekers",
      title: "LinkedIn Profile Optimization for Indian Job Seekers",
      category: "LinkedIn",
      readTime: "14 min read",
      description: "Attract recruiters with optimized LinkedIn profile"
    }
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
            <span className="text-blue-700 font-semibold">Keep Learning</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Related Job Search Articles
          </h2>
          <p className="text-gray-600">
            Continue your job search education with these expert guides
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
            Ready to Put Learning into Action?
          </h3>
          <p className="text-lg mb-6 opacity-90">
            Start optimizing your job search with HireLift's free tools
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/audit"
              className="px-8 py-3 bg-white text-green-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Free Resume Audit
            </Link>
            <Link
              href="/playground"
              className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
            >
              Browse Email Templates
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
