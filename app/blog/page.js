'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaClock, FaUser, FaTag, FaArrowRight } from 'react-icons/fa';
import { usePageLoading } from '@/hooks/usePageLoading';
import { getAllBlogPosts, getPostsByCategory } from '../../data/blogPosts';
import Header from '../../components/Header';
import Head from 'next/head';

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { navigateWithLoading } = usePageLoading();
  const allPosts = getAllBlogPosts();
  const displayedPosts = getPostsByCategory(selectedCategory);
  
  const categories = ["All", "Resume Optimization", "Remote Work", "AI Career Tools", "Global Job Search", "Interview Mastery", "Salary Negotiation", "Career Development", "Tech Careers", "Leadership", "Networking"];

  return (
    <>
      {/* Enhanced SEO for Global Blog */}
      <Head>
        <title>Global Career Blog - Expert Job Search Tips & Resume Optimization | HireLift</title>
        <meta name="description" content="Expert career advice for global professionals. Learn AI resume optimization, remote work strategies, international job search tips, and career development insights from industry leaders worldwide." />
        <meta name="keywords" content="global career blog, international job search, remote work tips, AI resume optimization, career development worldwide, global job market trends, international career advice, remote job search strategies, global networking tips, career growth insights" />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        
        {/* Blog-specific Open Graph */}
        <meta property="og:title" content="Global Career Blog - Expert Job Search & Career Development Tips" />
        <meta property="og:description" content="Expert career advice for global professionals. AI resume optimization, remote work strategies, international job search tips from industry leaders worldwide." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hirelift.vercel.app/blog" />
        <meta property="og:image" content="https://hirelift.vercel.app/og-blog.jpg" />
        
        {/* Blog Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Blog",
              "name": "HireLift Global Career Blog",
              "url": "https://hirelift.vercel.app/blog",
              "description": "Expert career advice and job search strategies for global professionals",
              "inLanguage": "en-US",
              "publisher": {
                "@type": "Organization",
                "name": "HireLift",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://hirelift.vercel.app/logo.png"
                }
              },
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": "https://hirelift.vercel.app/blog"
              }
            })
          }}
        />
        
        {/* Breadcrumb Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://hirelift.vercel.app"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Blog",
                  "item": "https://hirelift.vercel.app/blog"
                }
              ]
            })
          }}
        />
      </Head>
      
      <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Clean Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-gradient-to-bl from-cyan-100/30 to-transparent rounded-full"></div>
        <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-gradient-to-tr from-cyan-100/30 to-transparent rounded-full"></div>
      </div>
      <Header variant="blog" />
      
      {/* Hero Section */}
      <section className="py-20 px-6 mt-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Global Career Insights & Job Search Mastery
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Expert career guidance for ambitious professionals worldwide. Master AI resume optimization, 
              remote work strategies, global networking, and cutting-edge job search techniques that work across international markets.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 border rounded-full transition-colors ${
                    selectedCategory === category
                      ? 'bg-cyan-600 text-white border-cyan-600'
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-cyan-50 hover:border-cyan-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Featured Posts */}
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {displayedPosts.filter(post => post.featured).map((post, index) => (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden group"
              >
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full text-sm font-semibold">
                      {post.category}
                    </span>
                    <span className="text-gray-500 text-sm">Featured</span>
                  </div>
                  
                  <h2 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-cyan-600 transition-colors">
                    {post.title}
                  </h2>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <FaUser className="w-3 h-3" />
                        {post.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaClock className="w-3 h-3" />
                        {post.readTime}
                      </span>
                    </div>
                    <span>{post.publishDate}</span>
                  </div>
                  
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 text-cyan-600 font-semibold hover:text-cyan-700 transition-colors"
                  >
                    Read Full Article
                    <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>

          {/* All Posts */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedPosts.filter(post => !post.featured).map((post, index) => (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (index + 3) * 0.1 }}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden group"
              >
                <div className="p-6">
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-semibold mb-3 inline-block">
                    {post.category}
                  </span>
                  
                  <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-cyan-600 transition-colors">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                      <FaClock className="w-3 h-3" />
                      {post.readTime}
                    </span>
                    <span>{post.publishDate}</span>
                  </div>
                  
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 text-cyan-600 font-semibold hover:text-cyan-700 transition-colors"
                  >
                    Read Full Article
                    <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Newsletter Signup */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-20 text-center p-8 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl text-white"
          >
            <h3 className="text-2xl font-bold mb-4">
              Get Weekly Global Career Insights & Industry Intelligence
            </h3>
            <p className="text-lg mb-6 opacity-90">
              Join 50,000+ global professionals receiving expert career strategies, remote work tips, and international job market insights
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-3 rounded-lg flex-1 text-white border border-white bg-white/20 placeholder-white focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="px-6 py-3 bg-white text-cyan-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors">
                Subscribe Free
              </button>
            </div>
          </motion.div>
        </div>
      </section>
      </div>
    </>
  );
}
