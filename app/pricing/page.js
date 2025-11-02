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
  Star,
  Gift
} from 'lucide-react';
import { getPricingForCountry } from '@/utils/getUserCountry';

import Head from 'next/head';
import CountdownTimer from '../../components/conversion/CountdownTimer';
import UrgencyBanner from '../../components/conversion/UrgencyBanner';
import ValueStack from '../../components/conversion/ValueStack';

export default function PricingPage() {
  const { user, refetchUser } = useAuth();
  const router = useRouter();
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [oneTimePaymentLoading, setOneTimePaymentLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState('preparing');
  const [paymentError, setPaymentError] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  
  // Trial management
  const { 
    trialStatus, 
    claimTrial, 
    claimingTrial, 
    shouldShowExpiryWarning,
    trialDaysLeft,
    canShowClaimButton
  } = useTrialStatus();
  const [showTrialExpiryPopup, setShowTrialExpiryPopup] = useState(false);
  
  // Handle trial status errors gracefully
  const safeCanShowClaimButton = user && !trialStatus.loading && !trialStatus.error ? 
    canShowClaimButton : 
    (user && !user.hasClaimedTrial && !user.isPremium);
  
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
          await refetchUser();
          setPaymentLoading(false);
          toast.success('Successfully upgraded to Basic plan!');
          router.push('/dashboard');
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
          await refetchUser();
          setOneTimePaymentLoading(false);
          toast.success(`Successfully upgraded to ${plan.name}!`);
          router.push('/dashboard');
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
      router.push('/auth');
      return;
    }

    if (claimingTrial) return;

    const result = await claimTrial();
    
    if (result.success) {
      toast.success('🎉 Trial activated! You now have 7 days of premium access.');
      await refetchUser(); // Refresh user data
    } else {
      toast.error(result.error || 'Failed to activate trial. Please try again.');
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
          await handleTrialClaim();
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
    // Special 7-day trial plan
    ...(safeCanShowClaimButton ? [{
      id: 'trial',
      name: '7-Day FREE Trial',
      price: `${pricingConfig.symbol}0`,
      billing: '/7 days',
      description: '🎁 Try Career Accelerator FREE for 7 days',
      features: [
        'Everything in Career Accelerator',
        'Unlimited Resume Reviews',
        '1,000+ HR Directory Access', 
        'Advanced ATS Optimization',
        'Proven Email Templates Library',
        'Priority Expert Support',
        'No Credit Card Required ✅',
        'Cancel anytime - No strings attached'
      ],
      buttonText: claimingTrial ? 'Activating Trial...' : '🎁 Claim FREE 7-Day Trial',
      popular: true,
      icon: Gift,
      paymentType: 'trial',
      disabled: claimingTrial,
      specialOffer: true
    }] : []),
    {
      id: 'free',
      name: 'Free Trial',
      price: `${pricingConfig.symbol}0`,
      billing: '',
      description: 'Test our Auditor power before you buy',
      features: [
        '1 Resume Review (Worth $10)',
        'Basic ATS Score & Feedback',
        'Professional Email Templates Access',
        'Job Board Access (100+ jobs)',
        'Community Support',
        'No Credit Card Required ✅'
      ],
      buttonText: 'Start Free Trial',
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
        'Unlimited Resume Reviews (Worth $20+)',
        '1,000+ HR Directory Access',
        'Advanced ATS Optimization',
        'Proven Email Templates Library',
        'Priority Expert Support',
        'Access to Beta features'
      ],
      buttonText: userPlanStatus.hasActivePlan
        ? 'Career Accelerator - Current Plan'
        : '🚀 Get 3x Faster Results',
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
        'Everything in Career Accelerator (30 days)',
        'Professional human expert review',
        'Premium ATS optimization techniques',
        '1 expert revision included',
        'Personalized recommendations',
        'Guaranteed ATS score improvement',
        'High-quality premium resources'
      ],
      buttonText: userPlanStatus.hasActivePlan && userPlanStatus.currentPlan === 'resume-fix'
        ? 'Current Plan'
        : 'Fix My Resume',
      popular: false,
      icon: Shield,
      paymentType: 'onetime',
      disabled: userPlanStatus.hasActivePlan && userPlanStatus.currentPlan === 'resume-fix',
      expertInvolved: true
    },
    {
      id: 'professional',
      name: 'Professional',
      price: `${pricingConfig.symbol}${pricingConfig.amounts.professional}`,
      billing: '/one-time',
      description: '🚀 Expert-Crafted Professional Resume',
      features: [
        'Everything in Career Accelerator (30 days)',
        'Senior expert complete rewrite OR new resume',
        'Industry-specific premium optimization',
        '2 expert revisions included',
        'ATS + human recruiter optimization',
        'Personal 1-on-1 consultation call',
        'High-quality premium templates & resources',
        'Priority expert support'
      ],
      buttonText: userPlanStatus.hasActivePlan && userPlanStatus.currentPlan === 'professional'
        ? 'Current Plan'
        : 'Get Professional Resume',
      popular: false,
      icon: Award,
      paymentType: 'onetime',
      disabled: userPlanStatus.hasActivePlan && userPlanStatus.currentPlan === 'professional',
      expertInvolved: true
    },
    {
      id: 'premium',
      name: 'Premium',
      price: `${pricingConfig.symbol}${pricingConfig.amounts.premium}`,
      billing: '/one-time',
      description: '👑 Ultimate Career Transformation Package',
      features: [
        'Everything in Professional',
        'Expert LinkedIn profile optimization',
        'Custom cover letter by expert writer',
        'Personal interview coaching resources',
        'Job search strategy by career consultant',
        'Exclusive access to premium career resources',
        'VIP priority support & fastest turnaround',
        'Guaranteed career advancement guidance'
      ],
      buttonText: userPlanStatus.hasActivePlan && userPlanStatus.currentPlan === 'premium'
        ? 'Current Plan'
        : 'Complete Career Upgrade',
      popular: false,
      icon: Sparkles,
      paymentType: 'onetime',
      disabled: userPlanStatus.hasActivePlan && userPlanStatus.currentPlan === 'premium',
      expertInvolved: true
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
        <meta property="og:url" content="https://hirelift.vercel.app/pricing" />
        <meta property="og:image" content="https://hirelift.vercel.app/og-pricing.jpg" />
        
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
                "ratingCount": "2847"
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
                  "item": "https://hirelift.vercel.app"
                },
                {
                  "@type": "ListItem", 
                  "position": 2,
                  "name": "Pricing",
                  "item": "https://hirelift.vercel.app/pricing"
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

          {/* Trial Countdown */}
          <div className="flex justify-center mb-6">
            <TrialCountdown className="shadow-sm" />
          </div>

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

          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Join 5,000+ professionals who transformed their careers with our ATS resume optimization
          </p>
          
          {/* URGENCY + SCARCITY */}
          <div className="bg-gradient-to-r from-orange-100 to-red-100 border border-orange-200 rounded-lg px-6 py-4 mb-6 inline-block">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <span className="text-orange-800 font-bold">
                🔥 Limited Time: 50% OFF + Premium HRs access
              </span>
              <div className="flex items-center gap-2">
                <span className="text-orange-700 text-sm">Expires in:</span>
                <CountdownTimer 
                  targetDate={new Date(Date.now() + 24 * 60 * 60 * 1000)} // 24 hours from now
                  onExpiry={() => console.log('Offer expired!')}
                />
              </div>
            </div>
          </div>

          {/* SOCIAL PROOF STATS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-6">
            <div className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-cyan-600">5,000+</div>
              <div className="text-sm text-gray-600">Success Stories</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">95%</div>
              <div className="text-sm text-gray-600">ATS Pass Rate</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">3x</div>
              <div className="text-sm text-gray-600">Faster Results</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-600">4.9/5</div>
              <div className="text-sm text-gray-600">User Rating</div>
            </div>
          </div>

          {/* MONEY-BACK GUARANTEE */}
          <div className="bg-green-50 border border-green-200 rounded-lg px-6 py-3 mb-6 inline-block">
            <span className="text-green-800 font-medium">
              🛡️ <strong>30-Day Job Interview</strong> • Get 3x more interviews or full refund
            </span>
          </div>
          
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
          className="bg-white rounded-2xl shadow-lg p-8 mb-12"
        >
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Detailed Feature Comparison
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-2 font-semibold text-gray-900">Features</th>
                  <th className="text-center py-4 px-2 font-semibold text-gray-600">Free</th>
                  <th className="text-center py-4 px-2 font-semibold text-blue-600">Career Accelerator</th>
                  <th className="text-center py-4 px-2 font-semibold text-gray-600">ATS Fix</th>
                  <th className="text-center py-4 px-2 font-semibold text-gray-600">Professional</th>
                  <th className="text-center py-4 px-2 font-semibold text-gray-600">Premium</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="py-4 px-2 font-medium">ATS Checks</td>
                  <td className="text-center py-4 px-2">1 check</td>
                  <td className="text-center py-4 px-2">Unlimited (30 days)</td>
                  <td className="text-center py-4 px-2">Unlimited (30 days)</td>
                  <td className="text-center py-4 px-2">Unlimited (30 days)</td>
                  <td className="text-center py-4 px-2">Unlimited (30 days)</td>
                </tr>
                <tr>
                  <td className="py-4 px-2 font-medium">Resume Optimization</td>
                  <td className="text-center py-4 px-2">-</td>
                  <td className="text-center py-4 px-2">-</td>
                  <td className="text-center py-4 px-2">ATS Fixes (1 revision)</td>
                  <td className="text-center py-4 px-2">Complete Rewrite (2 revisions)</td>
                  <td className="text-center py-4 px-2">Complete Rewrite (2 revisions)</td>
                </tr>
                <tr>
                  <td className="py-4 px-2 font-medium">LinkedIn Optimization</td>
                  <td className="text-center py-4 px-2">-</td>
                  <td className="text-center py-4 px-2">-</td>
                  <td className="text-center py-4 px-2">-</td>
                  <td className="text-center py-4 px-2">-</td>
                  <td className="text-center py-4 px-2">✓</td>
                </tr>
                <tr>
                  <td className="py-4 px-2 font-medium">Cover Letter</td>
                  <td className="text-center py-4 px-2">-</td>
                  <td className="text-center py-4 px-2">-</td>
                  <td className="text-center py-4 px-2">-</td>
                  <td className="text-center py-4 px-2">-</td>
                  <td className="text-center py-4 px-2">✓</td>
                </tr>
                <tr>
                  <td className="py-4 px-2 font-medium">HR Directory</td>
                  <td className="text-center py-4 px-2">-</td>
                  <td className="text-center py-4 px-2">✓ (30 days)</td>
                  <td className="text-center py-4 px-2">✓ (30 days)</td>
                  <td className="text-center py-4 px-2">✓ (30 days)</td>
                  <td className="text-center py-4 px-2">✓ (30 days)</td>
                </tr>
                <tr>
                  <td className="py-4 px-2 font-medium">Personal Consultation</td>
                  <td className="text-center py-4 px-2">-</td>
                  <td className="text-center py-4 px-2">-</td>
                  <td className="text-center py-4 px-2">-</td>
                  <td className="text-center py-4 px-2">✓</td>
                  <td className="text-center py-4 px-2">✓</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-50 rounded-2xl p-8"
        >
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Why Choose HireLift?
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
        
        {/* VALUE STACK - SHOWS MONETARY VALUE OF FREE OFFERING */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="py-12"
        >
          <div className="max-w-3xl mx-auto">
            <ValueStack 
              title="🎁 What You Get FREE Today (Limited Time)"
              totalValue={"Infinity"}
            />
          </div>
        </motion.section>
        
        {/* CONVERSION-BOOSTING TESTIMONIALS SECTION */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="py-16 mb-16"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Success Stories That Speak Volumes
            </h3>
            <p className="text-lg text-gray-600">
              Real results from real people who transformed their careers with HireLift
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">
                "Got 5 interview calls in just 2 weeks! HireLift's ATS optimization is incredible. Best career investment I've ever made."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  S
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Sarah Chen</p>
                  <p className="text-sm text-gray-600">Software Engineer at Google</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">
                "Landed my dream job at Microsoft with 40% salary increase. The professional rewrite service is worth every penny!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                  R
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Rahul Sharma</p>
                  <p className="text-sm text-gray-600">Product Manager at Microsoft</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">
                "After 6 months of job hunting with zero success, HireLift got me hired in 3 weeks. Changed my life completely!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                  P
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Priya Patel</p>
                  <p className="text-sm text-gray-600">Data Scientist at Amazon</p>
                </div>
              </div>
            </div>
          </div>

          {/* FINAL CTA AFTER TESTIMONIALS */}
          <div className="text-center mt-12">
            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200 rounded-2xl p-8 max-w-4xl mx-auto">
              <h4 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to Join These Success Stories?
              </h4>
              <p className="text-lg text-gray-600 mb-6">
                Don't let another opportunity slip away. Start your transformation today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button 
                  onClick={() => router.push('/audit')}
                  className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-cyan-500/30 transition-all duration-200"
                >
                  Start FREE Review Now
                </button>
                <p className="text-sm text-gray-600">⚡ Limited Time: 50% OFF</p>
              </div>
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
        trialEndDate={trialStatus.trialEndDate}
      />

      <FeedbackButton />
      
      {/* Urgency Banner for Additional Conversion Boost */}
      <UrgencyBanner onCTAClick={() => router.push('/audit')} />
      
      {/* Footer */}
      <FooterSection />
      </div>
    </>
  );
}
