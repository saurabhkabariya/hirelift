"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import ApplyOverlay from "./ApplyOverlay.jsx";
import JobCard from "./JobCard.jsx";

export default function JobDetail({ job: initialJob, jobId }) {
  const router = useRouter();
  const [showApplyOverlay, setShowApplyOverlay] = useState(false);
  const [job, setJob] = useState(initialJob);
  const [loading, setLoading] = useState(!initialJob);
  const [error, setError] = useState(null);

  // Client-side job fetching if no job data provided
  useEffect(() => {
    if (!job && jobId) {
      const fetchJob = async () => {
        try {
          setLoading(true);
          const response = await fetch(`/api/jobs/${jobId}`);
          
          if (!response.ok) {
            if (response.status === 404) {
              notFound();
              return;
            }
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const data = await response.json();
          if (data.success) {
            setJob(data.data);
          } else {
            throw new Error(data.message || 'Failed to fetch job');
          }
        } catch (error) {
          console.error('Client-side job fetch failed:', error);
          setError(error.message);
          notFound();
        } finally {
          setLoading(false);
        }
      };

      fetchJob();
    }
  }, [job, jobId]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading job: {error}</p>
          <button 
            onClick={() => router.back()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // If still no job data, show not found
  if (!job) {
    notFound();
    return null;
  }

  const {
    _id,
    externalId,
    source,
    title,
    company,
    location,
    description,
    shortDescription,
    tags = [],
    jobType,
    workMode,
    experienceLevel,
    formattedSalary,
    daysAgo,
    companyLogo,
    isFeatured,
    createdAt,
    url,
    relatedJobs = [],
    viewCount
  } = job;

  // Format creation date if daysAgo is not available
  const getTimeAgo = () => {
    if (daysAgo && daysAgo !== 'undefined' && !isNaN(daysAgo)) {
      return daysAgo;
    }
    
    if (!createdAt) {
      return 'Recently';
    }
    
    try {
      const now = new Date();
      const posted = new Date(createdAt);
      
      // Check if the date is valid
      if (isNaN(posted.getTime())) {
        return 'Recently';
      }
      
      const diffTime = Math.abs(now - posted);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      const diffMinutes = Math.floor(diffTime / (1000 * 60));
      
      if (diffDays === 0) {
        if (diffHours === 0) {
          if (diffMinutes === 0) {
            return 'Just now';
          }
          return `${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} ago`;
        }
        return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
      }
      if (diffDays === 1) return '1 day ago';
      if (diffDays < 30) return `${diffDays} days ago`;
      if (diffDays < 365) {
        const diffMonths = Math.floor(diffDays / 30);
        return `${diffMonths} month${diffMonths === 1 ? '' : 's'} ago`;
      }
      const diffYears = Math.floor(diffDays / 365);
      return `${diffYears} year${diffYears === 1 ? '' : 's'} ago`;
    } catch (error) {
      console.error('Error calculating time ago:', error);
      return 'Recently';
    }
  };

  // Get currency symbol based on currency code
  const getCurrencySymbol = (currency = 'USD') => {
    const symbols = {
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'INR': '₹',
      'CAD': 'C$',
      'AUD': 'A$',
      'JPY': '¥',
      'CNY': '¥',
      'KRW': '₩',
      'SGD': 'S$',
      'CHF': 'CHF ',
      'SEK': 'kr ',
      'NOK': 'kr ',
      'DKK': 'kr ',
      'PLN': 'zł ',
      'CZK': 'Kč ',
      'HUF': 'Ft ',
      'RUB': '₽',
      'BRL': 'R$',
      'MXN': '$',
      'ZAR': 'R ',
      'TRY': '₺',
      'ILS': '₪'
    };
    return symbols[currency.toUpperCase()] || currency.toUpperCase() + ' ';
  };

  // Format salary or show default
  const getSalaryDisplay = () => {
    if (formattedSalary && formattedSalary !== 'Salary not specified') {
      return formattedSalary;
    }
    if (job.salaryRange?.min || job.salaryRange?.max) {
      const { min, max, currency = 'USD' } = job.salaryRange;
      const currencySymbol = getCurrencySymbol(currency);
      if (min && max) {
        return `${currencySymbol}${min.toLocaleString()} - ${currencySymbol}${max.toLocaleString()}`;
      } else if (min) {
        return `From ${currencySymbol}${min.toLocaleString()}`;
      } else if (max) {
        return `Up to ${currencySymbol}${max.toLocaleString()}`;
      }
    }
    return 'Competitive salary';
  };

  // Get source badge
  const getSourceBadge = () => {
    if (source === 'remoteok') {
      return {
        text: 'Remote Job',
        className: 'bg-green-100 text-green-700 border-green-200',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
          </svg>
        )
      };
    }
    return {
      text: 'HireLift Verified',
      className: 'bg-blue-100 text-blue-700 border-blue-200',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      )
    };
  };

  const sourceBadge = getSourceBadge();

  const handleApplyClick = () => {
    setShowApplyOverlay(true);
  };

  const handleDirectApply = () => {
    // Open the job URL in a new tab
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Clean HTML content for display
  const cleanDescription = (html) => {
    if (!html) return '';
    
    // First, fix character encoding issues
    let cleaned = html
      // Common UTF-8 encoding issues
      .replace(/ð/g, '👋')
      .replace(/â/g, "'")
      .replace(/â/g, "'")
      .replace(/â/g, '"')
      .replace(/â/g, '"')
      .replace(/â¢/g, '•')
      .replace(/â/g, '–')
      .replace(/â/g, '—')
      .replace(/â¦/g, '...')
      .replace(/Â/g, '')
      .replace(/â¬/g, '€')
      .replace(/Â£/g, '£')
      .replace(/Â¥/g, '¥')
      .replace(/â¹/g, '‹')
      .replace(/âº/g, '›')
      .replace(/â«/g, '«')
      .replace(/â»/g, '»')
      .replace(/â°/g, '°')
      .replace(/âª/g, '™')
      .replace(/â®/g, '®')
      .replace(/â©/g, '©')
      // Remove any remaining strange encoding artifacts
      .replace(/[^\x00-\x7F\u00A0-\uFFFF]/g, '')
      .trim();
    
    // Convert newlines to HTML line breaks for proper formatting
    // Handle both \r\n (Windows) and \n (Unix) line endings
    cleaned = cleaned
      .replace(/\r\n/g, '\n')  // Normalize Windows line endings
      .replace(/\n\s*\n/g, '</p><p>')  // Convert double newlines to paragraph breaks
      .replace(/\n/g, '<br>')  // Convert single newlines to line breaks
      .replace(/^/, '<p>')     // Start with opening paragraph tag
      .replace(/$/, '</p>');   // End with closing paragraph tag
    
    // Clean up any empty paragraphs that might have been created
    cleaned = cleaned.replace(/<p>\s*<\/p>/g, '');
    
    // Basic HTML cleaning - remove potentially dangerous content
    return cleaned
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/on\w+="[^"]*"/gi, '');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Navigation Bar */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full bg-white/90 backdrop-blur-enhanced shadow-sm border-b border-blue-100 sticky top-0 z-50"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between py-3">
            {/* Logo Section */}
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2 group">
                <motion.div 
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center text-white font-bold text-xl shadow-md"
                >
                  <span className="z-10">H</span>
                </motion.div>
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-blue-700 via-blue-500 to-blue-400 bg-clip-text text-transparent group-hover:scale-105 transition-transform">
                  HireLift
                </span>
              </Link>

              {/* Breadcrumb */}
              <nav className="hidden md:flex items-center gap-2 text-sm">
                <span className="text-gray-400">•</span>
                <Link
                  href="/jobs"
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Jobs
                </Link>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-blue-700 font-semibold truncate max-w-[150px] lg:max-w-[200px]">{title}</span>
              </nav>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 sm:gap-3">
              <motion.button
                onClick={() => {
                  // Check if there's a referrer from the same origin, otherwise go to jobs page
                  if (document.referrer && document.referrer.includes(window.location.origin)) {
                    router.back();
                  } else {
                    router.push('/jobs');
                  }
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-200 border border-gray-200 font-medium text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                <span className="hidden sm:inline">Back</span>
              </motion.button>

              <motion.a
                href="/audit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-xl hover:from-green-200 hover:to-emerald-200 transition-all duration-200 border border-green-200 font-medium text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="hidden sm:inline">ATS Check</span>
                <span className="sm:hidden">Check</span>
              </motion.a>
            </div>
          </div>
        </div>
      </motion.nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Job Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-white rounded-2xl shadow-lg border ${
            isFeatured ? 'border-yellow-300 ring-2 ring-yellow-200' : 'border-blue-100'
          } p-8 mb-8 relative overflow-hidden`}
        >
          {/* Featured Badge */}
          {isFeatured && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-1 right-1 sm:top-8 sm:right-50 bg-yellow-400 text-yellow-900 px-3 py-2 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg z-10"
            >
              ⭐ Featured Job
            </motion.div>
          )}

          {/* Company and Job Info */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6 mb-6">
            {/* Company Logo */}
            <div className="flex-shrink-0 self-center sm:self-start">
              {companyLogo ? (
                <img 
                  src={companyLogo} 
                  alt={`${company} logo`}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover bg-gray-100 shadow-md"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div 
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl sm:text-2xl shadow-md ${companyLogo ? 'hidden' : 'flex'}`}
              >
                {company.charAt(0).toUpperCase()}
              </div>
            </div>

            {/* Job Details */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4 gap-3">
                <div className="min-w-0 flex-1">
                  <motion.h1 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent mb-2 leading-tight"
                  >
                    {title}
                  </motion.h1>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-base sm:text-lg text-gray-600 mb-2">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span className="font-semibold truncate">{company}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="truncate">{location}</span>
                    </div>
                  </div>
                </div>

                {/* Source Badge */}
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium border ${sourceBadge.className} self-start`}
                >
                  {sourceBadge.icon}
                  <span className="whitespace-nowrap">{sourceBadge.text}</span>
                </motion.div>
              </div>

              {/* Job Badges */}
              <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6">
                {jobType && (
                  <motion.span 
                    whileHover={{ scale: 1.05 }}
                    className="inline-flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold shadow-md"
                  >
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0H8" />
                    </svg>
                    <span className="whitespace-nowrap">{jobType.replace('-', ' ').toUpperCase()}</span>
                  </motion.span>
                )}

                {workMode && (
                  <motion.span 
                    whileHover={{ scale: 1.05 }}
                    className="inline-flex items-center gap-1 sm:gap-2 bg-green-50 text-green-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold border border-green-200"
                  >
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                    </svg>
                    <span className="whitespace-nowrap">{workMode.charAt(0).toUpperCase() + workMode.slice(1)} Work</span>
                  </motion.span>
                )}

                {experienceLevel && (
                  <motion.span 
                    whileHover={{ scale: 1.05 }}
                    className="inline-flex items-center gap-1 sm:gap-2 bg-purple-50 text-purple-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold border border-purple-200"
                  >
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="whitespace-nowrap">{experienceLevel.charAt(0).toUpperCase() + experienceLevel.slice(1)} Level</span>
                  </motion.span>
                )}
              </div>

              {/* Salary and Apply Button */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl border border-green-200 shadow-sm"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  <span className="font-semibold text-base sm:text-lg truncate">{getSalaryDisplay()}</span>
                </motion.div>

                <motion.button
                  onClick={handleApplyClick}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center gap-2 sm:gap-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-bold shadow-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 whitespace-nowrap"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Apply Now
                </motion.button>
              </div>
            </div>
          </div>

          {/* Job Meta Info */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-100">
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Posted {getTimeAgo()}</span>
              </div>
              
              {viewCount && (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>{viewCount} views</span>
                </div>
              )}
            </div>

            {/* Share Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: `${title} at ${company}`,
                    text: `Check out this job opportunity: ${title} at ${company}`,
                    url: window.location.href
                  });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                }
              }}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
              Share
            </motion.button>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Job Description */}
          <div className="lg:col-span-2">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg border border-blue-100 p-8"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Job Description
              </h2>
              
              {shortDescription && (
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded-r-lg">
                  <p className="text-blue-800 font-medium">{shortDescription}</p>
                </div>
              )}
              
              <div 
                className="prose max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ 
                  __html: cleanDescription(description) 
                }}
              />
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Skills & Tags */}
            {tags.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6"
              >
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  Skills & Technologies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <motion.span
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      className="inline-block bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium border border-blue-200 hover:bg-blue-100 transition-colors"
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Quick Apply */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl shadow-lg border border-orange-200 p-6"
            >
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Ready to Apply?
              </h3>
              <p className="text-gray-600 mb-4 text-sm">
                Get your ATS-optimized resume ready and increase your chances of landing this job.
              </p>
              
              <div className="space-y-3">
                <motion.button
                  onClick={handleApplyClick}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-3 rounded-xl font-semibold shadow-md hover:from-orange-600 hover:to-red-600 transition-all duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Apply Now
                </motion.button>
                
                {/* <motion.button
                  onClick={handleDirectApply}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 bg-white text-gray-700 px-4 py-2 rounded-xl font-medium border border-gray-300 hover:bg-gray-50 transition-all duration-200 text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Apply Directly
                </motion.button> */}
              </div>
            </motion.div>

            {/* Company Info */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6"
            >
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                About {company}
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-gray-700">{location}</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0H8" />
                  </svg>
                  <span className="text-gray-700">Now hiring for {jobType} positions</span>
                </div>
                
                <div className="pt-3 border-t border-gray-100">
                  <Link 
                    href={`/jobs?company=${encodeURIComponent(company)}`}
                    className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    View all jobs from {company} →
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Related Jobs */}
        {relatedJobs.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-12"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Related Opportunities
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedJobs.slice(0, 3).map((relatedJob, index) => (
                <motion.div
                  key={relatedJob._id || relatedJob.externalId || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                >
                  <JobCard job={relatedJob} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Apply Overlay */}
      <ApplyOverlay 
        isOpen={showApplyOverlay}
        onClose={() => setShowApplyOverlay(false)}
        job={job}
      />
    </div>
  );
}