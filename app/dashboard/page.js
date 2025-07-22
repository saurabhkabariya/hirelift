'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, User, Mail, Crown, Zap, BarChart, FileText, UserCheck } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const ADMIN_EMAIL = "websiteads074@gmail.com";

export default function DashboardPage() {
  const { user, signOutUser } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [isAdmin, setisAdmin] = useState(false);

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

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass sticky top-0 z-50 backdrop-blur-lg shadow-sm border-b border-opacity-20 border-[var(--gray-300)]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-white font-bold text-xl shadow-md mr-2">
                <span className="z-10">H</span>
              </div>
              <h1 className="text-2xl font-bold gradient-text">
                HireLift
              </h1>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="flex items-center px-5 py-2 bg-[var(--primary)] hover:bg-[var(--primary-light)] text-white rounded-xl transition-all shadow-sm hover:shadow-md smooth btn"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </motion.button>
          </div>
        </div>
      </motion.header>

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
                Audit Count: <span className="font-semibold text-[var(--primary)]">{user.auditCount || 0}</span>
              </p>
            </div>
          </div>
        </motion.div>        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className={`mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 ${user.isAdmin ? 'lg:grid-cols-4' : ''}`}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/company-search')}
            className="bg-white rounded-xl p-6 shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-200 text-left cursor-pointer"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#2563eb]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-5V7a4 4 0 00-8 0v2m12 5v2a4 4 0 01-3 3.87M5 12v2a4 4 0 003 3.87" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Company & HR Directory</h3>
            <p className="text-gray-600">Browse companies, roles, and connect with HRs</p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/audit')}
            className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200 text-left cursor-pointer"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Resume Audit</h3>
            <p className="text-gray-600">AI-powered ATS analysis and optimization</p>
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
            className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200 text-left cursor-pointer"
          >
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">AI Analytics
              <motion.span 
                    className="ml-2 text-xs px-2 py-1 bg-[var(--secondary-light)] text-white rounded-full cursor-pointer"
                  >
                    Coming Soon
             </motion.span>
             </h3>
            <p className="text-gray-600">Comprehensive hiring analytics and insights providing AI Assistance</p>
            
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
} 