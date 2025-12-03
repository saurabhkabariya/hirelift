'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Crown,
  Zap,
  Gift,
  CheckCircle,
  ArrowRight,
  Star,
  TrendingUp,
  Shield,
  Award,
  Sparkles,
  Users,
  Clock,
  DollarSign
} from 'lucide-react';
import { getPricingForCountry } from '@/utils/getUserCountry';
import paymentService from '@/lib/payment';
import oneTimePaymentService from '@/lib/oneTimePayment';
import { isAuthError, handleAuthError } from '@/lib/authUtils';
import toast from 'react-hot-toast';

const PricingShowcaseStep = ({ onComplete, userInfo, auditResult }) => {
  const { user, refetchUser } = useAuth();
  const router = useRouter();
  
  // Payment state
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState('preparing');
  
  // Location and pricing state
  const [countryData, setCountryData] = useState({ country: 'IN', currency: 'INR', symbol: '₹' });
  const [pricingConfig, setPricingConfig] = useState(getPricingForCountry('IN'));
  const [locationLoading, setLocationLoading] = useState(true);

  // Detect user location for pricing
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
      } finally {
        setLocationLoading(false);
      }
    };

    detectLocation();
  }, []);

  // Calculate emotional messaging based on audit result
  const getAuditBasedMessaging = () => {
    if (!auditResult) return null;
    
    const score = auditResult.totalScore || 0;
    
    if (score < 50) {
      return {
        urgency: 'HIGH',
        message: 'Your resume needs immediate attention!',
        description: 'With a score this low, most of your applications are being rejected by ATS systems.',
        color: 'from-red-500 to-orange-500',
        icon: '🚨'
      };
    } else if (score < 70) {
      return {
        urgency: 'MEDIUM',
        message: 'You\'re close, but missing key opportunities!',
        description: 'A few improvements could dramatically increase your interview chances.',
        color: 'from-yellow-500 to-orange-500',
        icon: '⚡'
      };
    } else {
      return {
        urgency: 'LOW',
        message: 'Great foundation! Let\'s make it perfect.',
        description: 'Your resume is good, but we can make it exceptional and give you an edge.',
        color: 'from-green-500 to-blue-500',
        icon: '✨'
      };
    }
  };

  const auditMessaging = getAuditBasedMessaging();

  // Define plans with dynamic messaging based on user data
  const plans = [
    {
      id: 'free',
      name: 'Free Trial',
      price: `${pricingConfig.symbol}0`,
      billing: '',
      description: 'Continue with basic features',
      features: [
        '1 Resume Review',
        'Basic ATS Score',
        'Job Board Access',
        'Community Support'
      ],
      buttonText: 'Continue Free',
      popular: false,
      icon: Users,
      paymentType: 'free',
      ctaStyle: 'secondary'
    },
    {
      id: 'basic',
      name: 'Career Accelerator',
      price: `${pricingConfig.symbol}${pricingConfig.amounts.basic}`,
      originalPrice: `${pricingConfig.symbol}${pricingConfig.originalPrices.basic}`,
      billing: '/30 days',
      description: '🔥 Most Popular - Get hired 3x faster',
      features: [
        'Unlimited Resume Reviews',
        '1,000+ HR Directory Access',
        'Advanced ATS Optimization',
        'Proven Email Templates Library',
        'Priority Expert Support',
        'Beta Features Access'
      ],
      buttonText: userInfo?.careerGoal === 'salary-increase' 
        ? '💰 Increase My Salary' 
        : userInfo?.jobSearchStatus === 'active'
        ? '🚀 Get Hired Faster'
        : '✨ Transform My Career',
      popular: true,
      onSale: true,
      salePercentage: 50,
      icon: Crown,
      paymentType: 'onetime',
      ctaStyle: 'primary',
      highlight: true
    },
    {
      id: 'resume-fix',
      name: 'Done For You Rewrite',
      price: `${pricingConfig.symbol}${pricingConfig.amounts['resume-fix']}`,
      billing: '/one-time',
      description: '👨‍💼 Expert Resume Rewrite Service',
      features: [
        'Everything in Career Accelerator',
        'Professional Expert Review',
        'Human-Written Optimization',
        '1 Expert Revision Included',
        'ATS Score Guarantee',
        'Premium Templates Access'
      ],
      buttonText: 'Fix My Resume Now',
      popular: false,
      icon: Shield,
      paymentType: 'onetime',
      ctaStyle: 'tertiary',
      expertInvolved: true
    }
  ];

  // Handle plan selection
  const handlePlanUpgrade = async (plan) => {
    if (plan.paymentType === 'free') {
      // Continue with free account
      handleComplete();
      return;
    }

    if (!user) {
      toast.error('Please complete signup first');
      return;
    }

    try {
      setPaymentLoading(true);
      setLoadingStage('preparing');

      const descriptions = {
        'basic': 'HireLift Career Accelerator (30 days)',
        'resume-fix': 'HireLift Expert Resume Rewrite Service'
      };

      await oneTimePaymentService.createOneTimePayment({
        amount: pricingConfig.amounts[plan.id],
        currency: pricingConfig.currency,
        description: descriptions[plan.id],
        user,
        router,
        planType: plan.id,
        onPaymentStart: () => {
          setLoadingStage('processing');
        },
        onPaymentSuccess: async () => {
          setLoadingStage('verifying');
          await refetchUser();
          setPaymentLoading(false);
          toast.success(`Welcome to ${plan.name}! 🎉`, {
            duration: 4000,
          });
          handleComplete();
        },
        onPaymentError: (error) => {
          if (isAuthError(error)) {
            handleAuthError(router, '/onboarding');
            return;
          }
          toast.error(error.message || 'Payment failed');
          setPaymentLoading(false);
        },
        onPaymentEnd: () => {
          setPaymentLoading(false);
        }
      });
    } catch (error) {
      console.error('Payment error:', error);
      if (isAuthError(error)) {
        handleAuthError(router, '/onboarding');
        return;
      }
      toast.error('Payment failed. Please try again.');
      setPaymentLoading(false);
    }
  };

  const handleComplete = () => {
    onComplete({ selectedPlan: 'completed' });
  };

  const handleSkip = () => {
    onComplete({ selectedPlan: 'skipped' });
  };

  if (locationLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-white"
        >
          <motion.div
            className="w-12 h-12 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p>Loading pricing for your region...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-gray-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full opacity-10 blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500 rounded-full opacity-10 blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        {/* Header with audit-based messaging */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          {auditMessaging && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 1 }}
              className={`inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r ${auditMessaging.color} text-white rounded-full mb-6 shadow-lg`}
            >
              <span className="text-2xl">{auditMessaging.icon}</span>
              <span className="font-bold text-lg">{auditMessaging.message}</span>
            </motion.div>
          )}

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Your Career Transformation
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
              Starts Now
            </span>
          </h1>

          <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8">
            {userInfo?.fullName && `${userInfo.fullName.split(' ')[0]}, `}
            you've taken the first step by analyzing your resume. 
            Now let's get you the interviews and {userInfo?.careerGoal === 'salary-increase' ? 'salary increase' : 'career advancement'} you deserve.
          </p>

          {auditResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 max-w-2xl mx-auto mb-8 border border-white/20"
            >
              <h3 className="text-lg font-semibold text-white mb-3">Your Current Resume Analysis:</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-yellow-400">{auditResult.totalScore}/100</div>
                  <div className="text-sm text-gray-300">ATS Score</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-400">{auditResult.foundKeywords?.length || 0}</div>
                  <div className="text-sm text-gray-300">Keywords Found</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-400">{auditResult.missingKeywords?.length || 0}</div>
                  <div className="text-sm text-gray-300">Missing Keywords</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-400">{auditResult.sectionScore || 0}</div>
                  <div className="text-sm text-gray-300">Section Score</div>
                </div>
              </div>
            </motion.div>
          )}

          <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
            <span>Prices shown in {pricingConfig.currency} for your region</span>
          </div>
        </motion.div>

        {/* Pricing plans */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className={`relative bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden ${
                plan.highlight ? 'ring-4 ring-yellow-400 scale-105 z-10' : ''
              }`}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute top-0 inset-x-0 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-center py-2 font-bold text-sm">
                  🔥 MOST POPULAR - LIMITED TIME
                </div>
              )}

              <div className="p-8 pt-12">
                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${plan.highlight ? 'from-yellow-400 to-orange-500' : 'from-gray-400 to-gray-600'} flex items-center justify-center mb-6`}>
                  <plan.icon className="w-8 h-8 text-white" />
                </div>

                {/* Plan details */}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                
                <div className="mb-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-gray-900">{plan.price}</span>
                    {plan.originalPrice && (
                      <span className="text-lg text-gray-500 line-through">{plan.originalPrice}</span>
                    )}
                    <span className="text-gray-600">{plan.billing}</span>
                  </div>
                  {plan.onSale && (
                    <div className="text-sm text-green-600 font-semibold mt-1">
                      Save {plan.salePercentage}% - Limited Time!
                    </div>
                  )}
                </div>

                <p className="text-gray-600 mb-6">{plan.description}</p>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <motion.button
                  onClick={() => handlePlanUpgrade(plan)}
                  disabled={paymentLoading}
                  className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                    plan.ctaStyle === 'primary'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                      : plan.ctaStyle === 'secondary'
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700'
                  } ${paymentLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  whileHover={!paymentLoading ? { scale: 1.02 } : {}}
                  whileTap={!paymentLoading ? { scale: 0.98 } : {}}
                >
                  {paymentLoading ? (
                    <>
                      <motion.div
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      Processing...
                    </>
                  ) : (
                    <>
                      <span>{plan.buttonText}</span>
                      {plan.ctaStyle !== 'secondary' && <ArrowRight className="w-5 h-5" />}
                    </>
                  )}
                </motion.button>

                {plan.expertInvolved && (
                  <div className="text-center mt-3 text-sm text-gray-600">
                    👨‍💼 Human expert involved
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Social proof and guarantees */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center text-white"
        >
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-4xl mx-auto border border-white/20">
            <h3 className="text-2xl font-bold mb-6">Why HireLift Users Get Results</h3>
            
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2">2,847+</div>
                <div className="text-gray-300">People Hired</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">75%</div>
                <div className="text-gray-300">Email Response Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">3x</div>
                <div className="text-gray-300">Faster Hiring</div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-lg text-gray-300 mb-4">
                "I was struggling for 6 months. After using HireLift's optimization and email templates, I landed my dream job in 3 weeks!"
              </p>
              <p className="text-sm text-gray-400">- Verified HireLift User</p>
            </div>

            <div className="flex items-center justify-center gap-8 mt-8 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                30-Day Money Back Guarantee
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Results in 14 Days or Refund
              </div>
            </div>
          </div>

          {/* Skip option */}
          <div className="mt-8">
            <button
              onClick={handleSkip}
              className="text-gray-400 hover:text-white underline transition-colors"
            >
              I'll upgrade later
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PricingShowcaseStep;