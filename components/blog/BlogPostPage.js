'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  FaClock, FaUser, FaTag, FaArrowLeft, FaTwitter, FaLinkedin, FaFacebook, 
  FaShare, FaBookmark, FaPrint, FaEnvelope, FaQuote, FaGlobe, FaChartLine
} from 'react-icons/fa';
import { usePageLoading } from '@/hooks/usePageLoading';
import { getAllBlogPosts } from '../../data/blogPosts';
import { getDetailedBlogContent } from '../../data/blogContent';
import { getSGEOptimizationData } from '../../data/blogSGEOptimization';
import BlogAnalytics from './BlogAnalytics';
import EnhancedBlogSchema from './EnhancedBlogSchema';
import EnhancedMarkdownRenderer from './EnhancedMarkdownRenderer';
import { QuickAnswer, FAQSection, KeyTakeaways, HowToSchema } from './SGEOptimizedBlog';
import Header from '../Header';

export default function BlogPostPage({ post }) {
  const { navigateWithLoading } = usePageLoading();
  const [readingProgress, setReadingProgress] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [estimatedReadTime, setEstimatedReadTime] = useState(post.readTime);
  
  const allPosts = getAllBlogPosts();
  const relatedPosts = allPosts
    .filter(p => p.slug !== post.slug && p.category === post.category)
    .slice(0, 3);
  
  const detailedContent = getDetailedBlogContent(post.slug);
  const contentToDisplay = detailedContent || post.content;
  
  // Get SGE optimization data for this blog post
  const sgeData = getSGEOptimizationData(post.slug);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = `${post.title} - Expert career insights from HireLift`;

  // Enhanced reading progress tracking
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setReadingProgress(Math.min(progress, 100));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Enhanced sharing with tracking
  const handleShare = (platform) => {
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}&via=hirelift`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      email: `mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent(`Check out this career insight: ${shareUrl}`)}`
    };
    
    if (urls[platform]) {
      if (platform === 'email') {
        window.location.href = urls[platform];
      } else {
        window.open(urls[platform], '_blank', 'width=600,height=400');
      }
      
      // Track sharing event (you can integrate with analytics)
      if (typeof gtag !== 'undefined') {
        gtag('event', 'share', {
          method: platform,
          content_type: 'blog_post',
          item_id: post.slug
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <div 
          className="h-full bg-gradient-to-r from-blue-600 to-cyan-600 transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <Header variant="blog" />
      <BlogAnalytics slug={post.slug} title={post.title} category={post.category} />
      <EnhancedBlogSchema 
        post={post} 
        faqs={sgeData?.faqs || []}
        howToSteps={sgeData?.howToSteps || []}
      />
      
      {/* Enhanced Header */}
      <section className="py-16 px-6 bg-white border-b mt-20 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-cyan-50/50"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl"></div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-sm text-slate-600 mb-8">
            <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-blue-600 transition-colors">Career Blog</Link>
            <span>/</span>
            <Link href={`/blog?category=${post.category}`} className="hover:text-blue-600 transition-colors">
              {post.category}
            </Link>
            <span>/</span>
            <span className="text-slate-400 truncate">{post.title}</span>
          </nav>

          <Link 
            href="/blog"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 transition-colors font-semibold"
          >
            <FaArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
                {post.category}
              </span>
              {post.tags.map((tag) => (
                <span key={tag} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                  #{tag}
                </span>
              ))}
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {post.excerpt}
            </p>
            
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <span className="flex items-center gap-2">
                  <FaUser className="w-4 h-4" />
                  {post.author}
                </span>
                <span className="flex items-center gap-2">
                  <FaClock className="w-4 h-4" />
                  {post.readTime}
                </span>
                <span>{post.publishDate}</span>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">Share:</span>
                <button
                  onClick={() => handleShare('twitter')}
                  className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                  title="Share on Twitter"
                >
                  <FaTwitter className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleShare('linkedin')}
                  className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                  title="Share on LinkedIn"
                >
                  <FaLinkedin className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleShare('facebook')}
                  className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                  title="Share on Facebook"
                >
                  <FaFacebook className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          {/* SGE Quick Answer - appears at top for featured snippets */}
          {sgeData?.quickAnswer && (
            <QuickAnswer 
              answer={sgeData.quickAnswer} 
              keypoints={sgeData.keyTakeaways?.slice(0, 3) || []}
            />
          )}

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-12"
          >
            {detailedContent ? (
              <EnhancedMarkdownRenderer content={detailedContent} />
            ) : (
              <div className="prose prose-lg max-w-none">
                <div className="text-gray-700 leading-relaxed space-y-6">
                  <p className="text-xl leading-relaxed text-gray-800">
                    {post.excerpt}
                  </p>
                  <div className="mt-8 p-6 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                    <p className="text-lg text-gray-700">
                      {contentToDisplay}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Key Takeaways Section - Easy for AI to parse */}
          {sgeData?.keyTakeaways && sgeData.keyTakeaways.length > 0 && (
            <KeyTakeaways takeaways={sgeData.keyTakeaways} />
          )}

          {/* FAQ Section - Optimized for SGE */}
          {sgeData?.faqs && sgeData.faqs.length > 0 && (
            <FAQSection faqs={sgeData.faqs} />
          )}

          {/* How To Steps Section - Great for AI understanding */}
          {sgeData?.howToSteps && sgeData.howToSteps.length > 0 && (
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="my-12 bg-white rounded-xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Step-by-Step Guide</h2>
              <p className="text-gray-600 mb-8">Follow these actionable steps to implement the strategies in this article</p>
              
              <div className="space-y-6">
                {sgeData.howToSteps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    className="flex gap-6 p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-100 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 text-white font-bold text-lg">
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h4>
                      <p className="text-gray-700 leading-relaxed">{step.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* HowTo Schema for AI parsing */}
              <script type="application/ld+json" suppressHydrationWarning>
                {JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "HowTo",
                  "name": post.title,
                  "description": post.excerpt,
                  "step": sgeData.howToSteps.map((step, idx) => ({
                    "@type": "HowToStep",
                    "position": idx + 1,
                    "name": step.title,
                    "text": step.description
                  }))
                })}
              </script>
            </motion.section>
          )}

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center mb-16"
          >
            <h3 className="text-2xl font-bold mb-4">
              Ready to Accelerate Your Job Search?
            </h3>
            <p className="text-lg mb-6 opacity-90">
              Get personalized job search guidance and access to our exclusive tools
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/audit"
                className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Try Free ATS Checker
              </Link>
              <Link
                href="/pricing"
                className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
              >
                View Pro Features
              </Link>
            </div>
          </motion.div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                Related Articles
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost, index) => (
                  <motion.article
                    key={relatedPost.slug}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden"
                  >
                    <div className="p-6">
                      <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-semibold mb-3 inline-block">
                        {relatedPost.category}
                      </span>
                      
                      <h4 className="text-lg font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                        <Link href={`/blog/${relatedPost.slug}`}>
                          {relatedPost.title}
                        </Link>
                      </h4>
                      
                      <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                        {relatedPost.excerpt.substring(0, 120)}...
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <FaClock className="w-3 h-3" />
                          {relatedPost.readTime}
                        </span>
                        <span>{relatedPost.publishDate}</span>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "description": post.excerpt,
            "author": {
              "@type": "Person",
              "name": post.author
            },
            "publisher": {
              "@type": "Organization",
              "name": "HireLift",
              "logo": {
                "@type": "ImageObject",
                "url": `${'https://www.hirelift.tech'}/logo.png`
              }
            },
            "datePublished": post.publishDate,
            "dateModified": post.publishDate,
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `${'https://www.hirelift.tech'}/blog/${post.slug}`
            },
            "keywords": post.keywords?.join(", "),
            "articleSection": post.category
          })
        }}
      />
    </div>
  );
}
