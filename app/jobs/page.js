"use client";
import React, { useState, useEffect, useRef, Suspense, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { usePageLoading } from "@/hooks/usePageLoading";
import Link from "next/link";
import toast, { Toaster } from 'react-hot-toast';
import JobCard from "@/components/JobCard.jsx";

const PAGE_SIZE = 12;

// Filter options
const JOB_TYPES = ["full-time", "part-time", "contract", "internship", "freelance"];
const WORK_MODES = ["remote", "hybrid", "onsite"];
const EXPERIENCE_LEVELS = ["entry", "mid", "senior", "lead", "executive"];

// Popular tags for quick selection
const POPULAR_TAGS = [
  "javascript", "react", "node.js", "python", "machine learning",
  "data science", "ui/ux", "devops", "mobile", "backend", 
  "frontend", "full-stack", "cloud", "aws", "docker"
];

// Loading skeleton component
function JobsPageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="w-full bg-white/90 backdrop-blur-enhanced shadow-sm border-b border-blue-100 sticky top-0 z-50 h-16 animate-pulse"></div>
      <div className="max-w-6xl mx-auto px-2 py-4 sm:px-6">
        <div className="text-center mb-8">
          <div className="w-96 h-12 bg-gray-200 rounded mx-auto mb-4 animate-pulse"></div>
          <div className="w-128 h-6 bg-gray-200 rounded mx-auto animate-pulse"></div>
        </div>
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 mb-8 border border-blue-100">
          <div className="w-full h-12 bg-gray-200 rounded mb-6 animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-full h-20 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100 animate-pulse">
              <div className="h-6 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
              <div className="flex gap-2 mb-4">
                <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                <div className="h-6 bg-gray-200 rounded-full w-20"></div>
              </div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Main Jobs component that uses useSearchParams
function JobsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { executeWithLoading } = usePageLoading();
  
  // Filter states
  const [search, setSearch] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [jobType, setJobType] = useState('');
  const [workMode, setWorkMode] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [location, setLocation] = useState('');
  const [sort, setSort] = useState('date');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  
  // Data states
  const [jobs, setJobs] = useState([]);
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [pagination, setPagination] = useState({});
  const [availableFilters, setAvailableFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [featuredLoading, setFeaturedLoading] = useState(false);
  const [page, setPage] = useState(1);
  
  // UI states
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [tagSearchTerm, setTagSearchTerm] = useState("");
  const tagDropdownRef = useRef(null);
  
  // Refs for preventing multiple simultaneous fetches and tracking component state
  const isInitializingRef = useRef(false);
  const isMountedRef = useRef(true);
  const currentRequestIdRef = useRef(0);

  // Reset mounted state on component mount
  useEffect(() => {
    isMountedRef.current = true;
  }, []);

  // Initialize from search params after component mounts
  useEffect(() => {
    if (searchParams && !isInitializingRef.current) {
      isInitializingRef.current = true;
      
      // Batch all state updates to prevent multiple re-renders
      const updates = {
        search: searchParams.get('q') || '',
        tags: searchParams.get('tags')?.split(',').filter(Boolean) || [],
        jobType: searchParams.get('jobType') || '',
        workMode: searchParams.get('workMode') || '',
        experienceLevel: searchParams.get('experienceLevel') || '',
        location: searchParams.get('location') || '',
        sort: searchParams.get('sort') || 'date',
        page: parseInt(searchParams.get('page') || '1'),
        featuredOnly: searchParams.get('featured') === 'true'
      };
      
      // Only update states if they're different to prevent unnecessary re-renders
      if (updates.search !== search) setSearch(updates.search);
      if (JSON.stringify(updates.tags) !== JSON.stringify(selectedTags)) setSelectedTags(updates.tags);
      if (updates.jobType !== jobType) setJobType(updates.jobType);
      if (updates.workMode !== workMode) setWorkMode(updates.workMode);
      if (updates.experienceLevel !== experienceLevel) setExperienceLevel(updates.experienceLevel);
      if (updates.location !== location) setLocation(updates.location);
      if (updates.sort !== sort) setSort(updates.sort);
      if (updates.page !== page) setPage(updates.page);
      if (updates.featuredOnly !== showFeaturedOnly) setShowFeaturedOnly(updates.featuredOnly);
      
      // Allow future initializations after a short delay
      setTimeout(() => {
        isInitializingRef.current = false;
      }, 100);
    }
  }, [searchParams]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tagDropdownRef.current && !tagDropdownRef.current.contains(event.target)) {
        setShowTagDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch jobs function with useCallback to make it stable
  const fetchJobs = useCallback(async () => {
    // Generate a unique request ID to handle race conditions
    const requestId = ++currentRequestIdRef.current;
    
    setLoading(true);
    try {
      // Check if component is still mounted and this is the latest request
      if (!isMountedRef.current || requestId !== currentRequestIdRef.current) {
        return;
      }
      
      const params = new URLSearchParams();
      if (search) params.append('q', search);
      if (selectedTags.length > 0) params.append('tags', selectedTags.join(','));
      if (jobType) params.append('jobType', jobType);
      if (workMode) params.append('workMode', workMode);
      if (experienceLevel) params.append('experienceLevel', experienceLevel);
      if (location) params.append('location', location);
      if (showFeaturedOnly) params.append('featured', 'true');
      params.append('sort', sort);
      params.append('page', page.toString());
      params.append('limit', PAGE_SIZE.toString());

      const response = await fetch(`/api/jobs?${params.toString()}`);
      
      // Check if this is still the latest request and component is mounted
      if (!isMountedRef.current || requestId !== currentRequestIdRef.current) {
        return;
      }
      
      const data = await response.json();

      // Final check before updating state
      if (!isMountedRef.current || requestId !== currentRequestIdRef.current) {
        return;
      }

      if (data.success) {
        setJobs(data.data || []);
        setPagination(data.pagination || {});
        setAvailableFilters(data.filters?.available || {});
      } else {
        toast.error('Failed to load jobs');
        console.error('API Error:', data.message);
      }
    } catch (error) {
      // Only show errors if this is still the latest request and component is mounted
      if (isMountedRef.current && requestId === currentRequestIdRef.current) {
        toast.error('Error loading jobs');
        console.error('Fetch error:', error);
      }
    } finally {
      // Only update loading state if this is the latest request and component is mounted
      if (isMountedRef.current && requestId === currentRequestIdRef.current) {
        setLoading(false);
      }
    }
  }, [search, selectedTags, jobType, workMode, experienceLevel, location, sort, page, showFeaturedOnly]);

  // Fetch jobs when filters change
  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Fetch featured jobs function
  const fetchFeaturedJobs = useCallback(async () => {
    if (!isMountedRef.current) return;
    
    setFeaturedLoading(true);
    try {
      const response = await fetch('/api/jobs?featured=true&limit=3&sort=date');
      
      // Check if component is still mounted
      if (!isMountedRef.current) {
        return;
      }
      
      const data = await response.json();

      // Check again before updating state
      if (!isMountedRef.current) {
        return;
      }

      if (data.success) {
        setFeaturedJobs(data.data || []);
      } else {
        console.error('Featured jobs API Error:', data.message);
      }
    } catch (error) {
      // Only show errors if component is still mounted
      if (isMountedRef.current) {
        console.error('Featured jobs fetch error:', error);
      }
    } finally {
      // Only update state if component is still mounted
      if (isMountedRef.current) {
        setFeaturedLoading(false);
      }
    }
  }, []);

  // Fetch featured jobs on mount
  useEffect(() => {
    fetchFeaturedJobs();
  }, [fetchFeaturedJobs]);

  // Cleanup function to mark component as unmounted
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('q', search);
    if (selectedTags.length > 0) params.set('tags', selectedTags.join(','));
    if (jobType) params.set('jobType', jobType);
    if (workMode) params.set('workMode', workMode);
    if (experienceLevel) params.set('experienceLevel', experienceLevel);
    if (location) params.set('location', location);
    if (sort !== 'date') params.set('sort', sort);
    if (page !== 1) params.set('page', page.toString());
    if (showFeaturedOnly) params.set('featured', 'true');
    
    const queryString = params.toString();
    const newUrl = queryString ? `/jobs?${queryString}` : '/jobs';
    
    // Update URL without triggering a re-render
    window.history.replaceState(null, '', newUrl);
  }, [search, selectedTags, jobType, workMode, experienceLevel, location, sort, page, showFeaturedOnly]);

  const handleTagSelect = (tag) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
      setPage(1);
    }
    setShowTagDropdown(false);
    setTagSearchTerm("");
  };

  const handleTagRemove = (tagToRemove) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
    setPage(1);
  };

  const handleFilterChange = (filterType, value) => {
    switch (filterType) {
      case 'jobType':
        setJobType(value);
        break;
      case 'workMode':
        setWorkMode(value);
        break;
      case 'experienceLevel':
        setExperienceLevel(value);
        break;
      case 'sort':
        setSort(value);
        break;
    }
    setPage(1);
  };

  const clearAllFilters = () => {
    setSearch('');
    setSelectedTags([]);
    setJobType('');
    setWorkMode('');
    setExperienceLevel('');
    setLocation('');
    setSort('date');
    setPage(1);
  };

  const filteredTags = availableFilters.tags?.filter(tag =>
    tag.toLowerCase().includes(tagSearchTerm.toLowerCase())
  ) || [];

  const hasActiveFilters = search || selectedTags.length > 0 || jobType || workMode || experienceLevel || location;

  return (
    <div className="min-h-screen bg-gradient-to-br pb-8 from-blue-50 via-white to-blue-100">
      <Toaster />
      
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
              <nav className="hidden sm:flex items-center gap-2 text-sm">
                <span className="text-gray-400">•</span>
                <motion.a
                  href="/"
                  whileHover={{ scale: 1.05 }}
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Home
                </motion.a>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-blue-700 font-semibold">Jobs</span>
              </nav>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <motion.a
                href="/dashboard"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-xl hover:from-blue-200 hover:to-indigo-200 transition-all duration-200 border border-blue-200 font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
                </svg>
                <span className="hidden sm:inline">Dashboard</span>
              </motion.a>

              <motion.a
                href="/audit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-xl hover:from-green-200 hover:to-emerald-200 transition-all duration-200 border border-green-200 font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="hidden sm:inline">ATS Check</span>
              </motion.a>
            </div>
          </div>
        </div>
      </motion.nav>

      <div className="max-w-6xl mx-auto px-2 py-4 sm:px-6">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-8"
        >
          <motion.h1 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-blue-700 via-blue-500 to-blue-400 bg-clip-text text-transparent drop-shadow-lg mb-4 py-2"
          >
            {showFeaturedOnly ? 'Featured Jobs' : 'Job Opportunities'}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            {showFeaturedOnly 
              ? 'Discover our hand-picked premium job opportunities from top companies worldwide.'
              : 'Discover remote and on-site opportunities from top companies worldwide. No login required - start exploring your next career move today.'
            }
          </motion.p>
        </motion.div>

        {/* Active Filters Display */}
        <AnimatePresence>
          {hasActiveFilters && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              className="mb-6 flex flex-wrap items-center gap-2"
            >
              <span className="text-sm font-medium text-gray-600">Active filters:</span>
              
              {search && (
                <motion.span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  Search: "{search}"
                  <button onClick={() => { setSearch(''); setPage(1); }} className="hover:text-blue-900">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </motion.span>
              )}
              
              {selectedTags.map(tag => (
                <motion.span key={tag} className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                  {tag}
                  <button onClick={() => handleTagRemove(tag)} className="hover:text-purple-900">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </motion.span>
              ))}
              
              {[
                { key: 'jobType', value: jobType, label: 'Type' },
                { key: 'workMode', value: workMode, label: 'Mode' },
                { key: 'experienceLevel', value: experienceLevel, label: 'Experience' },
                { key: 'location', value: location, label: 'Location' }
              ].map(({ key, value, label }) => value && (
                <motion.span key={key} className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                  {label}: {value}
                  <button onClick={() => { handleFilterChange(key, ''); }} className="hover:text-green-900">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </motion.span>
              ))}
              
              <motion.button
                onClick={clearAllFilters}
                whileHover={{ scale: 1.05 }}
                className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm hover:bg-red-200 transition-colors"
              >
                Clear all
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search and Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 mb-8 border border-blue-100 relative z-40"
        >
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search jobs by title, company, or keywords..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-blue-200 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white transition-all duration-200"
              />
            </div>
          </div>

          {/* Filter Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Tags Filter */}
            <div className="space-y-2" ref={tagDropdownRef}>
              <label className="flex items-center gap-2 text-sm font-semibold text-blue-700">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                Skills/Tags
              </label>
              <motion.button
                whileHover={{ scale: 1.01 }}
                onClick={() => setShowTagDropdown(!showTagDropdown)}
                className="w-full border-2 border-blue-200 rounded-xl px-4 py-3 text-left focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white flex items-center justify-between transition-all duration-200 hover:border-blue-300"
              >
                <span className="text-gray-500">
                  {selectedTags.length > 0 ? `${selectedTags.length} selected` : "Select skills..."}
                </span>
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </motion.button>

              <AnimatePresence>
                {showTagDropdown && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute z-50 w-72 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl max-h-80 overflow-hidden"
                  >
                    {/* Popular Tags */}
                    <div className="p-3 border-b border-gray-100">
                      <div className="text-xs font-semibold text-gray-500 mb-3">Popular Skills</div>
                      <div className="flex flex-wrap gap-2">
                        {POPULAR_TAGS.slice(0, 8).map((tag) => (
                          <motion.button
                            key={tag}
                            whileHover={{ scale: 1.05 }}
                            onClick={() => handleTagSelect(tag)}
                            disabled={selectedTags.includes(tag)}
                            className={`px-3 py-1 text-xs rounded-full border transition-all duration-200 ${
                              selectedTags.includes(tag)
                                ? 'bg-blue-100 text-blue-700 border-blue-300 cursor-not-allowed'
                                : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:border-blue-300'
                            }`}
                          >
                            {tag}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Search Tags */}
                    <div className="p-3 border-b border-gray-100">
                      <input
                        type="text"
                        placeholder="Search skills..."
                        value={tagSearchTerm}
                        onChange={(e) => setTagSearchTerm(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    
                    {/* Available Tags */}
                    <div className="max-h-48 overflow-y-auto">
                      {filteredTags.length > 0 ? (
                        filteredTags.slice(0, 20).map((tag) => (
                          <motion.button
                            key={tag}
                            whileHover={{ backgroundColor: "#f0f9ff" }}
                            onClick={() => handleTagSelect(tag)}
                            disabled={selectedTags.includes(tag)}
                            className={`w-full text-left px-4 py-3 text-sm border-b border-gray-50 transition-all duration-200 ${
                              selectedTags.includes(tag)
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'text-gray-700 hover:text-blue-700'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span>{tag}</span>
                              {selectedTags.includes(tag) && (
                                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                          </motion.button>
                        ))
                      ) : (
                        <div className="px-4 py-8 text-center text-gray-500">
                          No skills found
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Job Type Filter */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-blue-700">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0H8" />
                </svg>
                Job Type
              </label>
              <select
                value={jobType}
                onChange={(e) => handleFilterChange('jobType', e.target.value)}
                className="w-full border-2 border-blue-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white transition-all duration-200"
              >
                <option value="">All types</option>
                {JOB_TYPES.map(type => (
                  <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                ))}
              </select>
            </div>

            {/* Work Mode Filter */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-blue-700">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Work Mode
              </label>
              <select
                value={workMode}
                onChange={(e) => handleFilterChange('workMode', e.target.value)}
                className="w-full border-2 border-blue-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white transition-all duration-200"
              >
                <option value="">All modes</option>
                {WORK_MODES.map(mode => (
                  <option key={mode} value={mode}>{mode.charAt(0).toUpperCase() + mode.slice(1)}</option>
                ))}
              </select>
            </div>

            {/* Experience Level Filter */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-blue-700">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Experience
              </label>
              <select
                value={experienceLevel}
                onChange={(e) => handleFilterChange('experienceLevel', e.target.value)}
                className="w-full border-2 border-blue-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white transition-all duration-200"
              >
                <option value="">All levels</option>
                {EXPERIENCE_LEVELS.map(level => (
                  <option key={level} value={level}>{level.charAt(0).toUpperCase() + level.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Location and Sort */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-blue-700">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Location
              </label>
              <input
                type="text"
                placeholder="Enter city, state, or country..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full border-2 border-blue-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white transition-all duration-200"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-blue-700">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                </svg>
                Sort By
              </label>
              <select
                value={sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="w-full border-2 border-blue-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white transition-all duration-200"
              >
                <option value="date">Newest first</option>
                <option value="relevance">Most relevant</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Featured Jobs Section */}
        {featuredJobs.length > 0 && !showFeaturedOnly && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-600 via-orange-500 to-red-500 bg-clip-text text-transparent">
                  Featured Jobs
                </h2>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-yellow-200 via-orange-200 to-red-200"></div>
              <Link
                href={showFeaturedOnly ? "/jobs" : "/jobs?featured=true"}
                className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg"
              >
                {showFeaturedOnly ? "View All Jobs" : "View All Featured"}
              </Link>
            </div>

            {featuredLoading ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 rounded-2xl p-6 border-2 border-yellow-200 animate-pulse">
                    <div className="h-6 bg-yellow-200 rounded mb-4"></div>
                    <div className="h-4 bg-yellow-200 rounded mb-2"></div>
                    <div className="h-4 bg-yellow-200 rounded mb-4 w-3/4"></div>
                    <div className="flex gap-2 mb-4">
                      <div className="h-6 bg-yellow-200 rounded-full w-16"></div>
                      <div className="h-6 bg-yellow-200 rounded-full w-20"></div>
                    </div>
                    <div className="h-10 bg-yellow-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {featuredJobs.map((job, index) => (
                  <motion.div
                    key={job._id || job.externalId || index}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative group h-full"
                  >
                    {/* Enhanced Job Card */}
                    <div className="bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 rounded-2xl p-6 border-2 border-yellow-200 shadow-lg hover:shadow-xl transition-all duration-300 transform group-hover:scale-105 group-hover:border-orange-300 h-full">
                      <JobCard job={job} />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Results Summary */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="text-gray-600">
            {loading ? (
              "Loading jobs..."
            ) : (
              `${pagination.total || 0} jobs found${hasActiveFilters ? ' with current filters' : ''}`
            )}
          </div>
          
          {pagination.total > 0 && (
            <div className="text-sm text-gray-500">
              Page {pagination.page || 1} of {pagination.totalPages || 1}
            </div>
          )}
        </motion.div>

        {/* Jobs Grid */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
                  <div className="flex gap-2 mb-4">
                    <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                    <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                  </div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              ))}
            </motion.div>
          ) : jobs.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              variants={{
                visible: { transition: { staggerChildren: 0.1 } }
              }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {jobs.map((job, index) => (
                <motion.div
                  key={job._id || job.externalId || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <JobCard job={job} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <svg className="w-24 h-24 text-gray-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0H8" />
              </svg>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">No jobs found</h3>
              <p className="text-gray-500 mb-6">
                {hasActiveFilters
                  ? "Try adjusting your filters to see more results."
                  : "We're working hard to bring you the latest opportunities."}
              </p>
              {hasActiveFilters && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={clearAllFilters}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Clear all filters
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center items-center gap-2 mt-12"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPage(page - 1)}
              disabled={!pagination.hasPrev}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                pagination.hasPrev
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Previous
            </motion.button>
            
            <div className="flex items-center gap-2">
              {[...Array(pagination.totalPages)].map((_, i) => {
                const pageNum = i + 1;
                const isCurrentPage = pageNum === pagination.page;
                const isVisible = 
                  pageNum === 1 || 
                  pageNum === pagination.totalPages || 
                  (pageNum >= pagination.page - 1 && pageNum <= pagination.page + 1);
                
                if (!isVisible) {
                  return pageNum === pagination.page - 2 || pageNum === pagination.page + 2 ? (
                    <span key={pageNum} className="px-2 text-gray-400">...</span>
                  ) : null;
                }
                
                return (
                  <motion.button
                    key={pageNum}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setPage(pageNum)}
                    className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                      isCurrentPage
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-200'
                    }`}
                  >
                    {pageNum}
                  </motion.button>
                );
              })}
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPage(page + 1)}
              disabled={!pagination.hasNext}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                pagination.hasNext
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Next
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// Wrapper component with Suspense boundary
export default function JobsPage() {
  return (
    <Suspense fallback={<JobsPageSkeleton />}>
      <JobsPageContent />
    </Suspense>
  );
}