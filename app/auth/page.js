'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { usePageLoading } from '@/hooks/usePageLoading';
import AuthFlowManager from '@/components/auth/AuthFlowManager';
import FeedbackButton from '@/components/feedback/FeedbackButton';
import Link from 'next/link';
import Head from 'next/head';
import { 
  FiTrendingUp, 
  FiCheckCircle, 
  FiAward, 
  FiUsers, 
  FiZap,
  FiShield,
  FiStar
} from 'react-icons/fi';

export default function AuthPage() {
  const [mode, setMode] = useState('login');
  const { user, loading } = useAuth();
  const { navigateWithLoading } = usePageLoading();
  const router = useRouter();

  // Get redirect URL from search params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const redirectUrl = urlParams.get('redirect');
    const authMode = urlParams.get('mode');
    
    if (authMode === 'signup') {
      setMode('signup');
    }
  }, []);

  // Redirect if user is already authenticated
  useEffect(() => {
    if (user && !loading) {
      const urlParams = new URLSearchParams(window.location.search);
      const redirectUrl = urlParams.get('redirect');
      
      if (redirectUrl) {
        router.push(redirectUrl);
        return;
      }
      
      // Check if user has completed onboarding
      const onboardingCompleted = typeof window !== 'undefined' 
        ? localStorage.getItem('hireLiftOnboardingCompleted') === 'true'
        : false;
      
      // Check if this was a new signup (flag set by AuthFlowManager)
      const isNewSignup = typeof window !== 'undefined'
        ? sessionStorage.getItem('isNewSignup') === 'true'
        : false;
      
      if (isNewSignup && !onboardingCompleted) {
        // Clear the flag and redirect new users to onboarding
        sessionStorage.removeItem('isNewSignup');
        window.location.href = '/onboarding';
      } else {
        // Existing users go to dashboard
        router.push('/dashboard');
      }
    }
  }, [user, loading, router]);

  // Show loading screen while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </motion.div>
      </div>
    );
  }

  // Don't render auth page if user is already logged in
  if (user) {
    return null;
  }

  const stats = [
    { icon: FiUsers, value: '5K+', label: 'Active Users', gradient: 'from-blue-500 to-cyan-500' },
    { icon: FiTrendingUp, value: '3x', label: 'Faster Hiring', gradient: 'from-emerald-500 to-green-500' },
    { icon: FiAward, value: '95%', label: 'Success Rate', gradient: 'from-purple-500 to-pink-500' },
  ];

  const benefits = [
    { icon: FiCheckCircle, text: 'AI-Powered Resume Optimization', color: 'text-emerald-500' },
    { icon: FiZap, text: 'Beat ATS Systems Instantly', color: 'text-blue-500' },
    { icon: FiShield, text: 'Expert Career Guidance', color: 'text-purple-500' },
  ];

  return (
    <>
      {/* Enhanced SEO for Auth Page */}
      <Head>
        <title>Sign Up | Login - HireLift | Start Your Career Transformation</title>
        <meta name="description" content="Join HireLift to transform your job search with AI-powered resume optimization, ATS checking, and expert career coaching. Sign up free and get hired 3x faster." />
        <meta name="keywords" content="job seeker registration, career platform signup, resume optimizer account, ATS checker login, professional networking signup, career coaching registration, job search platform account, resume builder signup, career development account" />
        <meta name="robots" content="index, follow" />
        
        {/* Auth-specific Open Graph */}
        <meta property="og:title" content="Join HireLift - AI-Powered Career Transformation Platform" />
        <meta property="og:description" content="Sign up for free and transform your job search with AI resume optimization, ATS checking, and expert coaching. Join 50,000+ professionals worldwide." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={("https://www.hirelift.tech") + "/auth"} />
        <meta property="og:image" content={("https://www.hirelift.tech") + "/og-auth.jpg"} />
        
        {/* Registration Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": "HireLift Registration - Career Platform Signup",
              "url": ("https://www.hirelift.tech") + "/auth",
              "description": "Join HireLift's AI-powered career transformation platform. Free registration for job seekers worldwide.",
              "breadcrumb": {
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
                    "name": "Sign Up",
                    "item": ("https://www.hirelift.tech") + "/auth"
                  }
                ]
              },
              "potentialAction": {
                "@type": "RegisterAction",
                "target": ("https://www.hirelift.tech") + "/auth",
                "result": {
                  "@type": "UserAccount",
                  "description": "Free HireLift account for career optimization"
                }
              }
            })
          }}
        />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Gradient Orbs */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.3, scale: 1 }}
            transition={{ duration: 1.5 }}
            className="absolute -top-24 -left-24 w-96 h-96 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full blur-3xl"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.2, scale: 1 }}
            transition={{ duration: 1.5, delay: 0.3 }}
            className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-3xl"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.15, scale: 1 }}
            transition={{ duration: 1.5, delay: 0.6 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full blur-3xl"
          />
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMSkiLz48L2c+PC9zdmc+')] opacity-20"></div>
        </div>

        {/* Main Container */}
        <div className="relative z-10 min-h-screen flex items-center justify-center p-2 sm:p-4 lg:p-6 xl:p-8">
          <div className="w-full max-w-7xl mx-auto grid lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-8 xl:gap-12 items-center py-3 sm:py-4 lg:py-0">
            
            {/* Left Side - Emotional Storytelling */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="hidden lg:block space-y-4 xl:space-y-6"
            >
              

              {/* Main Headline */}
              <div className="space-y-3">

                {/* Logo */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className='flex justify-between'
                >
                  <Link href="/" className="inline-block">
                    <h1 className="text-3xl xl:text-4xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
                      HireLift
                    </h1>
                  </Link>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 backdrop-blur-sm border border-emerald-500/30 rounded-full px-3 py-1.5"
                  >
                    <FiStar className="text-yellow-400 w-4 h-4" />
                    <span className="text-emerald-300 text-xs xl:text-sm font-medium">Trusted by 50,000+ Professionals</span>
                  </motion.div>
                </motion.div>

                
                
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl xl:text-4xl 2xl:text-5xl font-bold text-white leading-tight"
                >
                  Stop Getting Rejected.
                  <span className="block bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent mt-1">
                    Start Getting Hired.
                  </span>
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-base xl:text-lg text-gray-300 leading-relaxed"
                >
                  Your resume isn't bad. It's just invisible to ATS systems. Join thousands who transformed their careers with AI-powered optimization.
                </motion.p>
              </div>

              {/* Benefits */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-2 xl:space-y-3"
              >
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-center gap-2.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-2.5 xl:p-3 hover:bg-white/10 transition-all duration-300"
                  >
                    <div className={`${benefit.color} bg-white/10 rounded-lg p-1.5`}>
                      <benefit.icon className="w-4 h-4 xl:w-5 xl:h-5" />
                    </div>
                    <span className="text-white font-medium text-sm xl:text-base">{benefit.text}</span>
                  </motion.div>
                ))}
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="grid grid-cols-3 gap-3"
              >
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1 + index * 0.1 }}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-2.5 xl:p-3 text-center hover:scale-105 transition-transform duration-300"
                  >
                    <div className={`inline-flex items-center justify-center w-7 h-7 xl:w-9 xl:h-9 rounded-lg bg-gradient-to-br ${stat.gradient} mb-1.5`}>
                      <stat.icon className="w-3.5 h-3.5 xl:w-4 xl:h-4 text-white" />
                    </div>
                    <div className="text-lg xl:text-xl font-bold text-white">{stat.value}</div>
                    <div className="text-xs text-gray-400">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Social Proof */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3 }}
                className="flex items-center gap-2.5 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-blue-500/20 rounded-xl p-2.5 xl:p-3"
              >
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-7 h-7 xl:w-9 xl:h-9 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 border-2 border-slate-900" />
                  ))}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1 mb-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <FiStar key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-xs text-gray-300">
                    <span className="font-semibold text-white">4.9/5</span> from 12,000+ reviews
                  </p>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Side - Auth Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full max-w-md mx-auto lg:mx-0 flex flex-col justify-center"
            >
              {/* Mobile Header */}
              <div className="lg:hidden text-center mb-2 sm:mb-3">
                <Link href="/" className="inline-block">
                  <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
                  >
                    HireLift
                  </motion.h1>
                </Link>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-gray-300 mt-0.5 text-xs"
                >
                  Transform Your Career Journey
                </motion.p>
              </div>

              {/* Auth Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl sm:rounded-2xl shadow-2xl px-2.5 py-2.5 sm:px-4 sm:py-4 space-y-2 sm:space-y-3"
              >
                {/* Card Header */}
                <div className="text-center space-y-1 sm:space-y-2">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                    {mode === 'login' ? 'Welcome Back!' : 'Start Free Today'}
                  </h2>
                  <p className="text-gray-300 text-xs leading-tight">
                    {mode === 'login' 
                      ? 'Continue your career transformation' 
                      : 'Join 5,000+ professionals getting hired faster'}
                  </p>
                </div>

                {/* Auth Flow */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={mode}
                    initial={{ opacity: 0, x: mode === 'login' ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: mode === 'login' ? 20 : -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <AuthFlowManager mode={mode} />
                  </motion.div>
                </AnimatePresence>

                {/* Mode Toggle */}
                <div className="text-center pt-1.5 sm:pt-2 border-t border-white/10">
                  <p className="text-gray-300 text-xs">
                    {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
                    <button
                      onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                      className="text-blue-400 hover:text-blue-300 font-semibold transition-colors ml-1"
                    >
                      {mode === 'login' ? 'Sign up free' : 'Sign in'}
                    </button>
                  </p>
                </div>

                {/* Trust Badges */}
                <div className="flex items-center justify-center gap-2 sm:gap-3 text-xs text-gray-400">
                  <div className="flex items-center gap-0.5 sm:gap-1">
                    <FiShield className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400" />
                    <span className="hidden sm:inline">Secure</span>
                  </div>
                  <div className="w-1 h-1 bg-gray-500 rounded-full hidden sm:block"></div>
                  <div className="flex items-center gap-0.5 sm:gap-1">
                    <FiZap className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-400" />
                    <span className="hidden sm:inline">Fast Setup</span>
                  </div>
                  <div className="w-1 h-1 bg-gray-500 rounded-full hidden sm:block"></div>
                  <div className="flex items-center gap-0.5 sm:gap-1">
                    <FiCheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-purple-400" />
                    <span className="hidden sm:inline">Free Forever</span>
                  </div>
                </div>
              </motion.div>

              {/* Mobile Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="lg:hidden grid grid-cols-3 gap-1.5 sm:gap-2 mt-2 sm:mt-3"
              >
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg sm:rounded-xl p-1.5 sm:p-2 text-center"
                  >
                    <div className={`inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-md sm:rounded-lg bg-gradient-to-br ${stat.gradient} mb-0.5 sm:mb-1`}>
                      <stat.icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                    </div>
                    <div className="text-sm sm:text-base font-bold text-white">{stat.value}</div>
                    <div className="text-[10px] sm:text-xs text-gray-400 leading-tight">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Floating Feedback Button */}
        <div className="fixed bottom-2 right-2 sm:bottom-4 sm:right-4 z-50">
          <FeedbackButton variant="floating" />
        </div>
      </div>
    </>
  );
}