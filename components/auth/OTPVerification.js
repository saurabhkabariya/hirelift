'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowLeft, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

export default function OTPVerification({ 
  email, 
  onVerifySuccess, 
  onBack, 
  isLoading,
  error,
  setError 
}) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendCount, setResendCount] = useState(0);
  const inputRefs = useRef([]);

  // Start cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Auto-focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleOtpChange = (index, value) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Clear error when user starts typing
    if (error) {
      setError(null);
    }
    
    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    
    // Auto-submit when all fields are filled
    if (newOtp.every(digit => digit !== '') && newOtp.join('').length === 6) {
      handleVerifyOTP(newOtp.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    
    // Handle paste
    if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      navigator.clipboard.readText().then(text => {
        const digits = text.replace(/\D/g, '').slice(0, 6).split('');
        const newOtp = [...otp];
        digits.forEach((digit, i) => {
          if (i < 6) newOtp[i] = digit;
        });
        setOtp(newOtp);
        
        // Focus last filled input or next empty one
        const nextFocus = Math.min(digits.length, 5);
        inputRefs.current[nextFocus]?.focus();
        
        // Auto-verify if complete
        if (digits.length === 6) {
          handleVerifyOTP(digits.join(''));
        }
      });
    }
  };

  const handleVerifyOTP = async (otpCode = otp.join('')) => {
    if (otpCode.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }

    setIsVerifying(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          otp: otpCode,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // OTP verified successfully
        onVerifySuccess(data);
      } else {
        setError(data.error || 'Invalid OTP. Please try again.');
        // Clear OTP on error
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;

    setIsResending(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setResendCount(prev => prev + 1);
        setResendCooldown(60); // 1 minute cooldown
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      } else {
        setError(data.error || 'Failed to resend OTP. Please try again.');
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="space-y-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-4"
        >
          <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <Mail className="w-6 h-6 text-blue-400" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
            Verify Your Email
          </h2>
          <p className="text-gray-300 text-xs sm:text-sm">
            Code sent to
          </p>
          <p className="text-blue-400 font-semibold text-sm">
            {email}
          </p>
        </motion.div>

        {/* Error Display */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-2.5 sm:p-3 bg-red-500/10 border border-red-500/30 rounded-lg"
            >
              <div className="flex items-center">
                <AlertCircle className="w-4 h-4 text-red-400 mr-2 flex-shrink-0" />
                <span className="text-red-300 text-xs sm:text-sm">{error}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* OTP Input Fields */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-4"
        >
          <div className="flex justify-center gap-2">            {otp.map((digit, index) => (
              <motion.input
                key={index}
                ref={el => inputRefs.current[index] = el}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={`w-10 h-10 sm:w-11 sm:h-11 text-center text-lg font-bold border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  digit ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                } ${error ? 'border-red-300' : ''}`}
                disabled={isVerifying}
                whileFocus={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              />
            ))}
          </div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center text-xs text-gray-300 mt-3"
          >
            Enter the 6-digit code
          </motion.p>
        </motion.div>

        {/* Verify Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          onClick={() => handleVerifyOTP()}
          disabled={isVerifying || otp.some(digit => !digit)}
          className={`w-full py-2.5 px-4 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 ${
            isVerifying || otp.some(digit => !digit)
              ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isVerifying ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              <span className="text-sm">Verifying...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              <span className="text-sm">Verify Email</span>
            </div>
          )}
        </motion.button>

        {/* Resend OTP */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-4"
        >
          <p className="text-gray-300 text-xs mb-1.5">
            Didn&apos;t receive the code?
          </p>
          
          {resendCooldown > 0 ? (
            <p className="text-gray-400 text-xs">
              Resend in {resendCooldown}s
            </p>
          ) : (
            <button
              onClick={handleResendOTP}
              disabled={isResending}
              className="text-blue-400 hover:text-blue-300 font-medium text-xs transition-colors disabled:opacity-50"
            >
              {isResending ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-400 mr-1.5"></div>
                  <span>Sending...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <RefreshCw className="w-3 h-3 mr-1" />
                  <span>Resend Code</span>
                  {resendCount > 0 && (
                    <span className="ml-1 text-gray-400">({resendCount + 1})</span>
                  )}
                </div>
              )}
            </button>
          )}
        </motion.div>

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="text-center mt-4 pt-4 border-t border-white/10"
        >
          <button
            onClick={onBack}
            disabled={isVerifying || isResending}
            className="flex items-center justify-center mx-auto text-gray-300 hover:text-white font-medium text-xs transition-colors disabled:opacity-50"
          >
            <ArrowLeft className="w-3 h-3 mr-1" />
            <span>Back to Sign Up</span>
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
