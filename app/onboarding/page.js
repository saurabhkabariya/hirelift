'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { usePageLoading } from '@/hooks/usePageLoading';
import { motion } from 'framer-motion';
import OnboardingFlow from '@/components/onboarding/OnboardingFlow';
import Head from 'next/head';

export default function OnboardingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { navigateWithLoading } = usePageLoading();

  // Check onboarding completion and handle redirects
  useEffect(() => {
    // Always wait for auth loading to complete before making any decisions
    if (loading) return;
    
    // Only redirect to auth if we're certain there's no user and not loading
    if (!user && !loading) {
      // Add a small delay to prevent immediate redirects that might conflict
      const redirectTimer = setTimeout(() => {
        navigateWithLoading('/auth', 'Redirecting to sign in...');
      }, 50);
      return () => clearTimeout(redirectTimer);
    }
    
    // If user exists, check onboarding completion
    if (user) {
      const onboardingCompleted = typeof window !== 'undefined' 
        ? localStorage.getItem('hireLiftOnboardingCompleted') === 'true'
        : false;
      
      if (onboardingCompleted) {
        // Redirect to dashboard if already completed
        navigateWithLoading('/dashboard', 'Redirecting to dashboard...');
      }
    }
  }, [user, loading, router]);

  // Show loading state while auth is being checked OR during redirects
  if (loading || (!user && !loading)) {
    const isRedirecting = !loading && !user;
    
    return (
      <>
        <Head>
          <title>Setting Up Your Profile - HireLift</title>
          <meta name="description" content="Personalizing your HireLift experience for career success" />
        </Head>
        
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <motion.div
                className="w-8 h-8 border-2 border-white border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {isRedirecting ? 'Redirecting to Login...' : 'Preparing Your Career Transformation'}
            </h2>
            <p className="text-gray-600">
              {isRedirecting ? 'Please wait while we redirect you to the login page' : 'Setting up your personalized HireLift experience...'}
            </p>
          </motion.div>
        </div>
      </>
    );
  }

  // Only render onboarding flow if user is authenticated and loading is complete
  if (!user) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Welcome to HireLift - Complete Your Setup</title>
        <meta name="description" content="Complete your HireLift onboarding to unlock personalized career acceleration tools and get hired faster." />
        <meta name="robots" content="noindex, nofollow" />
        
        {/* Onboarding-specific Open Graph */}
        <meta property="og:title" content="Welcome to HireLift - Complete Your Setup" />
        <meta property="og:description" content="Personalize your career acceleration experience with HireLift's onboarding flow." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={("https://www.hirelift.tech") + "/onboarding"} />
      </Head>
      
      <div className="min-h-screen">
        <OnboardingFlow />
      </div>
    </>
  );
}