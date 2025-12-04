'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { usePageLoading } from '@/hooks/usePageLoading';
import { isAuthError, handleAuthError } from '@/lib/authUtils';
import { 
  Crown, 
  Shield, 
  Award, 
  Sparkles, 
  TrendingUp, 
  Target,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Zap,
  Star
} from 'lucide-react';

export default function UpgradeCTA({ totalScore, user }) {
  const router = useRouter();
  const { navigateWithLoading } = usePageLoading();

  const getUpgradeMessage = () => {
    if (totalScore >= 85) {
      return {
        title: "Excellent ATS Score! 🎉",
        subtitle: "But are interviews still missing? Let's optimize for human recruiters too.",
        description: "Your resume passes ATS perfectly, but human recruiters need different optimization. Upgrade to get more interviews and stand out from other candidates.",
        recommendedPlan: 'premium',
        urgency: 'medium',
        bgColor: 'from-blue-50 to-green-50',
        borderColor: 'border-blue-200'
      };
    } else if (totalScore >= 70) {
      return {
        title: "Good Score, But Room to Improve! 📈",
        subtitle: "Fix specific ATS issues to boost your score significantly.",
        description: "Your resume has potential but needs targeted fixes. Let our experts identify and resolve the specific issues holding you back from perfect ATS compatibility.",
        recommendedPlan: 'resume-fix',
        urgency: 'high',
        bgColor: 'from-orange-50 to-yellow-50',
        borderColor: 'border-orange-200'
      };
    } else {
      return {
        title: "Low ATS Score - Immediate Action Needed! ⚠️",
        subtitle: "Your resume needs professional optimization to pass ATS screening.",
        description: "Don't let ATS systems reject your resume before humans even see it. Get expert help to completely rewrite and optimize your resume for modern hiring systems.",
        recommendedPlan: 'professional',
        urgency: 'critical',
        bgColor: 'from-red-50 to-pink-50',
        borderColor: 'border-red-200'
      };
    }
  };

  const plans = {
    'resume-fix': {
      name: 'Resume ATS Fix',
      price: '₹299',
      originalPrice: null,
      savings: null,
      features: [
        'Fix specific ATS issues',
        '1 revision included',
        'Expert recommendations',
        'Keyword optimization',
        '48-hour delivery'
      ],
      icon: Shield,
      color: 'from-orange-500 to-red-500',
      ctaText: 'Fix My Resume',
      value: 'Perfect for targeted improvements'
    },
    'professional': {
      name: 'Professional Resume',
      price: '₹599',
      originalPrice: '₹899',
      savings: '₹300',
      features: [
        'Complete resume rewrite',
        '2 revisions included',
        'Personal consultation call',
        'ATS & human optimization',
        '72-hour delivery'
      ],
      icon: Award,
      color: 'from-blue-500 to-purple-500',
      ctaText: 'Rewrite My Resume',
      value: 'Most comprehensive solution'
    },
    'premium': {
      name: 'Premium Package',
      price: '₹999',
      originalPrice: '₹1,499',
      savings: '₹500',
      features: [
        'Resume + LinkedIn optimization',
        'Professional cover letter',
        'Interview preparation guide',
        '30-day support included',
        'Priority 24-hour delivery'
      ],
      icon: Sparkles,
      color: 'from-purple-500 to-pink-500',
      ctaText: 'Get Premium Package',
      value: 'Complete career transformation'
    }
  };

  const upgradeInfo = getUpgradeMessage();
  const plan = plans[upgradeInfo.recommendedPlan];
  const Icon = plan.icon;

  const handleUpgrade = (planType = null) => {
    if (!user) {
      navigateWithLoading('/auth?redirect=' + encodeURIComponent('/pricing'), 'Redirecting to sign in...');
      return;
    }
    
    // Check if user session is valid before proceeding
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      handleAuthError(router, '/pricing');
      return;
    }
    
    const targetPlan = planType || upgradeInfo.recommendedPlan;
    navigateWithLoading(`/pricing?plan=${targetPlan}`, 'Loading pricing plans...');
  };

  const getUrgencyIcon = () => {
    switch (upgradeInfo.urgency) {
      case 'critical':
        return <AlertTriangle className="w-6 h-6 text-red-500" />;
      case 'high':
        return <Zap className="w-6 h-6 text-orange-500" />;
      default:
        return <Star className="w-6 h-6 text-blue-500" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className={`mt-8 rounded-2xl p-8 shadow-xl border-2 bg-gradient-to-br ${upgradeInfo.bgColor} ${upgradeInfo.borderColor} relative overflow-hidden`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-4 right-4 w-32 h-32 bg-current rounded-full blur-3xl"></div>
        <div className="absolute bottom-4 left-4 w-24 h-24 bg-current rounded-full blur-2xl"></div>
      </div>

      {/* Header Section */}
      <div className="relative z-10">
        <div className="flex items-start gap-4 mb-6">
          <div className="flex-shrink-0">
            {getUrgencyIcon()}
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {upgradeInfo.title}
            </h3>
            <p className="text-lg text-gray-700 mb-3 font-medium">
              {upgradeInfo.subtitle}
            </p>
            <p className="text-gray-600 leading-relaxed">
              {upgradeInfo.description}
            </p>
          </div>
        </div>

        {/* Recommended Plan Card */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 mb-6 relative">
          {/* Popular/Recommended Badge */}
          <div className="absolute -top-3 left-6">
            <div className={`px-4 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${plan.color} shadow-lg`}>
              {upgradeInfo.urgency === 'critical' ? 'URGENT' : upgradeInfo.urgency === 'high' ? 'RECOMMENDED' : 'BEST CHOICE'}
            </div>
          </div>

          <div className="flex items-center justify-between mb-4 pt-2">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${plan.color} flex items-center justify-center shadow-lg`}>
                <Icon className="w-7 h-7 text-white" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900">{plan.name}</h4>
                <p className="text-sm text-gray-600">{plan.value}</p>
                <div className="flex items-center gap-2 mt-1">
                  {plan.originalPrice && (
                    <span className="text-lg text-gray-400 line-through">{plan.originalPrice}</span>
                  )}
                  <span className="text-2xl font-bold text-green-600">{plan.price}</span>
                  <span className="text-sm text-gray-500">one-time</span>
                  {plan.savings && (
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">
                      Save {plan.savings}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Features List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
            {plan.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-sm text-gray-700">{feature}</span>
              </div>
            ))}
          </div>

          {/* Main CTA Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleUpgrade()}
            className={`w-full py-4 px-6 rounded-xl font-bold text-white bg-gradient-to-r ${plan.color} hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 text-lg shadow-lg`}
          >
            {plan.ctaText}
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Alternative Options */}
        <div className="mb-6">
          <p className="text-center text-gray-600 mb-4 font-medium">
            Or choose a different plan:
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {Object.entries(plans).map(([key, planOption]) => {
              if (key === upgradeInfo.recommendedPlan) return null;
              
              return (
                <button
                  key={key}
                  onClick={() => handleUpgrade(key)}
                  className="px-4 py-2 text-sm font-medium border-2 rounded-lg hover:shadow-md transition-all duration-200 bg-white"
                  style={{
                    borderColor: planOption.color.includes('orange') ? '#f97316' : 
                                planOption.color.includes('blue') ? '#3b82f6' : '#a855f7',
                    color: planOption.color.includes('orange') ? '#f97316' : 
                           planOption.color.includes('blue') ? '#3b82f6' : '#a855f7'
                  }}
                >
                  {planOption.name} ({planOption.price})
                </button>
              );
            })}
          </div>
        </div>

        {/* Score-specific Benefits */}
        <div className="pt-6 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <h5 className="font-bold text-gray-900 mb-1">Higher ATS Score</h5>
              <p className="text-xs text-gray-600">Guaranteed improvement or money back</p>
            </div>
            <div>
              <Target className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <h5 className="font-bold text-gray-900 mb-1">More Interviews</h5>
              <p className="text-xs text-gray-600">Better recruiter appeal & response rate</p>
            </div>
            <div>
              <Crown className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <h5 className="font-bold text-gray-900 mb-1">Expert Review</h5>
              <p className="text-xs text-gray-600">Professional career consultant review</p>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>100+ Success Stories</span>
            </div>
            <div className="flex items-center gap-1">
              <Shield className="w-4 h-4 text-blue-500" />
              <span>100% Satisfaction Guarantee</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>4.9/5 Rating</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
