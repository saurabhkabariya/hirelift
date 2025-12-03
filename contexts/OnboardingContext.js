'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const OnboardingContext = createContext();

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};

export const OnboardingProvider = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState({
    userInfo: null,
    auditResult: null,
    hasCompletedOnboarding: false
  });
  const [loading, setLoading] = useState(false);

  // Onboarding steps configuration
  const ONBOARDING_STEPS = [
    {
      id: 'welcome',
      title: 'Welcome to Your Career Transformation',
      subtitle: 'Let\'s personalize your HireLift experience',
      description: 'We\'ll guide you through setting up your profile and show you the power of our platform.'
    },
    {
      id: 'user-info',
      title: 'Tell Us About Yourself',
      subtitle: 'Help us tailor HireLift to your career goals',
      description: 'This information helps us provide personalized recommendations and better job matching.'
    },
    {
      id: 'features-showcase',
      title: 'Discover Your Career Advantage',
      subtitle: 'See what makes HireLift different',
      description: 'Learn about the powerful features that will accelerate your job search.'
    },
    {
      id: 'free-audit',
      title: 'Your First Free Resume Review',
      subtitle: 'Get instant insights into your resume\'s ATS performance',
      description: 'Experience our professional-grade ATS analysis - completely free for new users.'
    },
    {
      id: 'pricing-showcase',
      title: 'Unlock Your Full Career Potential',
      subtitle: 'Choose the plan that fits your career goals',
      description: 'Upgrade to access premium features and accelerate your job search success.'
    },
    {
      id: 'completion',
      title: 'You\'re All Set!',
      subtitle: 'Welcome to the HireLift community',
      description: 'Start exploring your dashboard and take control of your career journey.'
    }
  ];

  // Get current step info
  const getCurrentStepInfo = () => {
    return ONBOARDING_STEPS[currentStep] || ONBOARDING_STEPS[0];
  };

  // Progress calculation
  const getProgress = () => {
    return Math.round(((currentStep + 1) / ONBOARDING_STEPS.length) * 100);
  };

  // Navigation functions
  const nextStep = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const goToStep = (stepIndex) => {
    if (stepIndex >= 0 && stepIndex < ONBOARDING_STEPS.length) {
      setCurrentStep(stepIndex);
    }
  };

  // Data management functions
  const updateUserInfo = (userInfo) => {
    setOnboardingData(prev => ({
      ...prev,
      userInfo
    }));
  };

  const updateAuditResult = (auditResult) => {
    setOnboardingData(prev => ({
      ...prev,
      auditResult
    }));
  };

  const completeOnboarding = () => {
    setOnboardingData(prev => ({
      ...prev,
      hasCompletedOnboarding: true
    }));
    
    // Store completion status in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('hireLiftOnboardingCompleted', 'true');
      localStorage.setItem('hireLiftOnboardingCompletedAt', new Date().toISOString());
    }
  };

  // Check if onboarding is completed
  const isOnboardingCompleted = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('hireLiftOnboardingCompleted') === 'true';
    }
    return onboardingData.hasCompletedOnboarding;
  };

  // Reset onboarding (for testing or re-onboarding)
  const resetOnboarding = () => {
    setCurrentStep(0);
    setOnboardingData({
      userInfo: null,
      auditResult: null,
      hasCompletedOnboarding: false
    });
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('hireLiftOnboardingCompleted');
      localStorage.removeItem('hireLiftOnboardingCompletedAt');
    }
  };

  // Skip to specific step (for testing or special flows)
  const skipToAudit = () => {
    goToStep(3); // Skip to free-audit step
  };

  const skipToPricing = () => {
    goToStep(4); // Skip to pricing-showcase step
  };

  // Validation functions
  const canProceedToNextStep = () => {
    switch (getCurrentStepInfo().id) {
      case 'welcome':
        return true; // Always can proceed from welcome
      case 'user-info':
        return onboardingData.userInfo !== null; // Need user info to proceed
      case 'features-showcase':
        return true; // Always can proceed from features
      case 'free-audit':
        return onboardingData.auditResult !== null; // Need audit result to proceed
      case 'pricing-showcase':
        return true; // Can proceed whether they upgrade or not
      case 'completion':
        return false; // This is the final step
      default:
        return true;
    }
  };

  // Handle step completion
  const completeCurrentStep = (stepData = null) => {
    const currentStepInfo = getCurrentStepInfo();
    
    switch (currentStepInfo.id) {
      case 'user-info':
        if (stepData) {
          updateUserInfo(stepData);
        }
        break;
      case 'free-audit':
        if (stepData) {
          updateAuditResult(stepData);
        }
        break;
      case 'completion':
        completeOnboarding();
        break;
    }
    
    // Auto-advance to next step
    if (canProceedToNextStep()) {
      nextStep();
    }
  };

  const value = {
    // State
    currentStep,
    onboardingData,
    loading,
    setLoading,
    
    // Step configuration
    ONBOARDING_STEPS,
    getCurrentStepInfo,
    getProgress,
    
    // Navigation
    nextStep,
    prevStep,
    goToStep,
    
    // Data management
    updateUserInfo,
    updateAuditResult,
    completeCurrentStep,
    completeOnboarding,
    
    // Utility functions
    isOnboardingCompleted,
    resetOnboarding,
    skipToAudit,
    skipToPricing,
    canProceedToNextStep
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};