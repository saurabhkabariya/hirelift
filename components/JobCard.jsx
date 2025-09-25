import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function JobCard({ job }) {
  const {
    _id,
    externalId,
    source,
    title,
    company,
    location,
    shortDescription,
    tags = [],
    jobType,
    workMode,
    experienceLevel,
    formattedSalary,
    daysAgo,
    companyLogo,
    isFeatured,
    createdAt
  } = job;

  // Use _id for manual jobs, externalId for remote jobs
  const jobId = _id || externalId;
  const jobUrl = `/jobs/${jobId}`;

  // Format creation date if daysAgo is not available
  const getTimeAgo = () => {
    if (daysAgo && daysAgo !== 'Invalid date') return daysAgo;
    
    try {
      const now = new Date();
      
      // Handle different date formats
      let posted;
      if (createdAt) {
        // If it's already a Date object
        if (createdAt instanceof Date) {
          posted = createdAt;
        }
        // If it's a string or number, try to parse it
        else {
          posted = new Date(createdAt);
        }
        
        // Check if the date is valid
        if (isNaN(posted.getTime())) {
          // Try parsing as Unix timestamp (seconds)
          if (typeof createdAt === 'number' || /^\d+$/.test(String(createdAt))) {
            posted = new Date(Number(createdAt) * 1000);
          }
          
          // If still invalid, fallback to now
          if (isNaN(posted.getTime())) {
            posted = now;
          }
        }
        
        // Additional validation: ensure the date isn't in the future or too far in the past
        const diffTime = now - posted;
        const maxDays = 365 * 2; // 2 years
        const minDays = 0;
        
        if (diffTime < 0 || diffTime > (maxDays * 24 * 60 * 60 * 1000)) {
          posted = now;
        }
        
      } else {
        posted = now;
      }
      
      const diffTime = Math.abs(now - posted);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return '1 day ago';
      if (diffDays < 30) return `${diffDays} days ago`;
      
      const diffMonths = Math.floor(diffDays / 30);
      if (diffMonths === 1) return '1 month ago';
      if (diffMonths < 12) return `${diffMonths} months ago`;
      
      return 'Over a year ago';
    } catch (error) {
      console.warn('Error calculating time ago:', error, { createdAt, daysAgo });
      return 'Recently';
    }
  };

  // Format salary or show default
  const getSalaryDisplay = () => {
    if (formattedSalary && formattedSalary !== 'Salary not specified') {
      return formattedSalary;
    }
    if (job.salaryRange?.min || job.salaryRange?.max) {
      const { min, max, currency = 'USD' } = job.salaryRange;
      if (min && max) {
        return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
      } else if (min) {
        return `From $${min.toLocaleString()}`;
      } else if (max) {
        return `Up to $${max.toLocaleString()}`;
      }
    }
    return 'Competitive salary';
  };

  // Get source badge
  const getSourceBadge = () => {
    if (source === 'remoteok') {
      return {
        text: 'Remote',
        className: 'bg-green-100 text-green-700 border-green-200'
      };
    }
    return {
      text: 'HireLift',
      className: 'bg-blue-100 text-blue-700 border-blue-200'
    };
  };

  const sourceBadge = getSourceBadge();

  return (
    <motion.div 
      layout
      className={`bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border ${
        isFeatured ? 'border-yellow-300 ring-2 ring-yellow-200' : 'border-blue-100'
      } p-6 transition-all duration-300 hover:shadow-2xl hover:border-blue-200 h-full w-full flex flex-col justify-between`}
      whileHover={{ 
        boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.25)",
        borderColor: "rgba(59, 130, 246, 0.3)"
      }}
    >
      {/* Featured Badge */}
      {isFeatured && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold shadow-lg"
        >
          Featured
        </motion.div>
      )}

      {/* Job Header */}
      <div className="mb-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            {/* Company Logo and Name */}
            <div className="flex items-center gap-3 mb-3">
              {companyLogo ? (
                <img 
                  src={companyLogo} 
                  alt={`${company} logo`}
                  className="w-10 h-10 rounded-lg object-cover bg-gray-100"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                  {company.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h4 className="font-semibold text-gray-800 text-sm">{company}</h4>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{location}</span>
                </div>
              </div>
            </div>

            {/* Job Title */}
            <motion.h3 
              whileHover={{ scale: 1.02 }}
              className="text-lg font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent mb-2 leading-tight line-clamp-2"
            >
              <Link href={jobUrl} className="hover:underline">
                {title}
              </Link>
            </motion.h3>

            {/* Job Description */}
            {shortDescription && (
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                {shortDescription}
              </p>
            )}
          </div>

          {/* Source Badge */}
          <motion.span 
            whileHover={{ scale: 1.05 }}
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${sourceBadge.className}`}
          >
            <div className="w-2 h-2 bg-current rounded-full"></div>
            {sourceBadge.text}
          </motion.span>
        </div>

        {/* Job Details Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {jobType && (
            <motion.span 
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0H8" />
              </svg>
              {jobType.replace('-', ' ').toUpperCase()}
            </motion.span>
          )}

          {workMode && (
            <motion.span 
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-semibold border border-green-200"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
              </svg>
              {workMode.charAt(0).toUpperCase() + workMode.slice(1)}
            </motion.span>
          )}

          {experienceLevel && (
            <motion.span 
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold border border-purple-200"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {experienceLevel.charAt(0).toUpperCase() + experienceLevel.slice(1)}
            </motion.span>
          )}
        </div>

        {/* Salary */}
        <div className="mb-4">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="inline-flex items-center gap-2 bg-gray-50 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium border border-gray-200"
          >
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            {getSalaryDisplay()}
          </motion.div>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {tags.slice(0, 4).map((tag, index) => (
                <motion.span
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="inline-block bg-blue-50 text-blue-600 px-2 py-1 rounded-md text-xs font-medium border border-blue-200"
                >
                  {tag}
                </motion.span>
              ))}
              {tags.length > 4 && (
                <span className="inline-block text-blue-600 px-2 py-1 text-xs font-medium">
                  +{tags.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{getTimeAgo()}</span>
        </div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            href={jobUrl}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
          >
            View Job
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}