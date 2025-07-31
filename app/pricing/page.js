'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import FeedbackButton from '../../components/feedback/FeedbackButton';
import PaymentLoadingModal, { PaymentButton } from '@/components/payment/PaymentLoadingModal';
import PaymentErrorModal from '@/components/payment/PaymentErrorModal';
import paymentService from '@/lib/payment';
import toast from 'react-hot-toast';
import { 
  Check, 
  Star, 
  Zap, 
  ArrowLeft,
  Crown,
  Infinity,
  Users,
  Shield,
  Award,
  Sparkles
} from 'lucide-react';

export default function PricingPage() {
  const { user, refetchUser } = useAuth();
  const router = useRouter();  const [paymentLoading, setPaymentLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState('preparing');
  const [subscription, setSubscription] = useState(null);
  const [loadingSubscription, setLoadingSubscription] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);

  // Fetch current subscription status
  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user) return;
      
      try {
        setLoadingSubscription(true);
        const subData = await paymentService.getCurrentSubscription();
        setSubscription(subData.subscription);
      } catch (error) {
        // User might not have a subscription, which is fine
        console.log('No active subscription found');
      } finally {
        setLoadingSubscription(false);
      }
    };

    fetchSubscription();
  }, [user]);

  // Handle Pro plan subscription
  const handleProUpgrade = async () => {
    try {
      // Check if user is logged in
      if (!user) {
        toast.error('Please sign in to upgrade to Pro');
        router.push('/auth');
        return;
      }

      // Check if user is already premium
      if (user.isPremium) {
        toast.success('You are already a Pro user!');
        return;
      }

      // Check for existing active subscription
      if (subscription && subscription.status === 'active') {
        toast.info('You already have an active subscription');
        return;
      }

      setLoadingStage('preparing');
      setPaymentLoading(true);

      // Create subscription using payment service
      await paymentService.createSubscription({
        planId: process.env.PLAN_ID, // Razorpay plan ID from the plans API
        totalCount: 12, // 12 months
        quantity: 1,
        user,
        onPaymentStart: () => {
          setLoadingStage('processing');
        },
        onSuccess: async (paymentResponse, subscription) => {
          setLoadingStage('completing');
          
          // Wait a bit for webhook to process
          setTimeout(async () => {
            try {
              // Refetch user data to get updated premium status
              await refetchUser();
              
              toast.success('🎉 Welcome to HireLift Pro! Your account has been upgraded.');
              router.push('/dashboard');
            } catch (error) {
              console.error('Error refreshing user data:', error);
              toast.success('Payment successful! Please refresh the page to see your Pro features.');
              router.push('/dashboard');
            } finally {
              setPaymentLoading(false);
            }
          }, 2000);
        },        onError: (error) => {
          console.error('Payment error:', error);
          setPaymentError(error);
          setShowErrorModal(true);
          setPaymentLoading(false);
        },
        onPaymentEnd: () => {
          setPaymentLoading(false);
        }
      });    } catch (error) {
      console.error('Upgrade error:', error);
      setPaymentError(error);
      setShowErrorModal(true);
      setPaymentLoading(false);
    }
  };

  const plans = [
    {
      name: 'Free',
      price: '₹0',
      description: 'Perfect for trying out our service',
      features: [
        '1 Basic Resume Audit',
        'Email/DM Templates With Playground',
        'Basic ATS Score',
        'Standard Support'
      ],
      buttonText: 'Get Started',
      buttonAction: () => router.push('/audit'),
      popular: false,
      icon: Users,
      color: 'var(--accent)'
    },    {
      name: 'Pro',
      price: '₹99/m',
      description: 'Most popular for job seekers',
      features: [
        'Unlimited Resume Audits',
        'Curated HR & Company Lists',
        'Personalized Outreach Templates',
        'Advanced ATS Analysis',
        'Keyword Optimization',
        'Priority Support'
      ],
      buttonText: user?.isPremium ? 'Current Plan' : 'Upgrade to Pro',
      buttonAction: user?.isPremium ? null : handleProUpgrade,
      popular: true,
      icon: Crown,
      color: 'var(--primary)',
      disabled: user?.isPremium
    },
    {
      name: 'AI Assistant',
      price: '₹499/m',
      description: 'Coming soon - AI-powered career guidance',
      features: [
        'Everything in Pro',
        'AI Job Assistance',
        'Future Skills Guidance',
        'Project Recommendations',
        'Company Matching',
        'Career Path Planning',
        'Personalized Learning',
        'Expert Consultation'
      ],
      buttonText: 'Notify Me',
      buttonAction: () => {
        alert('We\'ll notify you when AI Assistant is available!');
      },
      popular: false,
      comingSoon: true,
      icon: Sparkles,
      color: 'var(--secondary)'
    }
  ];

  // Animation variants
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const fadeIn = {
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

  const cardHover = {
    rest: { scale: 1 },
    hover: { 
      scale: 1.03,
      boxShadow: "0 20px 30px rgba(0, 0, 0, 0.1)",
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
        <div className="absolute top-[10%] left-[10%] w-72 h-72 bg-[var(--primary-light)] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-[40%] right-[15%] w-80 h-80 bg-[var(--secondary-light)] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[10%] left-[30%] w-96 h-96 bg-[var(--accent)] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass sticky top-0 z-50 backdrop-blur-lg shadow-sm border-b border-opacity-20 border-[var(--gray-300)]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <motion.button
                whileHover={{ scale: 1.1, x: -3 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.back()}
                className="mr-4 p-2 hover:bg-[var(--background-dark)]/10 rounded-xl transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-[var(--foreground)]" />
              </motion.button>
              <h1 className="text-2xl font-bold gradient-text">
                Pricing Plans
              </h1>
            </div>            {user && (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-[var(--foreground)]">
                  Current: <span className="font-bold">{user.isPremium ? 'Pro' : 'Free'}</span>
                </span>
                {user.isPremium && (
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                  >
                    <Crown className="w-3 h-3 mr-1" />
                    Premium
                  </motion.span>
                )}
                {loadingSubscription && (
                  <div className="animate-pulse text-xs text-gray-500">
                    Loading subscription...
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get unlimited resume audits, advanced ATS analysis, and personalized recommendations to land your dream job.
          </p>
        </motion.div>

        {/* Subscription Management for Premium Users */}
        {user?.isPremium && subscription && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                  <Crown className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Active Subscription</h3>
                  <p className="text-sm text-gray-600">
                    Status: <span className="capitalize font-medium text-green-600">{subscription.status}</span>
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Next billing</p>
                <p className="font-semibold text-gray-900">
                  {subscription.endAt ? new Date(subscription.endAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border-2 ${
                plan.popular 
                  ? 'border-purple-500 scale-105' 
                  : 'border-gray-100'
              } overflow-hidden`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-center py-2 text-sm font-medium">
                  <Star className="w-4 h-4 inline mr-1" />
                  Most Popular
                </div>
              )}
              
              {plan.comingSoon && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-gray-600 to-gray-700 text-white text-center py-2 text-sm font-medium">
                  <Zap className="w-4 h-4 inline mr-1" />
                  Coming Soon
                </div>
              )}

              <div className={`p-8 ${plan.popular || plan.comingSoon ? 'pt-12' : ''}`}>
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    {plan.price !== '₹0' && (
                      <span className="text-gray-600 ml-1">/month</span>
                    )}
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <motion.li
                      key={featureIndex}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (index * 0.1) + (featureIndex * 0.05) }}
                      className="flex items-start"
                    >
                      <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </motion.li>
                  ))}
                </ul>                <PaymentButton
                  onClick={plan.buttonAction}
                  disabled={plan.comingSoon || plan.disabled}
                  isLoading={paymentLoading && plan.name === 'Pro'}
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                    plan.popular && !plan.disabled
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
                      : plan.comingSoon
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : plan.disabled
                      ? 'bg-green-100 text-green-700 cursor-default border-2 border-green-200'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  } focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                >
                  {plan.buttonText}
                </PaymentButton>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Features Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-100"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
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
              <h4 className="font-semibold text-gray-900 mb-2">Secure & Private</h4>
              <p className="text-sm text-gray-600">Your data is protected and never shared</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Infinity className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Unlimited Audits</h4>
              <p className="text-sm text-gray-600">Improve your resume continuously</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-yellow-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Expert Support</h4>
              <p className="text-sm text-gray-600">Get help when you need it</p>
            </div>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-100"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Frequently Asked Questions
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">What is ATS?</h4>
              <p className="text-sm text-gray-600">
                Applicant Tracking System (ATS) is software used by companies to filter and rank job applications. Our tool helps optimize your resume for these systems.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">How accurate is the analysis?</h4>
              <p className="text-sm text-gray-600">
                Our analysis is based on industry best practices and real ATS systems. We check for common issues that cause resumes to be rejected.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Can I cancel anytime?</h4>
              <p className="text-sm text-gray-600">
                Yes, you can cancel your subscription at any time. You&apos;ll continue to have access until the end of your billing period.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">What file formats are supported?</h4>
              <p className="text-sm text-gray-600">
                Currently, we support PDF files only. This ensures the best compatibility with ATS systems and accurate text extraction.
              </p>
            </div>
          </div>        </motion.div>
      </div>      {/* Payment Loading Modal */}
      <PaymentLoadingModal 
        isOpen={paymentLoading} 
        stage={loadingStage} 
      />

      {/* Payment Error Modal */}
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
          handleProUpgrade();
        }}
        onContactSupport={() => {
          // You can implement contact support functionality here
          window.open('mailto:support@hirelift.com?subject=Payment Issue', '_blank');
        }}
      />

      {/* Floating Feedback Button */}
      <FeedbackButton variant="floating" />
    </div>
  );
}