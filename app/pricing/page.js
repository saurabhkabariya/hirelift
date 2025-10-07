'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import FeedbackButton from '../../components/feedback/FeedbackButton';
import PaymentLoadingModal from '@/components/payment/PaymentLoadingModal';
import PaymentErrorModal from '@/components/payment/PaymentErrorModal';
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
  ArrowLeft
} from 'lucide-react';
import { getPricingForCountry } from '@/utils/getUserCountry';

export default function PricingPage() {
  const { user, refetchUser } = useAuth();
  const router = useRouter();
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [oneTimePaymentLoading, setOneTimePaymentLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState('preparing');
  const [paymentError, setPaymentError] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  
  // Location and pricing state
  const [countryData, setCountryData] = useState({ country: 'IN', currency: 'INR', symbol: '₹' });
  const [pricingConfig, setPricingConfig] = useState(getPricingForCountry('IN'));
  const [locationLoading, setLocationLoading] = useState(true);

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

  // Handle Basic plan one-time upgrade (30 days)
  const handleBasicUpgrade = async () => {
    if (!user) {
      router.push('/auth?redirect=' + encodeURIComponent('/pricing'));
      return;
    }

    if (user.isPremium && user.proPlanType === 'basic') {
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

  // Handle different plan upgrades
  const handlePlanUpgrade = async (plan) => {
    if (!user) {
      router.push('/auth?redirect=' + encodeURIComponent('/pricing'));
      return;
    }

    try {
      switch (plan.paymentType) {
        case 'free':
          router.push('/audit');
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
      name: 'Free',
      price: `${pricingConfig.symbol}0`,
      billing: '',
      description: 'Get started with basic resume insights',
      features: [
        '1 free ATS check',
        'Basic templates through playground',
        'Email templates access',
        'Basic scoring insights'
      ],
      buttonText: 'Get Started Free',
      popular: false,
      icon: Users,
      paymentType: 'free'
    },
    {
      id: 'basic',
      name: 'Basic',
      price: `${pricingConfig.symbol}${pricingConfig.amounts.basic}`,
      originalPrice: `${pricingConfig.symbol}${pricingConfig.originalPrices.basic}`,
      billing: '/one-time (30 days)',
      description: 'Perfect for active job seekers - 30 days access',
      features: [
        'Unlimited ATS checks (30 days)',
        'HR Directory access',
        'Advanced scoring insights',
        'Keyword optimization tips',
        'Priority email support',
        'Resume templates'
      ],
      buttonText: user?.isPremium && user?.proPlanType === 'basic'
        ? 'Current Plan'
        : 'Get Basic Plan',
      popular: true,
      onSale: true,
      salePercentage: 50,
      icon: Crown,
      paymentType: 'onetime',
      disabled: user?.isPremium && user?.proPlanType === 'basic'
    },
    {
      id: 'resume-fix',
      name: 'Resume ATS Fix',
      price: `${pricingConfig.symbol}${pricingConfig.amounts['resume-fix']}`,
      billing: '/one-time',
      description: 'Professional resume optimization for ATS',
      features: [
        'Everything in Basic (30 days)',
        'Professional resume review',
        'ATS optimization fixes',
        '1 revision included',
        'Expert recommendations',
        'Guaranteed ATS improvement'
      ],
      buttonText: 'Fix My Resume',
      popular: false,
      icon: Shield,
      paymentType: 'onetime'
    },
    {
      id: 'professional',
      name: 'Professional',
      price: `${pricingConfig.symbol}${pricingConfig.amounts.professional}`,
      billing: '/one-time',
      description: 'Complete resume rewrite or new resume creation',
      features: [
        'Everything in Basic (30 days)',
        'Complete resume rewrite OR new resume',
        'Industry-specific optimization',
        '2 revisions included',
        'ATS + human recruiter optimization',
        'Personal consultation call'
      ],
      buttonText: 'Get Professional Resume',
      popular: false,
      icon: Award,
      paymentType: 'onetime'
    },
    {
      id: 'premium',
      name: 'Premium',
      price: `${pricingConfig.symbol}${pricingConfig.amounts.premium}`,
      billing: '/one-time',
      description: 'Complete career optimization package',
      features: [
        'Everything in Professional',
        'LinkedIn profile optimization',
        'Custom cover letter template',
        'Interview preparation guide',
        'Job search strategy consultation',
        '30-day follow-up support'
      ],
      buttonText: 'Complete Career Upgrade',
      popular: false,
      icon: Sparkles,
      paymentType: 'onetime'
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
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Choose Your Career Growth Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
            From basic ATS checks to complete career optimization - find the perfect plan to accelerate your job search success.
          </p>
          
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
                  <th className="text-center py-4 px-2 font-semibold text-blue-600">Basic</th>
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
          window.open('mailto:support@hirelift.com', '_blank');
        }}
      />

      <FeedbackButton />
      
      {/* Footer */}
      <FooterSection />
    </div>
  );
}
