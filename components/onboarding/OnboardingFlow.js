'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useOnboarding, OnboardingProvider } from '@/contexts/OnboardingContext';
import UserInfoStep from './UserInfoStep';
import FeaturesShowcaseStep from './FeaturesShowcaseStep';
import AuditStep from './AuditStep';
import PricingShowcaseStep from './PricingShowcaseStep';
import { 
  CheckCircle, 
  Users, 
  Sparkles, 
  FileCheck, 
  Crown,
  ArrowRight,
  Home,
  Star,
  Gift
} from 'lucide-react';

// Welcome step component
const WelcomeStep = ({ onComplete, user }) => {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowAnimation(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-700 to-indigo-800 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-white rounded-full opacity-10 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-yellow-400 rounded-full opacity-10 blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.1, 0.2]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-4">
        <div className="text-center text-white max-w-4xl">
          {/* Logo/Brand */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 200, 
              damping: 15,
              duration: 1 
            }}
            className="w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl"
          >
            <span className="text-4xl font-bold text-white">H</span>
          </motion.div>

          {/* Main headline */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              Welcome to&nbsp;
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400">
                HireLift
              </span>
            </h1>
          </motion.div>

          {/* Personalized greeting */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <h2 className="text-2xl md:text-4xl font-bold mb-4">
              {(user?.firstName && user.firstName.trim()) ? `Hi ${user.firstName.trim()}! ` : 'Hello there! '}
              Your Career Transformation Starts Here
            </h2>
            <p className="text-xl md:text-2xl text-blue-200 font-medium mb-8 max-w-3xl mx-auto">
              In the next 5 minutes, we'll personalize your HireLift experience and show you exactly how to land your dream job faster than ever before.
            </p>
          </motion.div>

          {/* Feature preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="grid md:grid-cols-3 gap-6 mb-12"
          >
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <Users className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
              <h3 className="font-bold text-lg mb-2">Personalize Experience</h3>
              <p className="text-blue-200 text-sm">Tell us about your career goals</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <FileCheck className="w-8 h-8 text-green-400 mx-auto mb-3" />
              <h3 className="font-bold text-lg mb-2">FREE Resume Analysis</h3>
              <p className="text-blue-200 text-sm">Get instant ATS optimization insights</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <Crown className="w-8 h-8 text-purple-400 mx-auto mb-3" />
              <h3 className="font-bold text-lg mb-2">Unlock Premium Features</h3>
              <p className="text-blue-200 text-sm">Access HR directory & templates</p>
            </div>
          </motion.div>

          {/* Emotional hook */}
          <AnimatePresence>
            {showAnimation && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-gradient-to-r from-green-400/20 to-blue-400/20 backdrop-blur-md rounded-2xl p-8 mb-8 border border-green-300/30"
              >
                <Star className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                <p className="text-2xl font-bold mb-2">
                  Ready to Stop Struggling with Your Job Search?
                </p>
                <p className="text-lg text-blue-200">
                  Join 2,847+ professionals who've transformed their careers with HireLift. 
                  Your dream job is closer than you think! 💪
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* CTA Button */}
          <motion.button
            onClick={onComplete}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.8 }}
            className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white font-black py-6 px-12 rounded-2xl text-xl md:text-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center gap-4 mx-auto"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Gift className="w-8 h-8" />
            Start My Career Transformation
            <ArrowRight className="w-8 h-8" />
          </motion.button>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5 }}
            className="text-blue-300 text-sm mt-6"
          >
            ✨ Takes less than 5 minutes • Completely free to start
          </motion.p>
        </div>
      </div>
    </div>
  );
};

