'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, User, Mail, Crown, Zap, BarChart, FileText, UserCheck } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Header from '../../components/Header';
import FeedbackModal from '../../components/feedback/FeedbackModal';
import FeedbackDisplay from '../../components/admin/FeedbackDisplay';

const ADMIN_EMAIL = "websiteads074@gmail.com";

export default function DashboardPage() {
  const { user, signOutUser } = useAuth();
  const router = useRouter();  const [activeTab, setActiveTab] = useState('overview');
  const [isAdmin, setisAdmin] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  useEffect(() => {
    if(user.email === ADMIN_EMAIL){
      setisAdmin(true);
    }
  }, [])
  

  // User will always be available because of the ProtectedRoute component

  const handleLogout = async () => {
    await signOutUser();
    router.push('/auth');
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    }
  };

  const cardHoverEffects = {
    rest: { scale: 1 },
    hover: { 
      scale: 1.02,
      boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-40">
        <div className="absolute top-[10%] left-[15%] w-64 h-64 bg-[var(--primary-light)] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-[40%] right-[15%] w-72 h-72 bg-[var(--secondary-light)] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[10%] left-[35%] w-80 h-80 bg-[var(--accent)] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <Header />

      {/* Navigation Breadcrumb */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/90 backdrop-blur-md border-b border-blue-100 mt-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            <nav className="flex items-center gap-2 text-sm">
              <span className="text-blue-700 font-semibold">Dashboard</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-600">Main Hub</span>
            </nav>

            {/* Quick Admin Access */}
            {isAdmin && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-3"
              >
                <motion.a
                  href="/admin/company-manager"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-medium text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span className="hidden sm:inline">Company Manager</span>
                </motion.a>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 px-3 py-2 bg-red-100 text-red-700 rounded-lg border border-red-200"
                >
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium">Admin</span>
                </motion.div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          {/* <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 300,
              damping: 15,
              delay: 0.3
            }}
            className="inline-block px-3 py-1 bg-[var(--accent-light)] text-[var(--accent-dark)] rounded-full text-sm font-semibold mb-2"
          >
            Your personal dashboard
          </motion.div> */}
          
          <h2 className="text-4xl font-extrabold mb-2 gradient-text py-2">
            Welcome, {user.email.split('@')[0]}!
          </h2>
          <p className="text-[var(--gray-600)] text-lg">
            Your hiring journey is taking off 🚀
          </p>
        </motion.div>

        {/* User Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-md mx-auto glass rounded-2xl shadow-xl p-6 border border-opacity-20 border-[var(--gray-300)] mb-12"
        >
          <motion.div 
            className="flex items-center justify-center mb-6"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-20 h-20 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] rounded-2xl flex items-center justify-center shadow-lg pulse">
              <User className="w-10 h-10 text-white" />
            </div>
          </motion.div>

          <div className="space-y-4">
            <motion.div 
              className="flex items-center bg-[var(--background-light)] p-3 rounded-xl shadow-sm"
              whileHover={{ x: 5 }}
            >
              <Mail className="w-5 h-5 text-[var(--primary)] mr-3" />
              <span className="text-[var(--foreground-light)]">{user.email}</span>
            </motion.div>            <motion.div 
              className="flex items-center bg-[var(--background-light)] p-3 rounded-xl shadow-sm"
              whileHover={{ x: 5 }}
            >
              <Crown className="w-5 h-5 text-[var(--secondary)] mr-3" />
              <span className="text-[var(--foreground-light)]">
                {user.isPremium ? 'Premium User' : 'Free User'}
                {!user.isPremium && (
                  <motion.span 
                    whileHover={{ scale: 1.1 }}
                    onClick={()=>router.push('/pricing')}
                    className="ml-2 text-xs px-2 py-1 bg-[var(--secondary-light)] text-white rounded-full cursor-pointer"
                  >
                    Upgrade
                  </motion.span>
                )}
              </span>
            </motion.div>

            {/* Admin Status */}
            <AnimatePresence>
              {isAdmin && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center bg-gradient-to-r from-red-50 to-orange-50 p-3 rounded-xl shadow-sm border border-red-200"
                  whileHover={{ x: 5 }}
                >
                  <svg className="w-5 h-5 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5-6a2 2 0 012 2v1a8.967 8.967 0 01-4.728 7.975A8.967 8.967 0 0118 20H6a8.967 8.967 0 01-4.728-7.975A2 2 0 013 10V9a2 2 0 012-2h.5c.276 0 .5.224.5.5s.224.5.5.5h8c.276 0 .5-.224.5-.5s.224-.5.5-.5H15a2 2 0 012 2v1z" />
                  </svg>
                  <span className="text-red-700 font-semibold">Administrator</span>
                  <motion.span 
                    onClick={()=>router.push('/admin/company-manager')}
                    className="ml-2 text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full hover:cursor-pointer"
                  >
                    Admin Panel Access
                  </motion.span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="pt-4 border-t border-[var(--gray-300)] border-opacity-20">
              <p className="text-[var(--gray-600)]">
                Audit Count: <span className="font-semibold text-[var(--primary)]">{user.isPremium? '(unlimited)' : user.auditCount || 0}</span>
              </p>
            </div>
          </div>
        </motion.div>        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className={`mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${isAdmin ? 'xl:grid-cols-4' : ''}`}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (user?.isPremium) {
                router.push('/company-search');
              } else {
                router.push('/pricing');
              }
            }}            className="bg-white rounded-xl p-6 shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-200 text-left cursor-pointer relative overflow-hidden"
          >
            {/* Premium Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
              className="absolute top-3 right-3"
            >
              <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full text-xs font-bold shadow-lg">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Premium
              </div>
            </motion.div>

            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#2563eb]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-5V7a4 4 0 00-8 0v2m12 5v2a4 4 0 01-3 3.87M5 12v2a4 4 0 003 3.87" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Company & HR Directory</h3>
            <p className="text-gray-600">Browse companies, roles, and connect with HRs</p>
          </motion.button>          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/audit')}            className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200 text-left cursor-pointer relative overflow-hidden"
          >
            {/* First Audit Free Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
              className="absolute top-3 right-3"
            >
              <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-full text-xs font-bold shadow-lg">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                First Audit Free
              </div>
            </motion.div>

            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Resume Audit</h3>
            <p className="text-gray-600">AI-powered ATS analysis and optimization</p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/playground')}            className="bg-white rounded-xl p-6 shadow-lg border border-purple-100 hover:shadow-xl transition-all duration-200 text-left cursor-pointer relative overflow-hidden"
          >
            {/* Free Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
              className="absolute top-3 right-3"
            >              <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-full text-xs font-bold shadow-lg">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                </svg>
                Free
              </div>
            </motion.div>

            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Cold Outreach Playground</h3>
            <p className="text-gray-600">Design and customize email & LinkedIn templates</p>
          </motion.button>

          {/* Admin-only Company Manager Button */}
          <AnimatePresence>
            {isAdmin && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/admin/company-manager')}
                className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 shadow-lg border border-orange-200 hover:shadow-xl transition-all duration-200 text-left relative overflow-hidden cursor-pointer"
              >
                <div className="absolute top-2 right-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Admin
                  </span>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Company Manager</h3>
                <p className="text-gray-600">Manage companies, bulk upload and admin controls</p>
              </motion.button>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white relative rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200 text-left cursor-pointer"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
              className="absolute top-3 right-3"
            >
              <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-purple-400 to-blue-500 text-white rounded-full text-xs font-bold shadow-lg">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                Comming Soon
              </div>
            </motion.div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">AI Analytics
              {/* <motion.span 
                    className="ml-2 text-xs px-2 py-1 bg-[var(--secondary-light)] text-white rounded-full cursor-pointer"
                  >
                    Coming Soon
             </motion.span> */}
             </h3>
            <p className="text-gray-600">Comprehensive hiring analytics and insights providing AI Assistance</p>              </motion.button>
             

          {/* Upgrade to Pro Card - Show only for non-premium users */}
          <AnimatePresence>
            {!user.isPremium && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/pricing')}
                className="bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-xl p-6 shadow-2xl border-0 hover:shadow-3xl transition-all duration-300 text-left relative overflow-hidden cursor-pointer group"
              >
                {/* Animated Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Sparkle Effect */}
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute top-4 right-4 w-6 h-6 text-white/70"
                >
                  ✨
                </motion.div>

                {/* Pro Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
                  className="absolute top-3 right-3"
                >
                  <div className="flex items-center gap-1 px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-xs font-bold shadow-lg border border-white/30">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    PRO
                  </div>
                </motion.div>

                <div className="relative z-10">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mb-4 border border-white/30">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 flex items-center">
                    Upgrade to Pro
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="ml-2"
                    >
                      🚀
                    </motion.span>
                  </h3>
                  <p className="text-white/90 text-sm mb-4">Unlock unlimited audits, premium templates, and exclusive features</p>
                  
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg border border-white/30 font-semibold text-sm"
                  >
                    <span>View Plans</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </motion.div>
                </div>
              </motion.button>
            )}
          </AnimatePresence>          {/* Premium Users - Manage Subscription Card */}
          <AnimatePresence>
            {user.isPremium && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => router.push('/pricing')}
                className="bg-white rounded-xl p-6 shadow-lg border border-emerald-200 hover:shadow-xl hover:border-emerald-300 transition-all duration-200 text-left relative overflow-hidden cursor-pointer group"
              >
                {/* Premium Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-teal-50/50 to-cyan-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                
                {/* Crown (Static on hover to avoid conflicts) */}
                <div className="absolute top-3 right-24 w-6 h-6 text-yellow-500 group-hover:scale-110 transition-transform duration-200">
                  👑
                </div>

                {/* Premium Badge */}
                <div className="absolute top-3 right-3">
                  <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full text-xs font-bold shadow-lg group-hover:shadow-emerald-200 transition-shadow duration-200">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Active
                  </div>
                </div>

                <div className="relative z-10">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4 border border-emerald-200 group-hover:bg-emerald-200 group-hover:border-emerald-300 transition-colors duration-200">
                    <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5-6a2 2 0 012 2v6M5 12a2 2 0 002-2V4a2 2 0 012-2h6m3 7h4l1 1-1 1h-4V8z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center group-hover:text-emerald-800 transition-colors duration-200">
                    Manage Subscription
                    <span className="ml-2 group-hover:rotate-12 transition-transform duration-200">
                      ⚙️
                    </span>
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 group-hover:text-gray-700 transition-colors duration-200">View plans, billing details, and subscription settings</p>
                  
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-semibold text-sm transition-colors duration-200">
                    <span>Manage Plan</span>
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </motion.button>
            )}
          </AnimatePresence></motion.div>

        {/* Admin-only Feedback Display */}
        <AnimatePresence>
          {isAdmin && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.8 }}
              className="mt-12"
            >
              <FeedbackDisplay />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Section */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-20 border-t border-gray-200 pt-12 pb-8"
      >        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile-first responsive footer grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8">
            {/* Brand Section */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-white font-bold text-xl shadow-md">
                  <span className="z-10">H</span>
                </div>
                <span className="text-xl font-bold gradient-text">HireLift</span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed max-w-xs">
                Accelerate your career with AI-powered resume optimization and professional outreach tools.
              </p>
            </div>

            {/* Quick Actions */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-4">Quick Actions</h4>
              <div className="space-y-2">
                <Link href="/audit" className="block text-sm text-gray-600 hover:text-[var(--primary)] transition-colors">Resume Audit</Link>
                <Link href={user?.isPremium ? "/company-search" : "/pricing"} className="block text-sm text-gray-600 hover:text-[var(--primary)] transition-colors">
                  Company Search {!user?.isPremium && "👑"}
                </Link>
                <Link href="/playground" className="block text-sm text-gray-600 hover:text-[var(--primary)] transition-colors">Template Playground</Link>
                <Link href="/pricing" className="block text-sm text-gray-600 hover:text-[var(--primary)] transition-colors">Upgrade Plan</Link>
              </div>
            </div>

            {/* Account */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-4">Account</h4>
              <div className="space-y-2">
                <button 
                  onClick={() => setActiveTab('overview')}
                  className="block text-sm text-gray-600 hover:text-[var(--primary)] transition-colors text-left w-full"
                >
                  Dashboard Overview
                </button>
                <button 
                  onClick={() => setActiveTab('profile')}
                  className="block text-sm text-gray-600 hover:text-[var(--primary)] transition-colors text-left w-full"
                >
                  Profile Settings
                </button>
                <button 
                  onClick={handleLogout}
                  className="block text-sm text-gray-600 hover:text-[var(--primary)] transition-colors text-left w-full"
                >
                  Sign Out
                </button>
                <a href="mailto:hirelift01@gmail.com" className="block text-sm text-gray-600 hover:text-[var(--primary)] transition-colors">Support</a>
              </div>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-4">Legal & Policies</h4>
              <div className="space-y-2">
                <Link href="/privacy" className="block text-sm text-gray-600 hover:text-[var(--primary)] transition-colors">Privacy Policy</Link>
                <Link href="/terms" className="block text-sm text-gray-600 hover:text-[var(--primary)] transition-colors">Terms & Conditions</Link>
                <Link href="/refund" className="block text-sm text-gray-600 hover:text-[var(--primary)] transition-colors">Refund Policy</Link>
                <a href="mailto:hirelift01@gmail.com" className="block text-sm text-gray-600 hover:text-[var(--primary)] transition-colors">Legal Inquiries</a>
              </div>
            </div>
          </div>

          {/* Bottom Bar - Responsive Stack */}
          <div className="border-t border-gray-200 pt-4 sm:pt-6 space-y-4 sm:space-y-0">
            {/* Mobile: Stack vertically, Desktop: Flex row */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
              <div className="text-xs sm:text-sm text-gray-500 text-center sm:text-left">
                &copy; {new Date().getFullYear()} HireLift. All rights reserved.
              </div>
              
              {/* Love message and links - responsive layout */}
              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 text-xs sm:text-sm text-gray-500">
                <span className="flex items-center gap-1 text-center">
                  Made with <span className="text-red-500">❤️</span> for job seekers
                </span>
                <div className="flex flex-wrap justify-center sm:justify-end gap-3 sm:gap-4">
                  <Link href="/privacy" className="hover:text-[var(--primary)] transition-colors">Privacy</Link>
                  <Link href="/terms" className="hover:text-[var(--primary)] transition-colors">Terms</Link>
                  <Link href="/refund" className="hover:text-[var(--primary)] transition-colors">Refunds</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.footer>

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
            className="w-14 h-14 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
            onClick={() => {
              const menu = document.getElementById('fab-menu');
              menu.classList.toggle('hidden');
            }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
            </svg>
          </motion.button>          {/* Menu Items */}
          <div id="fab-menu" className="hidden absolute bottom-16 right-0 space-y-3">            <motion.a
              href={user?.isPremium ? "/company-search" : "/pricing"}
              whileHover={{ scale: 1.1, x: -5 }}
              whileTap={{ scale: 0.9 }}
              className={`flex items-center gap-3 px-4 py-3 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border min-w-[160px] relative ${
                user?.isPremium 
                  ? 'bg-purple-600 border-purple-200' 
                  : 'bg-gradient-to-r from-purple-600 to-blue-600 border-purple-200'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                user?.isPremium ? 'bg-purple-100' : 'bg-white/20'
              }`}>
                <svg className={`w-4 h-4 ${user?.isPremium ? 'text-purple-600' : 'text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <span className="font-medium">Search</span>
              {!user?.isPremium && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                  <svg className="w-2 h-2 text-yellow-800" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              )}
            </motion.a>

            {/* Feedback Option */}
            <motion.button
              whileHover={{ scale: 1.1, x: -5 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowFeedbackModal(true)}
              className="flex items-center gap-3 px-4 py-3 bg-white text-blue-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border border-blue-200 min-w-[160px]"
            >
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <span className="font-medium">Feedback</span>
            </motion.button>

            {isAdmin && (
              <motion.a
                href="/admin/company-manager"
                whileHover={{ scale: 1.1, x: -5 }}
                whileTap={{ scale: 0.9 }}
                className="flex items-center gap-3 px-4 py-3 bg-white text-red-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border border-red-200 min-w-[160px]"
              >
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <span className="font-medium">Admin</span>
              </motion.a>            )}

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
            </motion.button>
          </div>        </div>
      </motion.div>

      {/* Feedback Modal */}
      <FeedbackModal 
        isOpen={showFeedbackModal} 
        onClose={() => setShowFeedbackModal(false)} 
      />
    </div>
  );
}