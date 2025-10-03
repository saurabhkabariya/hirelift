"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Clock, 
  Search, 
  ArrowRight, 
  Briefcase, 
  ExternalLink,
  RefreshCw,
  Home,
  ChevronRight
} from "lucide-react";

export default function JobNotAvailable({ jobId }) {
  const router = useRouter();
  const [relatedJobs, setRelatedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch related/alternative jobs
  useEffect(() => {
    const fetchAlternativeJobs = async () => {
      try {
        const response = await fetch('/api/jobs?limit=6&sort=date');
        if (response.ok) {
          const data = await response.json();
          setRelatedJobs(data.data || []);
        }
      } catch (error) {
        console.error('Error fetching alternative jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlternativeJobs();
  }, []);

  const formatJobType = (type) => {
    return type?.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ') || 'Full Time';
  };

  const formatLocation = (location) => {
    if (!location) return 'Remote';
    return location.length > 30 ? location.substring(0, 30) + '...' : location;
  };

  const getTimeAgo = (createdAt) => {
    if (!createdAt) return 'Recently';
    
    try {
      const now = new Date();
      const posted = new Date(createdAt);
      const diffTime = Math.abs(now - posted);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return '1 day ago';
      if (diffDays < 30) return `${diffDays} days ago`;
      
      const diffMonths = Math.floor(diffDays / 30);
      return `${diffMonths} month${diffMonths === 1 ? '' : 's'} ago`;
    } catch (error) {
      return 'Recently';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Navigation Bar */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full bg-white/90 backdrop-blur-xl shadow-sm border-b border-blue-100 sticky top-0 z-50"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between py-3">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-400 to-cyan-400 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                H
              </div>
              <span className="text-2xl font-bold tracking-tight text-gray-900">
                HireLift
              </span>
            </Link>

            {/* Breadcrumb */}
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-blue-600 transition-colors">
                Home
              </Link>
              <ChevronRight className="w-4 h-4" />
              <Link href="/jobs" className="hover:text-blue-600 transition-colors">
                Jobs
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-400">Job Not Available</span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <Link 
                href="/jobs"
                className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium"
              >
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">Browse Jobs</span>
              </Link>
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all duration-200 font-medium"
              >
                <span className="hidden sm:inline">Go Back</span>
                <span className="sm:hidden">Back</span>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
            className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center"
          >
            <Clock className="w-12 h-12 text-orange-500" />
          </motion.div>

          {/* Main Message */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            Job No Longer Available
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto"
          >
            This job posting has expired or is no longer accepting applications. 
            Don't worry - we have plenty of other great opportunities for you!
          </motion.p>

          {/* Job ID Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-orange-50 border border-orange-200 rounded-lg p-4 max-w-md mx-auto mb-8"
          >
            <p className="text-sm text-orange-700">
              <strong>Job ID:</strong> {jobId}
            </p>
            <p className="text-xs text-orange-600 mt-1">
              This might be a remote job from our partners that has expired or been filled.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <Link
              href="/jobs"
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              <Search className="w-5 h-5" />
              Browse All Jobs
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              href="/audit"
              className="flex items-center gap-2 px-8 py-3 bg-white text-blue-600 border-2 border-blue-200 rounded-xl font-semibold hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
            >
              <RefreshCw className="w-5 h-5" />
              Check Your Resume
            </Link>

            <Link
              href="/"
              className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              <Home className="w-5 h-5" />
              Back to Home
            </Link>
          </motion.div>
        </motion.div>

        {/* Alternative Jobs Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-12"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Don't Miss These Opportunities
            </h2>
            <p className="text-lg text-gray-600">
              Here are some fresh job postings that might interest you
            </p>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 animate-pulse">
                  <div className="w-full h-4 bg-gray-200 rounded mb-3"></div>
                  <div className="w-3/4 h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="w-1/2 h-3 bg-gray-200 rounded mb-4"></div>
                  <div className="flex gap-2 mb-4">
                    <div className="w-16 h-6 bg-gray-200 rounded-full"></div>
                    <div className="w-20 h-6 bg-gray-200 rounded-full"></div>
                  </div>
                  <div className="w-full h-10 bg-gray-200 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : relatedJobs.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedJobs.map((job, index) => (
                <motion.div
                  key={job.id || job._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 hover:shadow-xl hover:border-blue-200 transition-all duration-300 group"
                >
                  {/* Company Logo & Featured Badge */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {job.companyLogo ? (
                        <img 
                          src={job.companyLogo} 
                          alt={`${job.company} logo`}
                          className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextElementSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div 
                        className={`w-12 h-12 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center ${job.companyLogo ? 'hidden' : 'flex'}`}
                      >
                        <span className="text-white font-bold text-lg">
                          {job.company?.charAt(0)?.toUpperCase() || 'C'}
                        </span>
                      </div>
                    </div>
                    {job.isFeatured && (
                      <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold px-2 py-1 rounded-full">
                        Featured
                      </span>
                    )}
                  </div>

                  {/* Job Info */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {job.title}
                  </h3>
                  
                  <p className="text-gray-600 font-medium mb-2">{job.company}</p>
                  
                  <p className="text-sm text-gray-500 mb-4 flex items-center gap-1">
                    📍 {formatLocation(job.location)}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-full">
                      {formatJobType(job.jobType)}
                    </span>
                    <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full">
                      {job.workMode || 'Remote'}
                    </span>
                    {job.tags?.slice(0, 1).map(tag => (
                      <span key={tag} className="bg-gray-100 text-gray-700 text-xs font-medium px-2 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      {getTimeAgo(job.createdAt)}
                    </span>
                    
                    <Link
                      href={`/jobs/${job.id || job._id}`}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium text-sm group-hover:gap-2 transition-all duration-200"
                    >
                      View Job
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No jobs available at the moment</p>
              <Link
                href="/jobs"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Check back later
              </Link>
            </div>
          )}
        </motion.div>

        {/* Additional Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 text-center border border-blue-100"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Need Help Finding the Right Job?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Let HireLift help you optimize your resume and increase your chances of landing your dream job. 
            Our AI-powered tools can help you stand out from the competition.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/audit"
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
              Free Resume Check
            </Link>
            <Link
              href="/pricing"
              className="flex items-center gap-2 px-6 py-3 bg-white text-blue-600 border border-blue-200 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              <Briefcase className="w-5 h-5" />
              View Pricing Plans
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}