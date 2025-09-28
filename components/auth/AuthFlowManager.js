'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthForm from './AuthForm';
import OTPVerification from './OTPVerification';
import { useAuth } from '@/contexts/AuthContext';

export default function AuthFlowManager({ mode = 'login' }) {
  const [currentFlow, setCurrentFlow] = useState('auth'); // 'auth' | 'otp'
  const [pendingSignupData, setPendingSignupData] = useState(null);
  const [otpError, setOtpError] = useState(null);

  const { signUpWithEmail, setError } = useAuth();
  // Handle successful form submission (for signup, this means form is valid but OTP needed)
  const handleAuthFormSubmit = async (formData, isSignup) => {
    if (isSignup) {
      // For signup, we need to send OTP first before creating account
      try {
        const response = await fetch('/api/auth/send-otp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: formData.email }),
        });

        const data = await response.json();

        if (response.ok) {
          // Store signup data and move to OTP verification
          setPendingSignupData(formData);
          setCurrentFlow('otp');
          setError(null);
        } else {
          setError(data.error || 'Failed to send verification email');
        }
      } catch (error) {
        console.error('Send OTP error:', error);
        setError('Network error. Please check your connection and try again.');
      }
    }
    // For login, the AuthForm handles it directly
  };
  // Handle successful OTP verification
  const handleOTPVerified = async (verificationData) => {
    if (!pendingSignupData) {
      setOtpError('No pending signup data found');
      return;
    }

    try {
      // Now create the actual user account with skipEmailVerification=true
      const result = await signUpWithEmail(
        pendingSignupData.email, 
        pendingSignupData.password,
        true, // skipEmailVerification flag since OTP is already verified
        pendingSignupData.firstName || '',
        pendingSignupData.lastName || ''
      );

      if (result.success) {
        // Clear pending data and reset flow
        setPendingSignupData(null);
        setCurrentFlow('auth');
        setOtpError(null);
        // Success will be handled by the parent component/context
      } else {
        setOtpError(result.error || 'Failed to create account. Please try again.');
      }
    } catch (error) {
      console.error('Account creation error:', error);
      setOtpError('Failed to create account. Please try again.');
    }
  };

  // Handle going back from OTP to auth form
  const handleBackToAuth = () => {
    setCurrentFlow('auth');
    setPendingSignupData(null);
    setOtpError(null);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <AnimatePresence mode="wait">
        {currentFlow === 'auth' && (
          <motion.div
            key="auth"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
          >
            <AuthForm 
              mode={mode} 
              onAuthSubmit={handleAuthFormSubmit}
            />
          </motion.div>
        )}

        {currentFlow === 'otp' && pendingSignupData && (
          <motion.div
            key="otp"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.5 }}
          >
            <OTPVerification
              email={pendingSignupData.email}
              onVerifySuccess={handleOTPVerified}
              onBack={handleBackToAuth}
              error={otpError}
              setError={setOtpError}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
