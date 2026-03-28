'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaClock, FaUser, FaTag, FaArrowRight, FaSearch, FaFilter, 
  FaShare, FaBookmark, FaGlobe, FaRss, FaChartLine, FaLock,
  FaDownload, FaCheck, FaStar, FaEye
} from 'react-icons/fa';
import { usePageLoading } from '@/hooks/usePageLoading';
import { useAuth } from '@/contexts/AuthContext';
import { getAllBlogPosts } from '../../data/blogPosts';
import Header from '../../components/Header';

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [bookmarkedPosts, setBookmarkedPosts] = useState(new Set());
  const { navigateWithLoading, stopLoading } = usePageLoading();
  const { user } = useAuth();
  const router = useRouter();
  
  // Ensure loading stops when component mounts (fallback safety)
  useEffect(() => {
    const timer = setTimeout(() => {
      stopLoading();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [stopLoading]);
  
  const POSTS_PER_PAGE = 9;

  // Auto-include every post defined in the central data source.
  const allPosts = getAllBlogPosts();
  
  // Get unique categories from available posts
  const availableCategories = ['All', ...new Set(allPosts.map(post => post.category))];
  
  const categories = availableCategories;

  // Advanced filtering and search
  const filteredPosts = useMemo(() => {
    let filtered = [];
    
    if (selectedCategory === 'All') {
      filtered = allPosts;
    } else {
      // Filter by selected category
      filtered = allPosts.filter(post => post.category === selectedCategory);
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.content?.toLowerCase().includes(query) ||
        post.author.toLowerCase().includes(query) ||
        post.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Enhanced sorting
    switch (sortBy) {
      case 'oldest':
        filtered.sort((a, b) => new Date(a.publishDate) - new Date(b.publishDate));
        break;
      case 'popular':
        filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      case 'featured':
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
    }
    
    return filtered;
  }, [selectedCategory, searchQuery, sortBy, allPosts]);

  // Bookmark functionality
  const toggleBookmark = (postSlug) => {
    const newBookmarks = new Set(bookmarkedPosts);
    if (newBookmarks.has(postSlug)) {
      newBookmarks.delete(postSlug);
    } else {
      newBookmarks.add(postSlug);
    }
    setBookmarkedPosts(newBookmarks);
    
    // Save to localStorage
    localStorage.setItem('bookmarkedPosts', JSON.stringify([...newBookmarks]));
  };

  // Load bookmarks from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('bookmarkedPosts');
    if (saved) {
      setBookmarkedPosts(new Set(JSON.parse(saved)));
    }
  }, []);

  // Share functionality
  const sharePost = async (post) => {
    const shareData = {
      title: post.title,
      text: post.excerpt,
      url: `${window.location.origin}/blog/${post.slug}`
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        // Fall back to copying to clipboard
        await navigator.clipboard.writeText(shareData.url);
        alert('Link copied to clipboard!');
      }
    } else {
      // Fall back to copying to clipboard
      await navigator.clipboard.writeText(shareData.url);
      alert('Link copied to clipboard!');
    }
  };

  // Navigation functions for premium features
  const handleResumeReview = () => {
    navigateWithLoading('/audit');
  };

  const handleCareerTools = () => {
    navigateWithLoading('/');
  };

  const handleGetFreeAccess = () => {
    navigateWithLoading('/auth');
  };

  // Show all posts in a single grid (no separation between featured and non-featured)
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const displayedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery, sortBy]);

  return (
    <>
      {/* Enhanced JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "HireLift Global Career Blog",
            "description": "Expert career advice and job search strategies for global professionals, with focus on US, UK, and international job markets",
            "url": `${ 'https://www.hirelift.tech'}/blog`,
            "inLanguage": ["en-US", "en-GB"],
            "audience": {
              "@type": "Audience",
              "audienceType": "Global Professionals, Job Seekers, Career Changers"
            },
            "publisher": {
              "@type": "Organization",
              "name": "HireLift",
              "url": "https://www.hirelift.tech",
              "logo": {
                "@type": "ImageObject",
                "url": `${ 'https://www.hirelift.tech'}/logo.png`,
                "width": 512,
                "height": 512
              },
              "sameAs": [
                "https://twitter.com/hirelift",
                "https://linkedin.com/company/hirelift"
              ]
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `${ 'https://www.hirelift.tech'}/blog`
            },
            "potentialAction": {
              "@type": "SearchAction",
              "target": `${ 'https://www.hirelift.tech'}/blog?search={search_term_string}`,
              "query-input": "required name=search_term_string"
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
                "item": "https://www.hirelift.tech"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Global Career Blog",
                "item": `${ 'https://www.hirelift.tech'}/blog`
              }
            ]
          })
        }}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
        {/* Enhanced Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 right-0 w-96 h-96 bg-gradient-to-bl from-blue-100/40 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-gradient-to-tr from-cyan-100/40 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-50/30 to-cyan-50/30 rounded-full blur-3xl"></div>
        </div>
        
        <Header variant="blog" />
         
        {/* Enhanced Hero Section */}
        <section className="py-12 px-6 mt-12">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              {/* Global Professional Badge */}
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-2 rounded-full text-sm font-semibold mb-6">
                <FaGlobe className="w-4 h-4" />
                Trusted by 5,000+ Global Professionals
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent mb-8 leading-tight">
                Master Your Global Career Journey
              </h1>
              
              <p className="text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto mb-12 leading-relaxed">
                Expert career strategies for ambitious professionals in <strong className="text-blue-600">US, UK, and global markets</strong>. 
                Master AI resume optimization, remote work excellence, and proven job search techniques that deliver results.
              </p>

              {/* Key Benefits */}
              <div className="flex flex-wrap justify-center gap-6 mb-12">
                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
                  <FaChartLine className="w-4 h-4 text-green-600" />
                  <span className="font-semibold text-slate-700">3x Job Success Rate</span>
                </div>
                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
                  <FaGlobe className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold text-slate-700">Global Market Insights</span>
                </div>
                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
                  <FaUser className="w-4 h-4 text-purple-600" />
                  <span className="font-semibold text-slate-700">Expert-Verified Tips</span>
                </div>
              </div>
            </motion.div>

            {/* Enhanced Search and Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 mb-16 border border-white/20"
            >
              {/* Search Bar */}
              <div className="relative mb-6">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search career insights, resume tips, job strategies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-lg transition-all"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Categories */}
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-full transition-all text-sm font-medium ${
                          selectedCategory === category
                            ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg scale-105'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-blue-50 hover:border-blue-200'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort Options */}
                <div className="flex items-center gap-4">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="newest">Latest Posts</option>
                    <option value="oldest">Oldest First</option>
                    <option value="popular">Most Popular</option>
                    <option value="featured">Featured Content</option>
                  </select>
                  
                  <Link
                    href="/blog/feed.xml"
                    className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    <FaRss className="w-4 h-4" />
                    RSS
                  </Link>
                </div>
              </div>

              {/* Results Info */}
              <div className="mt-4 text-slate-600">
                Showing <strong>{filteredPosts.length}</strong> of <strong>{allPosts.length}</strong> articles
                {searchQuery && (
                  <span> for "<strong>{searchQuery}</strong>"</span>
                )}
                {selectedCategory !== 'All' && (
                  <span> in <strong>{selectedCategory}</strong></span>
                )}
              </div>
            </motion.div>

        {/* Enhanced Premium Access Section */}
        <motion.div
          className="bg-gradient-to-br from-blue-600 to-purple-700 text-white rounded-2xl p-8 mb-12 shadow-2xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left">
              <h3 className="text-2xl font-bold mb-3">
                {user ? 'Welcome back to HireLift Premium!' : 'Unlock Your Career Potential'}
              </h3>
              <p className="text-blue-100 text-lg mb-4">
                {user 
                  ? 'Access your premium career resources and personalized features'
                  : 'Get access to premium career tools, resume reviews, and exclusive content'
                }
              </p>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <div className="flex items-center gap-2 text-blue-100">
                  <FaCheck className="text-green-300" />
                  <span>Free AI Resume Review</span>
                </div>
                <div className="flex items-center gap-2 text-blue-100">
                  <FaCheck className="text-green-300" />
                  <span>Career Assessment Tools</span>
                </div>
                <div className="flex items-center gap-2 text-blue-100">
                  <FaCheck className="text-green-300" />
                  <span>Interview Preparation</span>
                </div>
                <div className="flex items-center gap-2 text-blue-100">
                  <FaCheck className="text-green-300" />
                  <span>Exclusive Content</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-3">
              {user ? (
                <>
                  <motion.button
                    onClick={handleResumeReview}
                    className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors duration-300 flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaDownload />
                    Resume Review
                  </motion.button>
                  <motion.button
                    onClick={handleCareerTools}
                    className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-300 flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaStar />
                    Career Tools
                  </motion.button>
                </>
              ) : (
                <>
                  <motion.button
                    onClick={handleGetFreeAccess}
                    className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition-colors duration-300 flex items-center gap-2 text-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaLock />
                    Get Free Access
                  </motion.button>
                  <p className="text-center text-blue-100 text-sm">
                    No credit card required • Instant access
                  </p>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* Professional Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 text-center shadow-lg border border-white/20">
            <div className="text-3xl font-bold text-blue-600 mb-2">{allPosts.length}</div>
            <div className="text-slate-600 font-medium">Expert Guides</div>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 text-center shadow-lg border border-white/20">
            <div className="text-3xl font-bold text-green-600 mb-2">5K+</div>
            <div className="text-slate-600 font-medium">Success Stories</div>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 text-center shadow-lg border border-white/20">
            <div className="text-3xl font-bold text-purple-600 mb-2">95%</div>
            <div className="text-slate-600 font-medium">Success Rate</div>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 text-center shadow-lg border border-white/20">
            <div className="text-3xl font-bold text-orange-600 mb-2">200+</div>
            <div className="text-slate-600 font-medium">Countries</div>
          </div>
        </motion.div>

            {/* Expert Career Guides Grid */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-4"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-slate-800">
                  Expert Career Guides
                </h2>
                {totalPages > 1 && (
                  <div className="text-slate-600">
                    Page {currentPage} of {totalPages}
                  </div>
                )}
              </div>
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${selectedCategory}-${searchQuery}-${sortBy}-${currentPage}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                  {displayedPosts.map((post, index) => (
                    <motion.article
                      key={post.slug}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100 hover:border-blue-200"
                    >
                      {post.featured && (
                        <div className="absolute top-4 right-4 z-10">
                          <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg">
                            Featured
                          </span>
                        </div>
                      )}
                      <div className={`p-6 ${post.featured ? 'pt-12' : ''}`}>
                        <div className="flex items-center justify-between mb-4">
                          <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-semibold">
                            {post.category}
                          </span>
                          <span className="text-slate-500 text-sm flex items-center gap-1">
                            <FaClock className="w-3 h-3" />
                            {post.readTime}
                          </span>
                        </div>
                        
                        <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors leading-tight">
                          {post.title}
                        </h3>
                        
                        <p className="text-slate-600 mb-4 text-sm leading-relaxed line-clamp-3">
                          {post.excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-gradient-to-r from-slate-400 to-slate-600 rounded-full flex items-center justify-center">
                              <FaUser className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-sm text-slate-600">{post.author}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => toggleBookmark(post.slug)}
                              className={`p-1 transition-colors ${
                                bookmarkedPosts.has(post.slug) 
                                  ? 'text-red-500 hover:text-red-600' 
                                  : 'text-slate-400 hover:text-red-500'
                              }`}
                            >
                              <FaBookmark className="w-3 h-3" />
                            </button>
                            <button 
                              onClick={() => sharePost(post)}
                              className="p-1 text-slate-400 hover:text-blue-500 transition-colors"
                            >
                              <FaShare className="w-3 h-3" />
                            </button>
                            <span className="text-xs text-slate-500">{post.publishDate}</span>
                          </div>
                        </div>
                        
                        <Link
                          href={`/blog/${post.slug}`}
                          className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors group"
                        >
                          Read More
                          <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </motion.article>
                  ))}
                </motion.div>
              </AnimatePresence>

              {/* No Results State */}
              {filteredPosts.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-16"
                >
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">No articles found</h3>
                  <p className="text-slate-600 mb-6">
                    Try adjusting your search terms or browse our categories
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All');
                    }}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Clear Filters
                  </button>
                </motion.div>
              )}
            </motion.div>

            {/* Enhanced Pagination */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex justify-center items-center gap-4"
              >
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                
                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-lg transition-colors ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'border border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </motion.div>
            )}

          </div>
        </section>
      </div>
    </>
  );
}
