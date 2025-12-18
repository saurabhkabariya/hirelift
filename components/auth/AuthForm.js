'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { generateCaptcha, generateCaptchaImage, validateCaptcha } from '@/lib/captcha/captchaGenerator';
import Link from 'next/link';
import Image from 'next/image';

export default function AuthForm({ mode = 'login', onAuthSubmit }) {  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Captcha state
  const [captchaText, setCaptchaText] = useState('');
  const [captchaImage, setCaptchaImage] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  
  // Terms acceptance state (for signup)
  const [acceptTerms, setAcceptTerms] = useState(false);

  const { signInWithEmail, signUpWithEmail, signInWithGoogle, error, setError } = useAuth();

  // Generate captcha on component mount and when regenerated
  useEffect(() => {
    generateNewCaptcha();
  }, []);
  const generateNewCaptcha = () => {
    const newCaptcha = generateCaptcha();
    setCaptchaText(newCaptcha);
    setCaptchaImage(''); // Clear previous image while generating
    
    // Generate image on next tick to ensure DOM is ready
    setTimeout(() => {
      const imageDataUrl = generateCaptchaImage(newCaptcha);
      setCaptchaImage(imageDataUrl);
    }, 100);
    
    setCaptchaInput('');
    
    // Clear captcha error if exists
    if (errors.captcha) {
      setErrors(prev => ({ ...prev, captcha: '' }));
    }
  };
  const validateForm = () => {
    const newErrors = {};

    // Name validation for signup
    if (mode === 'signup') {
      if (!formData.firstName.trim()) {
        newErrors.firstName = 'First name is required';
      }
      if (!formData.lastName.trim()) {
        newErrors.lastName = 'Last name is required';
      }
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    // Confirm password validation for signup
    if (mode === 'signup') {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      
      // Terms acceptance validation for signup
      if (!acceptTerms) {
        newErrors.terms = 'You must agree to the Terms & Conditions to create an account';
      }
    }

    // Captcha validation
    if (!captchaInput) {
      newErrors.captcha = 'Please enter the captcha code';
    } else if (!validateCaptcha(captchaInput, captchaText)) {
      newErrors.captcha = 'Captcha code is incorrect';
      generateNewCaptcha(); // Generate new captcha on incorrect input
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!validateForm()) return;

    setIsLoading(true);    try {
      let result;
      if (mode === 'login') {
        result = await signInWithEmail(formData.email, formData.password);
        if (result.success) {
          // Form will be handled by the parent component
          setFormData({ email: '', password: '', confirmPassword: '', firstName: '', lastName: '' });
          setCaptchaInput('');
          setAcceptTerms(false);
          generateNewCaptcha();
        }
      } else {
        // For signup, use the callback to handle OTP flow
        if (onAuthSubmit) {
          await onAuthSubmit(formData, true);
        } else {
          // Fallback to direct signup (without OTP)
          result = await signUpWithEmail(formData.email, formData.password, true, formData.firstName, formData.lastName);
          if (result.success) {
            setFormData({ email: '', password: '', confirmPassword: '', firstName: '', lastName: '' });
            setCaptchaInput('');
            setAcceptTerms(false);
            generateNewCaptcha();
          }
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithGoogle();
      // isNewUser flag is already handled in signInWithGoogle context method
      // The parent component will handle redirect based on sessionStorage
    } catch (error) {
      console.error('Google sign-in error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCaptchaChange = (e) => {
    setCaptchaInput(e.target.value);
    
    // Clear captcha error when user starts typing
    if (errors.captcha) {
      setErrors(prev => ({ ...prev, captcha: '' }));
    }
  };

  const handleTermsChange = (e) => {
    setAcceptTerms(e.target.checked);
    
    // Clear terms error when checkbox is checked
    if (errors.terms && e.target.checked) {
      setErrors(prev => ({ ...prev, terms: '' }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="space-y-2 sm:space-y-3">
        {/* Header - Hidden on mobile, shown in parent */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="hidden"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-gray-300 text-sm">
            {mode === 'login' 
              ? 'Sign in to your account to continue' 
              : 'Join us and start your journey'
            }
          </p>
        </motion.div>

        {/* Error Display */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-2 sm:p-2.5 bg-red-500/10 border border-red-500/30 rounded-lg"
            >
              <div className="flex items-center">
                <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-400 mr-1.5 sm:mr-2 flex-shrink-0" />
                <span className="text-red-300 text-xs leading-tight">
                  {typeof error === 'string' ? error : (error && error.message ? error.message : 'An error occurred')}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-3">
          {/* Name Fields - Only for Signup */}
          {mode === 'signup' && (
            <>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <label className="block text-xs font-medium text-white mb-0.5 sm:mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`w-full bg-white/10 text-white placeholder-gray-400 px-2.5 sm:px-3 py-1.5 sm:py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.firstName ? 'border-red-300' : 'border-white/20'
                    }`}
                    placeholder="First name"
                  />
                  {errors.firstName && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-1 text-xs text-red-400"
                    >
                      {errors.firstName}
                    </motion.p>
                  )}
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  <label className="block text-xs font-medium text-white mb-0.5 sm:mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`w-full bg-white/10 text-white placeholder-gray-400 px-2.5 sm:px-3 py-1.5 sm:py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.lastName ? 'border-red-300' : 'border-white/20'
                    }`}
                    placeholder="Last name"
                  />
                  {errors.lastName && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-1 text-xs text-red-400"
                    >
                      {errors.lastName}
                    </motion.p>
                  )}
                </motion.div>
              </div>
            </>
          )}

          {/* Email Field */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block text-xs font-medium text-white mb-0.5 sm:mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full bg-white/10 text-white placeholder-gray-400 pl-8 sm:pl-9 pr-2.5 sm:pr-3 py-1.5 sm:py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.email ? 'border-red-300' : 'border-white/20'
                }`}
                placeholder="Enter your email"
              />
            </div>
            {errors.email && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-1 text-xs text-red-400"
              >
                {errors.email}
              </motion.p>
            )}
          </motion.div>

          {/* Password Field */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block text-xs font-medium text-white mb-0.5 sm:mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full bg-white/10 text-white placeholder-gray-400 pl-8 sm:pl-9 pr-9 sm:pr-10 py-1.5 sm:py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.password ? 'border-red-300' : 'border-white/20'
                }`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
              </button>
            </div>
            {errors.password && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-1 text-xs text-red-400"
              >
                {errors.password}
              </motion.p>
            )}
          </motion.div>

          {/* Confirm Password Field (Signup only) */}
          {mode === 'signup' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label className="block text-xs font-medium text-white mb-0.5 sm:mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full bg-white/10 text-white placeholder-gray-400 pl-8 sm:pl-9 pr-9 sm:pr-10 py-1.5 sm:py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.confirmPassword ? 'border-red-300' : 'border-white/20'
                  }`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2.5 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                </button>
              </div>              {errors.confirmPassword && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-1 text-xs text-red-400"
                >
                  {errors.confirmPassword}
                </motion.p>
              )}
            </motion.div>
          )}

          {/* Captcha Field */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: mode === 'signup' ? 0.6 : 0.5 }}
          >
            <label className="block text-xs font-medium text-white mb-0.5 sm:mb-1">
              Security
            </label>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    value={captchaInput}
                    onChange={handleCaptchaChange}
                    className={`w-full bg-white/10 text-white placeholder-gray-400 px-2.5 sm:px-3 py-1.5 sm:py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.captcha ? 'border-red-300' : 'border-white/20'
                    }`}
                    placeholder="Enter code"
                    maxLength={6}
                  />
                </div>
              </div>
              <div className="flex items-center gap-1">
                <div className="relative">
                  {captchaImage ? (
                    <Image
                      src={captchaImage}
                      alt="Captcha"
                      className="border border-white/20 rounded-md sm:rounded-lg"
                      width={80}
                      height={36}
                    />
                  ) : (
                    <div className="w-[80px] h-[36px] border border-white/20 rounded-md sm:rounded-lg bg-white/5 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-blue-400"></div>
                    </div>
                  )}
                </div>
                <motion.button
                  type="button"
                  onClick={generateNewCaptcha}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-1 sm:p-1.5 text-gray-400 hover:text-gray-300 transition-colors rounded-md sm:rounded-lg hover:bg-white/10"
                  title="Generate new captcha"
                >
                  <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </motion.button>
              </div>
            </div>
            {errors.captcha && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-1 text-xs text-red-400"
              >
                {errors.captcha}
              </motion.p>
            )}
          </motion.div>

          {/* Terms & Conditions Checkbox (Signup only) */}
          {mode === 'signup' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="space-y-0.5 sm:space-y-1"
            >
              <div className="flex items-start">
                <div className="flex items-center h-3.5 sm:h-4">
                  <input
                    id="acceptTerms"
                    name="acceptTerms"
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={handleTermsChange}
                    className={`w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-600 bg-gray-100 border rounded focus:ring-blue-500 focus:ring-2 transition-all duration-200 ${
                      errors.terms ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                </div>
                <div className="ml-1.5 sm:ml-2 text-[11px] sm:text-xs">
                  <label htmlFor="acceptTerms" className="text-gray-200 leading-tight">
                    I agree to the{' '}
                    <Link 
                      href="/terms" 
                      target="_blank"
                      className="text-blue-400 hover:text-blue-300 underline transition-colors"
                    >
                      Terms
                    </Link>
                    {' '}and{' '}
                    <Link 
                      href="/privacy" 
                      target="_blank"
                      className="text-blue-400 hover:text-blue-300 underline transition-colors"
                    >
                      Privacy
                    </Link>
                  </label>
                </div>
              </div>
              {errors.terms && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-1 text-xs text-red-400"
                >
                  {errors.terms}
                </motion.p>
              )}
            </motion.div>
          )}          {/* Submit Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: mode === 'signup' ? 0.8 : 0.6 }}
            type="submit"
            disabled={isLoading || (mode === 'signup' && !acceptTerms)}
            className={`w-full py-2 sm:py-2.5 px-4 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 ${
              isLoading || (mode === 'signup' && !acceptTerms)
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-3.5 w-3.5 sm:h-4 sm:w-4 border-b-2 border-white mr-1.5 sm:mr-2"></div>
                <span className="text-sm">{mode === 'login' ? 'Signing In...' : 'Creating...'}</span>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                {mode === 'signup' && !acceptTerms && (
                  <AlertCircle className="w-3.5 h-3.5 mr-1.5 text-gray-500" />
                )}
                <span className="text-sm">
                  {mode === 'login' ? 'Sign In' : 
                    (!acceptTerms ? 'Accept Terms' : 'Create Account')
                  }
                </span>
              </div>
            )}
          </motion.button>
        </form>        {/* Divider */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: mode === 'signup' ? 0.9 : 0.7 }}
          className="relative my-2 sm:my-3"
        >
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/20"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-white/10 text-gray-300">Or continue with</span>
          </div>
        </motion.div>        {/* Google Sign In Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: mode === 'signup' ? 1.0 : 0.8 }}
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full bg-white border border-gray-300 text-gray-700 py-2 sm:py-2.5 px-4 rounded-lg text-sm font-medium hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center justify-center">
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="text-sm">Continue with Google</span>
          </div>
        </motion.button>
      </div>
    </motion.div>
  );
} 