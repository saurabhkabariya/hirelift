'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePageLoading } from '@/hooks/usePageLoading';
import { useTrialStatus } from '@/hooks/useTrialStatus';
import FeedbackButton from '../../components/feedback/FeedbackButton';
import PaymentLoadingModal from '@/components/payment/PaymentLoadingModal';
import PaymentErrorModal from '@/components/payment/PaymentErrorModal';
import TrialExpiryPopup from '@/components/trial/TrialExpiryPopup';
import TrialCountdown from '@/components/trial/TrialCountdown';
import paymentService from '@/lib/payment';
import oneTimePaymentService from '@/lib/oneTimePayment';
import { isAuthError, handleAuthError } from '@/lib/authUtils';
import toast from 'react-hot-toast';
import PricingCard from '../../components/PricingCard';
import FooterSection from '../../components/sections/FooterSection';
import { 
  Zap, 
  Crown,
  Users,
  Shield,
  Award,
  Sparkles,
  ArrowLeft,
  Gift
} from 'lucide-react';
import { getPricingForCountry } from '@/utils/getUserCountry';

import Head from 'next/head';

export default function PricingPage() {
  const { user, refetchUser } = useAuth();
  const router = useRouter();
  const { navigateWithLoading } = usePageLoading();
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [oneTimePaymentLoading, setOneTimePaymentLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState('preparing');
  const [paymentError, setPaymentError] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  
  // Trial management
  const trialData = useTrialStatus();
  const [showTrialExpiryPopup, setShowTrialExpiryPopup] = useState(false);
  
  // Safely destructure with defaults
  const {
    trialEndDate = null,
    claimTrial,
    claimingTrial = false,
    canClaimTrial = false,
    loading = true,
    error = null,
    isTrialActive = false,
    daysRemaining = 0
  } = trialData || {};
  
  // Calculate helper values
  const shouldShowExpiryWarning = isTrialActive && daysRemaining <= 2 && daysRemaining > 0;
  const trialDaysLeft = Math.max(0, daysRemaining);
  
  // Handle trial status errors gracefully and ensure it updates after trial claiming
  const safeCanShowClaimButton = useMemo(() => {
    if (!user) return false;
    if (loading || claimingTrial) return false; // Hide button while loading or claiming
    if (error) return false;
    
    // Don't show if user already has premium or has claimed trial
    if (user.isPremium || user.hasClaimedTrial) return false;
    
    // Show if trial data indicates user can claim trial
    return canClaimTrial;
  }, [user, loading, claimingTrial, error, canClaimTrial]);
  
  // Location and pricing state
  const [countryData, setCountryData] = useState({ country: 'IN', currency: 'INR', symbol: '₹' });
  const [pricingConfig, setPricingConfig] = useState(getPricingForCountry('IN'));
  const [locationLoading, setLocationLoading] = useState(true);

  // Helper function to get current user plan status
  const getUserPlanStatus = () => {
    if (!user || !user.isPremium) {
      return { hasActivePlan: false, currentPlan: null, isExpired: false, displayName: null };
    }

    // Check if plan is expired
    const now = new Date();
    const expiryDate = user.expiryDate ? new Date(user.expiryDate) : null;
    const isExpired = expiryDate && now >= expiryDate;

    if (isExpired) {
      return { hasActivePlan: false, currentPlan: null, isExpired: true, displayName: null };
    }

    // Get current plan type for internal logic
    const currentPlan = user.planDetails?.type || user.proPlanType;
    
    // When isPremium is true, always display as "Career Accelerator"
    return { 
      hasActivePlan: true, 
      currentPlan: currentPlan, // Keep original plan for button logic
      displayName: 'Career Accelerator', // Display name for UI
      isExpired: false 
    };
  };

  const userPlanStatus = useMemo(() => getUserPlanStatus(), [user]);

  // Detect user location on client side
  useEffect(() => {
    const detectLocation = async () => {
      try {
        const response = await fetch('/api/detect-location');
        if (response.ok) {
          const locationData = await response.json();
          setCountryData(locationData);
          setPricingConfig(getPricingForCountry(locationData.country));
        }
      } catch (error) {
        console.error('Error detecting location:', error);
        // Keep default India pricing
      } finally {
        setLocationLoading(false);
      }
    };

    detectLocation();
  }, []);

  // Check for trial expiry and show popup
  useEffect(() => {
    if (shouldShowExpiryWarning && !showTrialExpiryPopup) {
      // Show popup when trial is about to expire or has expired
      setShowTrialExpiryPopup(true);
    }
  }, [shouldShowExpiryWarning, showTrialExpiryPopup]);

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const syncUserAfterPayment = async () => {
    for (let attempt = 0; attempt < 8; attempt++) {
      await refetchUser();
      router.refresh();

      // give the backend/webhook time to finish writing isPremium=true
      await delay(800 + attempt * 250);

      const updatedPlan = getUserPlanStatus();
      if (updatedPlan.hasActivePlan) {
        return updatedPlan;
      }
    }

    return getUserPlanStatus();
  };

  // Handle Basic plan one-time upgrade (30 days)
  const handleBasicUpgrade = async () => {
    if (!user) {
      router.push('/auth?redirect=' + encodeURIComponent('/pricing'));
      return;
    }

    if (userPlanStatus.hasActivePlan && userPlanStatus.currentPlan === 'basic') {
      toast.success('You already have the Basic plan!');
      return;
    }

    try {
      setPaymentLoading(true);
      setLoadingStage('preparing');

      await oneTimePaymentService.createOneTimePayment({
        amount: 99,
        description: 'HireLift Basic Plan (30 days)',
        user,
        router, // Pass router for auth error handling
        planType: 'basic',
        onPaymentStart: () => {
          setLoadingStage('processing');
        },
        onPaymentSuccess: async () => {
          setLoadingStage('verifying');

          await syncUserAfterPayment();

          setPaymentLoading(false);
          toast.success('Successfully upgraded to Basic plan!');
          navigateWithLoading('/dashboard', 'Redirecting to dashboard...');
        },
        onPaymentError: (error) => {
          // Check for JWT expiration or auth errors
          if (isAuthError(error)) {
            handleAuthError(router, '/pricing');
            return;
          }
          setPaymentError(error);
          setShowErrorModal(true);
          setPaymentLoading(false);
        },
        onPaymentEnd: () => {
          setPaymentLoading(false);
        }
      });
    } catch (error) {
      console.error('Basic plan upgrade error:', error);
      
      // Check for JWT expiration or auth errors
      if (isAuthError(error)) {
        handleAuthError(router, '/pricing');
        return;
      }
      
      setPaymentError(error);
      setShowErrorModal(true);
      setPaymentLoading(false);
    }
  };

  // Handle one-time upgrades for all paid plans
  const handleOneTimeUpgrade = async (plan) => {
    // Check if user already has this plan active
    if (userPlanStatus.hasActivePlan && userPlanStatus.currentPlan === plan.id) {
      toast.success(`You already have the ${plan.name} plan!`);
      setOneTimePaymentLoading(false);
      return;
    }

    setLoadingStage('preparing');
    setOneTimePaymentLoading(true);

    const descriptions = {
      'basic': 'HireLift Basic Plan (30 days)',
      'resume-fix': 'HireLift Resume ATS Fix Service',
      'professional': 'HireLift Professional Resume Service',
      'premium': 'HireLift Premium Career Optimization Package'
    };

    try {
      await oneTimePaymentService.createOneTimePayment({
        amount: pricingConfig.amounts[plan.id],
        currency: pricingConfig.currency,
        description: descriptions[plan.id],
        user,
        router, // Pass router for auth error handling
        planType: plan.id,
        onPaymentStart: () => {
          setLoadingStage('processing');
        },
        onPaymentSuccess: async () => {
          setLoadingStage('verifying');

          await syncUserAfterPayment();

          setOneTimePaymentLoading(false);
          toast.success(`Successfully upgraded to ${plan.name}!`);
          router.push('/dashboard');
          router.refresh();
        },
        onPaymentError: (error) => {
          // Check for JWT expiration or auth errors
          if (isAuthError(error)) {
            handleAuthError(router, '/pricing');
            return;
          }
          setPaymentError(error);
          setShowErrorModal(true);
          setOneTimePaymentLoading(false);
        },
        onPaymentEnd: () => {
          setOneTimePaymentLoading(false);
        }
      });
    } catch (error) {
      console.error('One-time payment error:', error);
      
      // Check for JWT expiration or auth errors
      if (isAuthError(error)) {
        handleAuthError(router, '/pricing');
        return;
      }
      
      setPaymentError(error);
      setShowErrorModal(true);
      setOneTimePaymentLoading(false);
    }
  };

  // Handle trial claiming
  const handleTrialClaim = async () => {
    if (!user) {
      toast.error('Please sign in to claim your free trial');
      navigateWithLoading('/auth', 'Redirecting to sign in...');
      return { success: false, error: 'Not authenticated' };
    }

    if (claimingTrial) {
      return { success: false, error: 'Already claiming trial' };
    }

    try {
      const result = await claimTrial();
      
      console.log('Trial claim result:', result); // Debug log
      
      if (result && result.success) {
        toast.success('🎉 Trial activated! You now have 7 days of premium access.');
        await syncUserAfterPayment(); // Refresh user data immediately
        return result;
      } else {
        const errorMessage = result?.error || 'Failed to activate trial. Please try again.';
        console.error('Trial claim failed:', errorMessage);
        toast.error(errorMessage);
        return result || { success: false, error: errorMessage };
      }
    } catch (error) {
      console.error('Trial claim error:', error);
      const errorMessage = 'An unexpected error occurred. Please try again.';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Handle different plan upgrades
  const handlePlanUpgrade = async (plan) => {
    if (!user) {
      router.push('/auth?redirect=' + encodeURIComponent('/pricing'));
      return;
    }

    // Check if user already has this plan active (for all plan types)
    if (userPlanStatus.hasActivePlan && userPlanStatus.currentPlan === plan.id) {
      toast.success(`You already have the ${plan.name} plan!`);
      return;
    }

    try {
      switch (plan.paymentType) {
        case 'free':
          router.push('/audit');
          break;
          
        case 'trial':
          const result = await handleTrialClaim();
          // Don't redirect if trial claiming was successful - stay on pricing page to show success
          if (result && result.success) {
            // Trial activated successfully, user stays on pricing page
            // Show additional success feedback
            setTimeout(() => {
              toast.success(`🚀 You're now a premium user! Enjoy ${result.trialInfo?.daysRemaining || 7} days of full access.`);
            }, 1500);
            
            // Force component re-render to update plan display
            // The safeCanShowClaimButton will be recalculated and trial plan will be hidden
            setTimeout(async () => {
              await refetchUser(); // This will update the user state and trigger re-render
            }, 500);
            
            // Optionally scroll to show the updated plan status
            setTimeout(() => {
              const planStatusElement = document.querySelector('.bg-gradient-to-r.from-green-50.to-emerald-50');
              if (planStatusElement) {
                planStatusElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }, 2000);
          }
          break;
          
        case 'onetime':
          await handleOneTimeUpgrade(plan);
          break;
          
        default:
          console.warn('Unknown payment type:', plan.paymentType);
      }
    } catch (error) {
      console.error('Plan upgrade error:', error);
      
      // Check for JWT expiration or auth errors
      if (isAuthError(error)) {
        handleAuthError(router, '/pricing');
        return;
      }
      
      setPaymentError(error);
      setShowErrorModal(true);
    }
  };

  const plans = [
    {
      id: 'free',
      name: 'Free Plan',
      price: `${pricingConfig.symbol}0`,
      billing: '',
      description: 'See why recruiters ignore your resume before you spend a rupee.',
      features: [
        'ATS Resume Review ($10+ value): Instantly find what is blocking your resume from getting shortlisted.',
        '1 Free Resume-Job Match: AI-powered analysis to see how your resume matches any job description.',
        'Basic ATS Score & Feedback: Know exactly what to fix to improve your chances of interview calls.',
        'Professional Email Templates Access: Reach recruiters with proven, ready-to-use email formats.',
        'Job Board Access (100+ fresh jobs): Apply to real, fresh jobs—no fake posts, no ghosting.',
        'Community Support, Learn, ask: and grow with other job seekers on the same journey.',
        'No Credit Card Required',
        'Takes less than 2 minutes to get started'
      ],
      buttonText: 'Explore For Free',
      popular: false,
      icon: Users,
      paymentType: 'free'
    },
    {
      id: 'basic',
      name: 'Career Accelerator',
      price: `${pricingConfig.symbol}${pricingConfig.amounts.basic}`,
      originalPrice: `${pricingConfig.symbol}${pricingConfig.originalPrices.basic}`,
      billing: '/30 days',
      description: '🔥 Most Popular - Get hired 3x faster',
      features: [
        'Unlimited ATS Resume Audits: Fix, test, and optimize until your resume is recruiter-ready',
        'Unlimited Resume-Job Match Analysis: Compare your resume with unlimited jobs and get AI-powered suggestions',
        '100+ HR Contacts Directory: Reach real hiring managers directly instead of applying blindly',
        'Advanced ATS Optimization: Improve keyword match, structure, and visibility in hiring systems',
        'Proven Email Templates Library: Send confident, high-response emails that actually get replies',
        'Priority Expert Support: Get faster help when you’re stuck or unsure',
        'Early Access to Beta Features: Use powerful tools before everyone else',
        '+ more'
      ],
      buttonText: userPlanStatus.hasActivePlan
        ? 'Career Accelerator - Current Plan'
        : 'Get 3x Faster Results',
      popular: true,
      onSale: true,
      salePercentage: 50,
      icon: Crown,
      paymentType: 'onetime',
      disabled: userPlanStatus.hasActivePlan
    },
    {
      id: 'resume-fix',
      name: 'Resume ATS Fix',
      price: `${pricingConfig.symbol}${pricingConfig.amounts['resume-fix']}`,
      billing: '/one-time',
      description: '👨‍💼 Human Expert Resume Optimization',
      features: [
        'Everything in Career Accelerator (30 days): Full access to all pro tools and HR reach',
        'Human Expert Resume Review: Your resume is personally reviewed by a hiring expert',
        'Premium ATS Optimization: Advanced keyword, structure, and formatting improvements',
        '1 Expert Revision Included: Get changes refined until it is interview-ready',
        'Personalized Improvement Recommendations: Clear guidance tailored to your role and experience',
        'Guaranteed ATS Score Improvement: Measurable improvement you can see and trust',
      ],
      buttonText: userPlanStatus.hasActivePlan && userPlanStatus.currentPlan === 'resume-fix'
        ? 'Current Plan'
        : 'Fix My Resume',
      popular: false,
      icon: Shield,
      paymentType: 'onetime',
      disabled: userPlanStatus.hasActivePlan && userPlanStatus.currentPlan === 'resume-fix',
    }
  ];

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <>
      {/* Enhanced SEO for Pricing Page */}
      <Head>
        <title>Pricing Plans - HireLift | AI Resume Optimizer & Career Coaching</title>
        <meta name="description" content="Choose the perfect plan for your career goals. From free ATS resume checker to premium AI optimization with expert coaching. Affordable pricing for students, professionals, and job seekers worldwide." />
        <meta name="keywords" content="resume optimizer pricing, ATS checker cost, career coaching price, resume writing service cost, job search platform pricing, AI resume builder plans, professional resume service rates, affordable career coaching, resume optimization packages" />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        
        {/* Pricing-specific Open Graph */}
        <meta property="og:title" content="HireLift Pricing - AI Resume Optimizer & Career Coaching Plans" />
        <meta property="og:description" content="Affordable pricing for AI-powered resume optimization, ATS checking, and expert career coaching. Free plan available. Start your career transformation today." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={("https://www.hirelift.tech") + "/pricing"} />
        <meta property="og:image" content={("https://www.hirelift.tech") + "/og-pricing.jpg"} />
        
        {/* Pricing Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              "name": "HireLift AI Resume Optimizer",
              "description": "AI-powered resume optimization and career coaching platform",
              "brand": {
                "@type": "Brand",
                "name": "HireLift"
              },
              "offers": [
                {
                  "@type": "Offer",
                  "name": "Free Plan",
                  "price": "0",
                  "priceCurrency": "USD",
                  "description": "Free ATS resume analysis and basic optimization",
                  "availability": "https://schema.org/InStock",
                  "validFrom": new Date().toISOString()
                },
                {
                  "@type": "Offer", 
                  "name": "ATS Fix Plan",
                  "price": "10",
                  "priceCurrency": "USD", 
                  "description": "ATS-optimized resume with human expert review",
                  "availability": "https://schema.org/InStock",
                  "validFrom": new Date().toISOString()
                },
                {
                  "@type": "Offer",
                  "name": "Professional Plan", 
                  "price": "29",
                  "priceCurrency": "USD",
                  "description": "Advanced AI optimization with expert career coaching",
                  "availability": "https://schema.org/InStock",
                  "validFrom": new Date().toISOString()
                },
                {
                  "@type": "Offer",
                  "name": "Premium Plan",
                  "price": "79", 
                  "priceCurrency": "USD",
                  "description": "Complete career transformation with personal coach",
                  "availability": "https://schema.org/InStock",
                  "validFrom": new Date().toISOString()
                }
              ],
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "100"
              }
            })
          }}
        />
        
        {/* Breadcrumb Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org", 
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
                  "name": "Pricing",
                  "item": ("https://www.hirelift.tech") + "/pricing"
                }
              ]
            })
          }}
        />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Custom Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-xl border-b border-gray-200/50 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <motion.div 
              className="flex items-center gap-3 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              onClick={() => router.push('/')}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-400 to-cyan-400 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                H
              </div>
              <span className="text-2xl font-bold tracking-tight text-gray-900">
                HireLift
              </span>
            </motion.div>

            {/* Navigation */}
            <div className="flex items-center gap-4">
              <motion.button
                onClick={() => router.push('/jobs')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-200 font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0H8m0 0v.5A3.5 3.5 0 0011.5 10h1A3.5 3.5 0 0016 6.5V6H8z" />
                </svg>
                <span className="hidden sm:inline">Jobs</span>
              </motion.button>
              
              <motion.button
                onClick={() => router.back()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all duration-200 font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-40">
        <div className="absolute top-[10%] left-[10%] w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-[40%] right-[15%] w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[10%] left-[30%] w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">{/* Added pt-24 for header spacing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Land Your Dream Job 3x Faster
          </h1>

          {/* Current Plan Status - Show Career Accelerator when isPremium is true */}
          {userPlanStatus.hasActivePlan && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg px-6 py-3 mb-6 inline-block">
              <span className="text-green-800 font-bold">
                ✅ You're currently on: <span className="text-green-900">{userPlanStatus.displayName}</span>
              </span>
              {user.expiryDate && (
                <span className="text-green-700 text-sm ml-2">
                  (Expires: {new Date(user.expiryDate).toLocaleDateString()})
                </span>
              )}
            </div>
          )}

          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Join 100+ professionals who transformed their careers with our ATS resume optimization
          </p>

          {/* Simple guarantee */}
          {/* <div className="bg-green-50 border border-green-200 rounded-lg px-6 py-3 mb-8 inline-block">
            <span className="text-green-800 font-medium">
              🛡️ <strong>30-Day Money-Back Guarantee</strong>
            </span>
          </div> */}
          
          {/* Location and Currency Indicator */}
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            {locationLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
                <span>Detecting your location for pricing...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Prices shown in {pricingConfig.currency} for your region</span>
                {countryData.country === 'IN' ? (
                  <span className="text-green-600 font-medium">🇮🇳 India</span>
                ) : (
                  <span className="text-blue-600 font-medium">🌍 International</span>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* Desktop: 3 cards on top, 2 cards below */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="mb-16"
        >
          {locationLoading ? (
            /* Loading state for pricing cards */
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-8 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="space-y-2 mb-6">
                    {[...Array(4)].map((_, j) => (
                      <div key={j} className="h-3 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                  <div className="h-10 bg-gray-300 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Mobile: Single column */}
              <div className="block lg:hidden">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {plans.map((plan, index) => (
                    <PricingCard
                      key={plan.id}
                      plan={plan}
                      index={index}
                      onUpgrade={handlePlanUpgrade}
                      isPopular={plan.popular}
                    />
                  ))}
                </div>
              </div>

              {/* Desktop: 3 cards on top, 2 cards below */}
              <div className="hidden lg:block">
                {/* Top row: First 3 cards */}
                <div className="grid grid-cols-3 gap-6 mb-8 justify-items-center">
                  {plans.slice(0, 3).map((plan, index) => (
                    <div key={plan.id} className="w-full max-w-sm">
                      <PricingCard
                        plan={plan}
                        index={index}
                        onUpgrade={handlePlanUpgrade}
                        isPopular={plan.popular}
                      />
                    </div>
                  ))}
                </div>

                {/* Bottom row: Last 2 cards centered */}
                <div className="flex justify-center gap-6">
                  {plans.slice(3, 5).map((plan, index) => (
                    <div key={plan.id} className="w-full max-w-sm">
                      <PricingCard
                        plan={plan}
                        index={index + 3}
                        onUpgrade={handlePlanUpgrade}
                        isPopular={plan.popular}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </motion.div>



        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-50 rounded-2xl p-8 mb-16"
        >
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Why Choose HireLift?
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Fast Analysis</h4>
              <p className="text-sm text-gray-600">Get your ATS score in seconds</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Expert Service</h4>
              <p className="text-sm text-gray-600">Professional resume optimization</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Crown className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Proven Results</h4>
              <p className="text-sm text-gray-600">Higher interview callback rates</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-yellow-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Priority Support</h4>
              <p className="text-sm text-gray-600">Get help when you need it</p>
            </div>
          </div>
        </motion.section>
        

        

      </div>

      <PaymentLoadingModal
        isOpen={paymentLoading || oneTimePaymentLoading}
        stage={loadingStage}
        userEmail={user?.email || ''}
      />

      <PaymentErrorModal
        isOpen={showErrorModal}
        error={paymentError}
        onClose={() => {
          setShowErrorModal(false);
          setPaymentError(null);
        }}
        onRetry={() => {
          setShowErrorModal(false);
          setPaymentError(null);
        }}
        onContactSupport={() => {
          window.open('mailto:hirelift01@gmail.com', '_blank');
        }}
      />

      {/* Trial Expiry Popup */}
      <TrialExpiryPopup
        isVisible={showTrialExpiryPopup}
        onClose={() => setShowTrialExpiryPopup(false)}
        onUpgrade={() => {
          setShowTrialExpiryPopup(false);
          // Scroll to Career Accelerator plan or navigate to specific plan
          const careerAcceleratorElement = document.getElementById('basic-plan');
          if (careerAcceleratorElement) {
            careerAcceleratorElement.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        daysRemaining={trialDaysLeft}
        trialEndDate={trialEndDate}
      />

      <FeedbackButton />
      
      {/* Footer */}
      <FooterSection />
      </div>
    </>
  );
}
