'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, User, Mail, Crown, Zap, BarChart, FileText, UserCheck, Settings, CreditCard, Bell, Clock, CheckCircle, AlertCircle, Users, Send } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { NotificationProvider, useNotifications } from '@/contexts/NotificationContext';
import { usePageLoading } from '@/hooks/usePageLoading';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import FeedbackModal from '../../components/feedback/FeedbackModal';
import FeedbackDisplay from '../../components/admin/FeedbackDisplay';
import Head from 'next/head';
import TrialCountdown from '@/components/trial/TrialCountdown';

const ADMIN_EMAIL = "websiteads074@gmail.com";

const DashboardContent = () => {
  const { user, signOutUser } = useAuth();
  const { notifications, markAsViewed, hasDashboardNotifications, pendingActions, awaitingUpdates } = useNotifications();
  const { navigateWithLoading } = usePageLoading();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if(user.email === ADMIN_EMAIL){
      setIsAdmin(true);
    }
  }, [])

  useEffect(() => {
    // Mark dashboard notifications as viewed when component mounts
    if (hasDashboardNotifications) {
      markAsViewed('dashboard');
    }
  }, []);

// The DashboardContent component continues below. We'll export a small
// wrapper at the end of the file to provide the NotificationProvider.
  

  // User will always be available because of the ProtectedRoute component

  const handleLogout = async () => {
    await signOutUser();
    navigateWithLoading('/auth', 'Signing out...');
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
    <div className="min-h-screen bg-[var(--background)] dark:bg-white">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-40">
        <div className="absolute top-[10%] left-[15%] w-64 h-64 bg-[var(--primary-light)] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-[40%] right-[15%] w-72 h-72 bg-[var(--secondary-light)] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[10%] left-[35%] w-80 h-80 bg-[var(--accent)] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Custom Dashboard Navigation */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3 sm:py-4">
            {/* Logo/Brand */}
            <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200">
                <span className="text-white font-bold text-base sm:text-lg">H</span>
              </div>
              <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                HireLift
              </span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-4 xl:gap-6">
              <Link 
                href="/jobs" 
                className="flex items-center gap-2 px-3 xl:px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-all duration-200 font-medium text-sm xl:text-base"
              >
                <svg className="w-4 h-4 mt-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0H8m0 0v.5A3.5 3.5 0 0011.5 10h1A3.5 3.5 0 0016 6.5V6H8z" />
                </svg>
                <span className="hidden xl:inline">Jobs</span>
              </Link>

              <Link 
                href="/pricing" 
                className="flex items-center gap-2 px-3 xl:px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-medium text-sm xl:text-base"
              >
                <CreditCard className="w-4 h-4" />
                <span className="hidden xl:inline">Upgrade</span>
              </Link>
              
              <Link 
                href="/audit" 
                className="flex items-center gap-2 px-3 xl:px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium text-sm xl:text-base"
              >
                <BarChart className="w-4 h-4" />
                <span className="hidden xl:inline">Review</span>
              </Link>

              {/* User Menu */}
              <div className="flex items-center gap-2 xl:gap-3 pl-3 xl:pl-4 border-l border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 xl:w-8 xl:h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <User className="w-3 h-3 xl:w-4 xl:h-4 text-white" />
                  </div>
                  <span className="text-xs xl:text-sm font-medium text-gray-700 hidden xl:inline max-w-[100px] truncate">
                    {user?.name || user?.email?.split('@')[0]}
                  </span>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 xl:gap-2 px-2 xl:px-3 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 text-xs xl:text-sm"
                >
                  <LogOut className="w-3 h-3 xl:w-4 xl:h-4" />
                  <span className="hidden xl:inline">Logout</span>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden border-t border-gray-200 py-4"
              >
                <div className="space-y-2">
                  <Link 
                    href="/jobs"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-all duration-200 font-medium"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0H8m0 0v.5A3.5 3.5 0 0011.5 10h1A3.5 3.5 0 0016 6.5V6H8z" />
                    </svg>
                    <span>Browse Jobs</span>
                    <div className="ml-auto px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                      Free
                    </div>
                  </Link>

                  <Link 
                    href="/audit"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-200 font-medium"
                  >
                    <BarChart className="w-5 h-5" />
                    <span>ATS Resume Review</span>
                    
                  </Link>

                  <Link 
                    href="/pricing"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium"
                  >
                    <CreditCard className="w-5 h-5" />
                    <span>Upgrade Plan</span>
                    {!user?.isPremium && (
                      <div className="ml-auto px-2 py-1 bg-white/20 text-white text-xs font-medium rounded-full">
                        Premium
                      </div>
                    )}
                  </Link>

                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="flex items-center gap-3 px-4 py-2 text-gray-600">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          {user?.name || user?.email?.split('@')[0]}
                        </div>
                        <div className="text-sm text-gray-500 truncate">
                          {user?.email}
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 font-medium"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Navigation Breadcrumb */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-blue-100 dark:border-gray-800"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            <nav className="flex items-center gap-2 text-sm">
              <span className="text-blue-700 font-semibold">Dashboard</span>
              <span className="text-gray-400 dark:text-gray-600">•</span>
              <span className="text-gray-600 dark:text-gray-400">Main Hub</span>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-6 sm:mb-8"
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
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-2 gradient-text py-2 px-2">
            Welcome, {user.email.split('@')[0]}!
          </h2>
          <p className="text-[var(--gray-600)] text-base sm:text-lg px-4">
            Your hiring journey is taking off 🚀
          </p>
        </motion.div>

        {/* User Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-xs sm:max-w-md mx-auto glass rounded-2xl shadow-xl p-4 sm:p-6 border border-opacity-20 border-[var(--gray-300)] mb-8 sm:mb-12"
        >
          <motion.div 
            className="flex items-center justify-center mb-4 sm:mb-6"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] rounded-2xl flex items-center justify-center shadow-lg pulse">
              <User className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
          </motion.div>

          <div className="space-y-3 sm:space-y-4">
            <motion.div 
              className="flex items-center bg-[var(--background-light)] p-2 sm:p-3 rounded-xl shadow-sm"
              whileHover={{ x: 5 }}
            >
              <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--primary)] mr-2 sm:mr-3 flex-shrink-0" />
              <span className="text-[var(--foreground-light)] text-sm sm:text-base truncate">{user.email}</span>
            </motion.div>

            {/* Trial Countdown */}
            <TrialCountdown className="w-full justify-center" compact={true} />

            <motion.div 
              className="flex items-center bg-[var(--background-light)] p-2 sm:p-3 rounded-xl shadow-sm"
              whileHover={{ x: 5 }}
            >
              <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--secondary)] mr-2 sm:mr-3 flex-shrink-0" />
              <span className="text-[var(--foreground-light)] text-sm sm:text-base">
                {user.isPremium ? 'Premium User' : 'Free User'}
                {!user.isPremium && (
                  <motion.span 
                    whileHover={{ scale: 1.1 }}
                    onClick={()=>navigateWithLoading('/pricing', 'Loading pricing plans...')}
                    className="ml-2 text-xs px-2 py-1 bg-[var(--secondary-light)] text-white rounded-full cursor-pointer whitespace-nowrap"
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
                  className="flex flex-col sm:flex-row sm:items-center bg-gradient-to-r from-red-50 to-orange-50 p-2 sm:p-3 rounded-xl shadow-sm border border-red-200 gap-2 sm:gap-0"
                  whileHover={{ x: 5 }}
                >
                  <div className="flex items-center">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 mr-2 sm:mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5-6a2 2 0 012 2v1a8.967 8.967 0 01-4.728 7.975A8.967 8.967 0 0118 20H6a8.967 8.967 0 01-4.728-7.975A2 2 0 013 10V9a2 2 0 012-2h.5c.276 0 .5.224.5.5s.224.5.5.5h8c.276 0 .5-.224.5-.5s.224-.5.5-.5H15a2 2 0 012 2v1z" />
                    </svg>
                    <span className="text-red-700 font-semibold text-sm sm:text-base">Administrator</span>
                  </div>
                  <motion.span 
                    onClick={()=>navigateWithLoading('/admin/company-manager', 'Loading admin panel...')}
                    className="text-xs px-2 py-1 text-center bg-red-100 text-red-800 rounded-full hover:cursor-pointer sm:ml-2 w-full sm:w-auto"
                  >
                    Admin Panel Access
                  </motion.span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="pt-3 sm:pt-4 border-t border-[var(--gray-300)] border-opacity-20">
              <p className="text-[var(--gray-600)] text-sm sm:text-base text-center sm:text-left">
                Review Count: <span className="font-semibold text-[var(--primary)]">{user.isPremium? '(unlimited available)' : user.auditCount || 0}</span>
              </p>
            </div>
          </div>
        </motion.div>        

        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 sm:mt-12 max-w-6xl mx-auto px-2 sm:px-0"
        >
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
            
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 sm:px-6 py-4 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Bell className="h-5 w-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Referral Activity</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm truncate">Stay updated on your referral requests and opportunities</p>
                  </div>
                </div>
                {(pendingActions > 0 || awaitingUpdates > 0) && (
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-3 h-3 bg-red-500 rounded-full"
                    />
                    <span className="text-xs sm:text-sm font-medium text-gray-700">
                      {pendingActions + awaitingUpdates} action{(pendingActions + awaitingUpdates) !== 1 ? 's' : ''} needed
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 sm:p-5 border border-orange-200 relative overflow-hidden"
                >
                  {pendingActions > 0 && (
                    <motion.div
                      animate={{ rotate: [0, 10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute top-3 right-3 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold"
                    >
                      {pendingActions}
                    </motion.div>
                  )}
                  
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="h-4 w-4 text-orange-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Pending Actions</h4>
                  </div>
                  
                  <p className="text-gray-600 text-xs sm:text-sm mb-4 leading-relaxed">
                    {pendingActions > 0 
                      ? `You have ${pendingActions} referral request${pendingActions !== 1 ? 's' : ''} waiting for your response`
                      : "No pending actions - you're all caught up!"
                    }
                  </p>
                  
                  <motion.button
                    whileHover={{ x: 5 }}
                    onClick={() => navigateWithLoading('/referrals?tab=requests', 'Loading referral requests...')}
                    className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 font-medium text-xs sm:text-sm"
                  >
                    <span>View Requests</span>
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </motion.button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-5 border border-blue-200 relative overflow-hidden"
                >
                  {awaitingUpdates > 0 && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="absolute top-3 right-3 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold"
                    >
                      {awaitingUpdates}
                    </motion.div>
                  )}
                  
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Users className="h-4 w-4 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Awaiting Updates</h4>
                  </div>
                  
                  <p className="text-gray-600 text-xs sm:text-sm mb-4 leading-relaxed">
                    {awaitingUpdates > 0 
                      ? `${awaitingUpdates} candidate${awaitingUpdates !== 1 ? 's' : ''} haven't updated their status yet`
                      : "All your requests have been processed!"
                    }
                  </p>
                  
                  <motion.button
                    whileHover={{ x: 5 }}
                    onClick={() => {
                      markAsViewed('dashboard');
                      navigateWithLoading('/referrals?tab=requests&subtab=sent', 'Loading sent requests...');
                    }}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium text-xs sm:text-sm"
                  >
                    <span>Check Status</span>
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </motion.button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 sm:p-5 border border-green-200 relative overflow-hidden sm:col-span-1 md:col-span-2 lg:col-span-1"
                >
                  <div className="absolute top-3 right-3 text-2xl">
                    {notifications.activity.weeklyTotal > 5 ? '🔥' : notifications.activity.weeklyTotal > 0 ? '📈' : '🌱'}
                  </div>
                  
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <BarChart className="h-4 w-4 text-green-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base">This Week</h4>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-gray-600">Requests Received:</span>
                      <span className="font-medium text-gray-900">{notifications.activity.recentReceived}</span>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-gray-600">Requests Sent:</span>
                      <span className="font-medium text-gray-900">{notifications.activity.recentSent}</span>
                    </div>
                  </div>
                  
                  <motion.button
                    whileHover={{ x: 5 }}
                    onClick={() => navigateWithLoading('/referrals', 'Loading referrals...')}
                    className="flex items-center space-x-2 text-green-600 hover:text-green-700 font-medium text-xs sm:text-sm"
                  >
                    <span>Visit Referrals Hub</span>
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </motion.button>
                </motion.div>

              </div>
              {(pendingActions > 0 || awaitingUpdates > 0) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-100"
                >
                  <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigateWithLoading('/referrals?tab=requests', 'Loading referral requests...')}
                      className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 sm:px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 text-sm sm:text-base"
                    >
                      <FileText className="h-4 w-4" />
                      <span className="whitespace-nowrap">Manage All Requests</span>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigateWithLoading('/referrals?tab=browse', 'Loading referral candidates...')}
                      className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 sm:px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 text-sm sm:text-base"
                    >
                      <Send className="h-4 w-4" />
                      <span className="whitespace-nowrap">Send New Request</span>
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div> */}
        
        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className={`mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${isAdmin ? 'xl:grid-cols-4' : ''}`}
        >



          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigateWithLoading('/audit', 'Loading resume analysis...')}            className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200 text-left cursor-pointer relative overflow-hidden"
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
                First Review Free
              </div>
            </motion.div>

            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Resume Review</h3>
            <p className="text-gray-600">AI-powered ATS analysis and optimization</p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigateWithLoading('/job-matcher', 'Loading job matcher...')}
            className="bg-white rounded-xl p-6 shadow-lg border border-violet-100 hover:shadow-xl transition-all duration-200 text-left cursor-pointer relative overflow-hidden"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 0.35, type: "spring", stiffness: 300 }}
              className="absolute top-3 right-3"
            >
              <div className={`flex items-center gap-1 px-3 py-1 text-white rounded-full text-xs font-bold shadow-lg ${
                user?.isPremium
                  ? 'bg-gradient-to-r from-violet-500 to-purple-600'
                  : 'bg-gradient-to-r from-emerald-400 to-teal-500'
              }`}>
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm4.95-9.05a1 1 0 10-1.414-1.414L9 12.07 6.464 9.536A1 1 0 105.05 10.95l3.243 3.243a1 1 0 001.414 0l5.243-5.243z" clipRule="evenodd" />
                </svg>
                {user?.isPremium ? 'Unlimited' : '1 Free'}
              </div>
            </motion.div>

            <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l2 2m0 0l-2 2m2-2H9m8-5a8 8 0 10-16 0 8 8 0 0016 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Resume Job Matcher</h3>
            <p className="text-gray-600">Match your resume with any job description and get AI-powered fit insights</p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (user?.isPremium) {
                navigateWithLoading('/company-search', 'Loading company directory...');
              } else {
                navigateWithLoading('/pricing', 'Loading pricing plans...');
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
          </motion.button>     
          
                    <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigateWithLoading('/jobs', 'Loading job opportunities...')}
            className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100 hover:shadow-xl transition-all duration-200 text-left cursor-pointer relative overflow-hidden"
          >
            {/* New Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
              className="absolute top-3 right-3"
            >
              <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-emerald-400 to-teal-500 text-white rounded-full text-xs font-bold shadow-lg">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                </svg>
                New
              </div>
            </motion.div>

            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0H8m0 0v.5A3.5 3.5 0 0011.5 10h1A3.5 3.5 0 0016 6.5V6H8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Job Board</h3>
            <p className="text-gray-600">Browse remote jobs and career opportunities</p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigateWithLoading('/playground', 'Loading AI playground...')}            className="bg-white rounded-xl p-6 shadow-lg border border-purple-100 hover:shadow-xl transition-all duration-200 text-left cursor-pointer relative overflow-hidden"
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

          {/* <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigateWithLoading('/referrals', 'Loading referrals...')}
            className="bg-white rounded-xl p-6 shadow-lg border border-indigo-100 hover:shadow-xl transition-all duration-200 text-left cursor-pointer relative overflow-hidden"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
              className="absolute top-3 right-3"
            >
              <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-indigo-400 to-purple-500 text-white rounded-full text-xs font-bold shadow-lg">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                Popular
              </div>
            </motion.div>

            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Referrals Hub</h3>
            <p className="text-gray-600">Connect with professionals and earn rewards</p>
          </motion.button> */}

          

          {/* Admin-only Company Manager Button */}
          <AnimatePresence>
            {isAdmin && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigateWithLoading('/admin/company-manager', 'Loading admin panel...')}
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

          {/* <motion.button
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
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">AI Optimization
              <motion.span 
                    className="ml-2 text-xs px-2 py-1 bg-[var(--secondary-light)] text-white rounded-full cursor-pointer"
                  >
                    Coming Soon
             </motion.span>
             </h3>
            <p className="text-gray-600">Comprehensive Job Description To Resume Optimization Providing AI Assistance</p>              </motion.button>
              */}

          {/* Upgrade to Pro Card - Show only for non-premium users */}
          <AnimatePresence>
            {!user.isPremium && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigateWithLoading('/pricing', 'Loading pricing plans...')}
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
                  <p className="text-white/90 text-sm mb-4">Unlock unlimited reviews, premium templates, and exclusive features</p>
                  
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
                onClick={() => navigateWithLoading('/pricing', 'Loading pricing plans...')}
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
          </AnimatePresence>
        </motion.div>



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
                <Link href="/audit" className="block text-sm text-gray-600 hover:text-[var(--primary)] transition-colors">Resume Review</Link>
                <Link href="/job-matcher" className="block text-sm text-gray-600 hover:text-[var(--primary)] transition-colors">Resume - Job Matcher</Link>
                <Link href="/referrals" className="block text-sm text-gray-600 hover:text-[var(--primary)] transition-colors">Referrals Hub 🤝</Link>
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
};

export default function DashboardPage() {
  return (
    <NotificationProvider>
      <DashboardContent />
    </NotificationProvider>
  );
}