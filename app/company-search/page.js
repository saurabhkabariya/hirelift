"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { usePageLoading } from "@/hooks/usePageLoading";
import toast, { Toaster } from 'react-hot-toast';
import CompanyCard from "@/components/CompanyCard";
import sampleCompanies from "@/data/sampleCompanies.json";
import HIRING_ROLES from "@/data/hiringRoles";
import FeedbackModal from "@/components/feedback/FeedbackModal";
import Link from "next/link";

const jobModes = ["Remote", "Hybrid", "On-site", "WFH"];
const experiences = ["Fresher", "0-1", "1-3", "3-5"];
const PAGE_SIZE = 12;

// Popular roles for quick selection
const POPULAR_ROLES = [
  "Full Stack Developer",
  "Frontend Developer", 
  "Backend Developer",
  "React Developer",
  "Data Scientist",
  "DevOps Engineer",
  "UI/UX Designer",
  "Machine Learning Engineer",
  "Mobile App Developer",
  "Product Manager"
];

export default function CompanySearchPage() {
  const { user, loading } = useAuth();
  const { executeWithLoading, navigateWithLoading } = usePageLoading();
  const router = useRouter();
  
  const [role, setRole] = useState("");
  const [mode, setMode] = useState("");
  const [exp, setExp] = useState("");
  const [companies, setCompanies] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading2, setLoading2] = useState(false);
  const [touched, setTouched] = useState(false);const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showModeDropdown, setShowModeDropdown] = useState(false);
  const [showExpDropdown, setShowExpDropdown] = useState(false);
  const [roleSearchTerm, setRoleSearchTerm] = useState("");
  const [modeSearchTerm, setModeSearchTerm] = useState("");
  const [expSearchTerm, setExpSearchTerm] = useState("");
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const dropdownRef = useRef(null);
  const modeDropdownRef = useRef(null);
  const expDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowRoleDropdown(false);
      }
      if (modeDropdownRef.current && !modeDropdownRef.current.contains(event.target)) {
        setShowModeDropdown(false);
      }
      if (expDropdownRef.current && !expDropdownRef.current.contains(event.target)) {
        setShowExpDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);  

      useEffect(() => {
    setLoading2(true);
    const params = new URLSearchParams();
    if (role) params.append("role", role);
    if (mode) params.append("mode", mode);
    if (exp) params.append("exp", exp);
    params.append("page", page.toString());
    params.append("limit", PAGE_SIZE.toString());
    fetch(`/api/companies?${params.toString()}`)
      .then((res) => res.json())      .then((data) => {
        setCompanies(data.data || []);
        setTotal(data.total || 0);
        setLoading2(false);      })
      .catch(() => setLoading2(false));
  }, [role, mode, exp, page]);

  // Check for premium access
  useEffect(() => {
    if (!loading && user) {
      if (!user.isPremium) {
        toast.error('🚀 Company Search is a Pro feature!', {
          duration: 4000,
          position: 'top-center',
          style: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            fontWeight: 'bold',
            padding: '16px 24px',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          },
          icon: '👑',
        });
        
        // Redirect to pricing page after a short delay
        setTimeout(() => {
          router.push('/pricing');
        }, 2000);
        
        return; // Don't initialize the rest of the component
      }
    }
  }, [user, loading, router]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <Toaster />
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show access denied for non-premium users
  if (user && !user.isPremium) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <Toaster />
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m4-2a9 9 0 10-8 0"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Company Search - Pro Feature</h1>
          <p className="text-gray-600 mb-6">Access thousands of companies hiring for your role with our Pro plan!</p>
          <Link href="/pricing">
            <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
              Upgrade to Pro
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // If user is not logged in, redirect to auth
  if (!user) {
    router.push('/auth');
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <Toaster />
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.4 }
    },
    hover: {
      scale: 1.02,
      y: -5,
      transition: { duration: 0.2 }
    }
  };

  // Filter roles based on search term
  const filteredRoles = HIRING_ROLES.filter(r =>
    r.toLowerCase().includes(roleSearchTerm.toLowerCase())
  );
  // Close dropdown when clicking outside
  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setTouched(true);
    setShowRoleDropdown(false);
    setRoleSearchTerm("");
    setPage(1); // Reset to first page when filter changes
  };
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setShowRoleDropdown(false);
      setShowModeDropdown(false);
      setShowExpDropdown(false);
    }
  };

  const handleModeSelect = (selectedMode) => {
    setMode(selectedMode);
    setTouched(true);
    setShowModeDropdown(false);
    setModeSearchTerm("");
    setPage(1); // Reset to first page when filter changes
  };

  const handleExpSelect = (selectedExp) => {
    setExp(selectedExp);
    setTouched(true);
    setShowExpDropdown(false);
    setExpSearchTerm("");
    setPage(1); // Reset to first page when filter changes
  };
  // Calculate total pages
  const totalPages = Math.ceil(total / PAGE_SIZE);

    return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <Toaster />
      {/* Enhanced Navigation Bar */}
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
                  href="/dashboard"
                  whileHover={{ scale: 1.05 }}
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Dashboard
                </motion.a>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-blue-700 font-semibold">Company Search</span>
              </nav>
            </div>            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <motion.a
                href="/dashboard"
                whileHover={{ scale: 1.05, x: -5 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-xl hover:from-blue-200 hover:to-indigo-200 transition-all duration-200 border border-blue-200 font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                <span className="hidden sm:inline">Dashboard</span>
              </motion.a>

              <motion.a
                href="/playground"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 rounded-xl hover:from-orange-200 hover:to-amber-200 transition-all duration-200 border border-orange-200 font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                <span className="hidden sm:inline">Templates</span>
              </motion.a>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg border border-purple-200"
              >
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium hidden sm:inline">Search</span>
              </motion.div>
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
            Company & HR Directory
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Discover your dream companies and connect directly with HR professionals. 
            Find opportunities that match your skills and career goals.
          </motion.p>
        </motion.div>

        {/* Selected Role Display */}
        <AnimatePresence>
          {role && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="mb-6 text-center"
            >
              <motion.span 
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-full shadow-lg"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>Searching for: <strong>{role}</strong></span>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => { setRole(""); setTouched(true); }}
                  className="text-blue-100 hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>        {/* Search Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 mb-8 border border-blue-100 relative z-40"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Role Dropdown */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="space-y-2"
            >
              <label className="flex items-center gap-2 text-sm font-semibold text-blue-700">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0H8" />
                </svg>
                Role
              </label>
              <div className="relative" ref={dropdownRef}>
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="button"
                  onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                  onKeyDown={handleKeyDown}
                  className="w-full border-2 border-blue-200 rounded-xl px-4 py-3 text-left focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white flex items-center justify-between transition-all duration-200 hover:border-blue-300"
                  aria-expanded={showRoleDropdown}
                  aria-haspopup="listbox"
                >
                  <span className={`${role ? "text-gray-900 font-medium" : "text-gray-500"}`}>
                    {role || "Select a role..."}
                  </span>
                  <motion.svg 
                    animate={{ rotate: showRoleDropdown ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-5 h-5 text-blue-400"
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </motion.svg>
                </motion.button>

                <AnimatePresence>
                  {showRoleDropdown && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl max-h-72 overflow-hidden"
                    >
                      {/* Clear Selection Option */}
                      <div className="p-3 border-b border-gray-100">
                        <motion.button
                          whileHover={{ backgroundColor: "#f1f5f9" }}
                          onClick={() => handleRoleSelect("")}
                          className="w-full text-left px-3 py-2 text-sm text-gray-500 rounded-lg transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Clear selection
                          </div>
                        </motion.button>
                      </div>

                      {/* Popular Roles */}
                      <div className="p-3 border-b border-gray-100">
                        <div className="text-xs font-semibold text-gray-500 mb-3 flex items-center gap-2">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          Popular Roles
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {POPULAR_ROLES.slice(0, 6).map((popularRole) => (
                            <motion.button
                              key={popularRole}
                              whileHover={{ scale: 1.05, backgroundColor: "#dbeafe" }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleRoleSelect(popularRole)}
                              className="px-3 py-1 text-xs bg-blue-50 text-blue-700 rounded-full border border-blue-200 hover:border-blue-300 transition-all duration-200"
                            >
                              {popularRole}
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      {/* Search Input */}
                      <div className="p-3 border-b border-gray-100">
                        <div className="relative">
                          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                          <input
                            type="text"
                            placeholder="Search roles..."
                            value={roleSearchTerm}
                            onChange={(e) => setRoleSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      </div>
                      
                      {/* Roles List */}
                      <div className="max-h-48 overflow-y-auto">
                        {filteredRoles.length > 0 ? (
                          filteredRoles.map((r, index) => (
                            <motion.button
                              key={r}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.02 }}
                              whileHover={{ backgroundColor: "#f0f9ff", x: 4 }}
                              onClick={() => handleRoleSelect(r)}
                              className="w-full text-left px-4 py-3 text-sm text-gray-700 border-b border-gray-50 hover:border-blue-100 transition-all duration-200"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                {r}
                              </div>
                            </motion.button>
                          ))
                        ) : (
                          <div className="px-4 py-8 text-center">
                            <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.529.901-6.172 2.379l1.586 1.586a5.967 5.967 0 014.586-2.172z" />
                            </svg>
                            <p className="text-sm text-gray-500">No roles found</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>            {/* Job Mode Dropdown */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="space-y-2"
            >
              <label className="flex items-center gap-2 text-sm font-semibold text-blue-700">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Job Mode
              </label>
              <div className="relative" ref={modeDropdownRef}>
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="button"
                  onClick={() => setShowModeDropdown(!showModeDropdown)}
                  onKeyDown={handleKeyDown}
                  className="w-full border-2 border-blue-200 rounded-xl px-4 py-3 text-left focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white flex items-center justify-between transition-all duration-200 hover:border-blue-300"
                  aria-expanded={showModeDropdown}
                  aria-haspopup="listbox"
                >
                  <span className={`${mode ? "text-gray-900 font-medium" : "text-gray-500"}`}>
                    {mode || "Select job mode..."}
                  </span>
                  <motion.svg 
                    animate={{ rotate: showModeDropdown ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-5 h-5 text-blue-400"
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </motion.svg>
                </motion.button>

                <AnimatePresence>
                  {showModeDropdown && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl max-h-72 overflow-hidden"
                    >
                      {/* Clear Selection Option */}
                      <div className="p-3 border-b border-gray-100">
                        <motion.button
                          whileHover={{ backgroundColor: "#f1f5f9" }}
                          onClick={() => handleModeSelect("")}
                          className="w-full text-left px-3 py-2 text-sm text-gray-500 rounded-lg transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Any mode
                          </div>
                        </motion.button>
                      </div>

                      {/* Popular Modes */}
                      <div className="p-3 border-b border-gray-100">
                        <div className="text-xs font-semibold text-gray-500 mb-3 flex items-center gap-2">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          Available Modes
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {jobModes.map((jobMode) => (
                            <motion.button
                              key={jobMode}
                              whileHover={{ scale: 1.05, backgroundColor: "#dbeafe" }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleModeSelect(jobMode)}
                              className="px-3 py-1 text-xs bg-blue-50 text-blue-700 rounded-full border border-blue-200 hover:border-blue-300 transition-all duration-200"
                            >
                              {jobMode}
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>            {/* Experience Dropdown */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="space-y-2"
            >
              <label className="flex items-center gap-2 text-sm font-semibold text-blue-700">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Experience
              </label>
              <div className="relative" ref={expDropdownRef}>
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="button"
                  onClick={() => setShowExpDropdown(!showExpDropdown)}
                  onKeyDown={handleKeyDown}
                  className="w-full border-2 border-blue-200 rounded-xl px-4 py-3 text-left focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white flex items-center justify-between transition-all duration-200 hover:border-blue-300"
                  aria-expanded={showExpDropdown}
                  aria-haspopup="listbox"
                >
                  <span className={`${exp ? "text-gray-900 font-medium" : "text-gray-500"}`}>
                    {exp ? `${exp} years` : "Select experience..."}
                  </span>
                  <motion.svg 
                    animate={{ rotate: showExpDropdown ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-5 h-5 text-blue-400"
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </motion.svg>
                </motion.button>

                <AnimatePresence>
                  {showExpDropdown && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl max-h-72 overflow-hidden"
                    >
                      {/* Clear Selection Option */}
                      <div className="p-3 border-b border-gray-100">
                        <motion.button
                          whileHover={{ backgroundColor: "#f1f5f9" }}
                          onClick={() => handleExpSelect("")}
                          className="w-full text-left px-3 py-2 text-sm text-gray-500 rounded-lg transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Any experience
                          </div>
                        </motion.button>
                      </div>

                      {/* Experience Levels */}
                      <div className="p-3 border-b border-gray-100">
                        <div className="text-xs font-semibold text-gray-500 mb-3 flex items-center gap-2">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          Experience Levels
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {experiences.map((experience) => (
                            <motion.button
                              key={experience}
                              whileHover={{ scale: 1.05, backgroundColor: "#dbeafe" }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleExpSelect(experience)}
                              className="px-3 py-1 text-xs bg-blue-50 text-blue-700 rounded-full border border-blue-200 hover:border-blue-300 transition-all duration-200"
                            >
                              {experience} years
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>        </motion.div>

        {/* Results Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          {/* Results Counter */}
          <AnimatePresence>
            {!loading2 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-6 text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-md rounded-full shadow-lg border border-blue-100"
                >
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>                  {companies.length > 0 ? (
                    <span className="text-gray-700 font-medium">
                      Showing {((page - 1) * PAGE_SIZE) + 1} to {Math.min(page * PAGE_SIZE, total)} of <span className="text-blue-600 font-bold">{total}</span> companies (Page {page} of {totalPages})
                    </span>
                  ) : touched ? (
                    <span className="text-orange-600 font-medium">No companies match your criteria</span>
                  ) : (
                    <span className="text-gray-600 font-medium">Use filters above to discover companies</span>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>          {/* Company Results */}
          {loading2 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full mb-6"
              />
              <motion.h3 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl font-semibold text-gray-700 mb-2"
              >
                Discovering Companies
              </motion.h3>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-gray-500"
              >
                Finding the perfect matches for you...              </motion.p>
            </motion.div>          ) : companies.length ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {companies.map((company, index) => (
                  <motion.div
                    key={company._id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="group"
                  >
                    <CompanyCard
                      companyName={company.companyName}
                      industry={company.industry}
                      location={company.location}
                      hiringRoles={company.hiringRoles}
                      jobMode={company.jobMode}
                      experience={company.experience}
                      hrContacts={company.hrContacts}
                      lastUpdated={company.lastUpdated}
                    />
                  </motion.div>
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-t border-gray-100"
                >
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-sm text-gray-600 font-medium"
                  >
                    Showing {((page - 1) * PAGE_SIZE) + 1} to {Math.min(page * PAGE_SIZE, total)} of {total} companies
                  </motion.div>
                  
                  <div className="flex items-center gap-2">
                    {/* Previous Button */}
                    <motion.button
                      whileHover={{ scale: 1.05, backgroundColor: "rgb(59, 130, 246)" }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-blue-50 text-blue-600 hover:text-white border border-blue-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                      </svg>
                      <span className="hidden sm:inline">Previous</span>
                    </motion.button>

                    {/* Page Numbers */}
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => {
                        const pageNum = i + 1;
                        const isCurrentPage = page === pageNum;
                        const shouldShow = 
                          pageNum === 1 ||
                          pageNum === totalPages ||
                          (pageNum >= page - 2 && pageNum <= page + 2);

                        if (!shouldShow) {
                          if (pageNum === page - 3 || pageNum === page + 3) {
                            return (
                              <span key={pageNum} className="px-2 py-1 text-gray-400">
                                ...
                              </span>
                            );
                          }
                          return null;
                        }

                        return (
                          <motion.button
                            key={pageNum}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setPage(pageNum)}
                            className={`w-10 h-10 rounded-lg font-semibold transition-all duration-200 ${
                              isCurrentPage
                                ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg"
                                : "bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200"
                            }`}
                          >
                            {pageNum}
                          </motion.button>
                        );
                      })}
                    </div>

                    {/* Next Button */}
                    <motion.button
                      whileHover={{ scale: 1.05, backgroundColor: "rgb(59, 130, 246)" }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setPage(page + 1)}
                      disabled={page === totalPages}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-blue-50 text-blue-600 hover:text-white border border-blue-200"
                    >
                      <span className="hidden sm:inline">Next</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-20"
            >
              <motion.div 
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                className="max-w-md mx-auto"
              >
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                  className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                >
                  <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </motion.div>
                <motion.h3 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl font-bold text-gray-800 mb-3"
                >
                  {touched ? "No Companies Found" : "Ready to Explore?"}
                </motion.h3>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-gray-600 mb-6 leading-relaxed"
                >
                  {touched 
                    ? "We couldn't find any companies matching your criteria. Try adjusting your filters or explore different roles." 
                    : "Use the advanced filters above to discover amazing companies and connect with HR professionals. Your dream job awaits!"
                  }
                </motion.p>
                <AnimatePresence>
                  {touched && (
                    <motion.button
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)" }}
                      whileTap={{ scale: 0.95 }}                      onClick={() => {
                        setRole("");
                        setMode("");
                        setExp("");
                        setTouched(false);
                        setRoleSearchTerm("");
                        setPage(1);
                      }}
                      className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Reset All Filters
                    </motion.button>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>          )}
        </motion.div>
      </div>

      {/* Floating Navigation Menu */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
        className="fixed bottom-6 right-6 z-40"
      >
        <div className="relative group">
          {/* Main FAB */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-14 h-14 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
            onClick={() => {
              const menu = document.getElementById('fab-menu');
              menu.classList.toggle('hidden');
            }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
            </svg>
          </motion.button>

          {/* Menu Items */}
          <div id="fab-menu" className="hidden absolute bottom-16 right-0 space-y-3">
            <motion.a
              href="/dashboard"
              whileHover={{ scale: 1.1, x: -5 }}
              whileTap={{ scale: 0.9 }}
              className="flex items-center gap-3 px-4 py-3 bg-white text-blue-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border border-blue-200 min-w-[160px]"
            >
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                </svg>
              </div>
              <span className="font-medium">Dashboard</span>
            </motion.a>            <motion.button
              whileHover={{ scale: 1.1, x: -5 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                setRole("");
                setMode("");
                setExp("");
                setPage(1);
                window.scrollTo({ top: 200, behavior: 'smooth' });
              }}
              className="flex items-center gap-3 px-4 py-3 bg-white text-orange-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border border-orange-200 min-w-[160px]"
            >
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <span className="font-medium">Reset</span>
            </motion.button>

            {/* Feedback Option */}
            <motion.button
              whileHover={{ scale: 1.1, x: -5 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowFeedbackModal(true)}
              className="flex items-center gap-3 px-4 py-3 bg-white text-purple-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border border-purple-200 min-w-[160px]"
            >
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <span className="font-medium">Feedback</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1, x: -5 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-3 px-4 py-3 bg-white text-green-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border border-green-200 min-w-[160px]"
            >
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </div>
              <span className="font-medium">Top</span>
            </motion.button></div>        </div>
      </motion.div>
      
      {/* Feedback Modal */}
      <FeedbackModal 
        isOpen={showFeedbackModal} 
        onClose={() => setShowFeedbackModal(false)} 
      />
    </div>
  );
}