// Completion step component
const CompletionStep = ({ userInfo, auditResult }) => {
  const router = useRouter();
  const { user } = useAuth();

  const handleGoToDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 via-emerald-700 to-teal-800 relative overflow-hidden">
      {/* Celebration animations */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 bg-yellow-400 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: -20,
              opacity: 1
            }}
            animate={{
              y: window.innerHeight + 20,
              opacity: 0
            }}
            transition={{
              duration: 3,
              delay: i * 0.2,
              repeat: Infinity,
              repeatDelay: 2
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-4">
        <div className="text-center text-white max-w-4xl">
          {/* Success animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="w-32 h-32 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl"
          >
            <CheckCircle className="w-16 h-16 text-white" />
          </motion.div>

          {/* Main message */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h1 className="text-5xl md:text-6xl font-black mb-6">
              🎉 Congratulations!
            </h1>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {userInfo?.fullName ? `${userInfo.fullName.split(' ')[0]}, y` : 'Y'}ou're All Set!
            </h2>
            <p className="text-xl md:text-2xl text-green-200 mb-8 max-w-3xl mx-auto">
              Welcome to the HireLift community! Your personalized career acceleration system is ready.
            </p>
          </motion.div>

          {/* Summary of what they accomplished */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-8 mb-8 border border-white/20"
          >
            <h3 className="text-2xl font-bold mb-6">What You've Accomplished:</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-3" />
                <h4 className="font-semibold text-lg mb-2">Profile Created</h4>
                <p className="text-green-200 text-sm">
                  {userInfo?.targetRole && `Target: ${userInfo.targetRole}`}
                </p>
              </div>
              <div className="text-center">
                <FileCheck className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                <h4 className="font-semibold text-lg mb-2">Resume Analyzed</h4>
                <p className="text-green-200 text-sm">
                  {auditResult ? `Score: ${auditResult.totalScore}/100` : 'Ready for analysis'}
                </p>
              </div>
              <div className="text-center">
                <Crown className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                <h4 className="font-semibold text-lg mb-2">System Activated</h4>
                <p className="text-green-200 text-sm">
                  {user?.isPremium ? 'Premium features unlocked' : 'Free features available'}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Next steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
          >
            <h3 className="text-2xl font-bold mb-6">What's Next?</h3>
            <div className="space-y-4 text-left max-w-2xl mx-auto mb-8">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-semibold text-lg">Explore Your Dashboard</h4>
                  <p className="text-green-200">Access all your personalized tools and features</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-semibold text-lg">Optimize Your Resume</h4>
                  <p className="text-green-200">Use your audit insights to improve your resume</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-semibold text-lg">Start Applying</h4>
                  <p className="text-green-200">Use our job board and HR directory to land interviews</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* CTA to dashboard */}
          <motion.button
            onClick={handleGoToDashboard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2 }}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-4 px-8 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-3 mx-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Home className="w-6 h-6" />
            Go to My Dashboard
            <ArrowRight className="w-6 h-6" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

// Main onboarding flow component
const OnboardingFlowContent = () => {
  const { 
    currentStep, 
    getCurrentStepInfo, 
    completeCurrentStep,
    onboardingData,
    ONBOARDING_STEPS 
  } = useOnboarding();
  const { user } = useAuth();
  const router = useRouter();

  const currentStepInfo = getCurrentStepInfo();

  // Handle step completion
  const handleStepComplete = (stepData) => {
    completeCurrentStep(stepData);
    
    // If we've reached the completion step, mark onboarding as done
    if (currentStep === ONBOARDING_STEPS.length - 1) {
      // Mark onboarding as completed in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('hireLiftOnboardingCompleted', 'true');
        localStorage.setItem('hireLiftOnboardingCompletedAt', new Date().toISOString());
      }
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push('/dashboard');
      }, 3000);
    }
  };

  // Render current step
  const renderCurrentStep = () => {
    switch (currentStepInfo.id) {
      case 'welcome':
        return (
          <WelcomeStep 
            onComplete={() => handleStepComplete()} 
            user={user}
          />
        );
      case 'user-info':
        return (
          <UserInfoStep 
            onComplete={handleStepComplete} 
            user={user}
          />
        );
      case 'features-showcase':
        return (
          <FeaturesShowcaseStep 
            onComplete={handleStepComplete}
            userInfo={onboardingData.userInfo}
          />
        );
      case 'free-audit':
        return (
          <AuditStep 
            onComplete={handleStepComplete}
            userInfo={onboardingData.userInfo}
          />
        );
      case 'pricing-showcase':
        return (
          <PricingShowcaseStep 
            onComplete={handleStepComplete}
            userInfo={onboardingData.userInfo}
            auditResult={onboardingData.auditResult}
          />
        );
      case 'completion':
        return (
          <CompletionStep 
            userInfo={onboardingData.userInfo}
            auditResult={onboardingData.auditResult}
          />
        );
      default:
        return (
          <WelcomeStep 
            onComplete={() => handleStepComplete()} 
            user={user}
          />
        );
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -300 }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 30,
          duration: 0.5 
        }}
      >
        {renderCurrentStep()}
      </motion.div>
    </AnimatePresence>
  );
};

// Main onboarding component with provider
const OnboardingFlow = () => {
  return (
    <OnboardingProvider>
      <OnboardingFlowContent />
    </OnboardingProvider>
  );
};

export default OnboardingFlow;