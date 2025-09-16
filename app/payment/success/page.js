'use client';

import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  CheckCircle, 
  Calendar,
  Crown,
  ArrowRight,
  Sparkles,
  Gift,
  Mail,
  Clock
} from 'lucide-react';

// Separate component for search params logic
function PaymentSuccessContent() {
  const { user, refetchUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [countdown, setCountdown] = useState(5);

  const paymentType = searchParams.get('type') || 'subscription';
  const amount = searchParams.get('amount') || '99';

  useEffect(() => {
    // Refetch user data to get updated premium status
    refetchUser();

    // Countdown to redirect
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/dashboard');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [refetchUser, router]);

  const isOneTime = paymentType === 'onetime';

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-40">
        <div className="absolute top-[10%] left-[10%] w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-[40%] right-[15%] w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[10%] left-[30%] w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
        className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 max-w-lg w-full text-center border border-white/20"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          className="w-20 h-20 mx-auto mb-6 relative"
        >
          <CheckCircle className="w-20 h-20 text-green-500" />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6, type: "spring", stiffness: 300 }}
            className="absolute -top-2 -right-2"
          >
            <Sparkles className="w-8 h-8 text-yellow-500" />
          </motion.div>
        </motion.div>

        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🎉 Payment Successful!
          </h1>
          <p className="text-lg text-gray-600">
            Welcome to HireLift Pro! Your payment has been processed successfully.
          </p>
        </motion.div>

        {/* Payment Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 mb-6"
        >
          <div className="flex items-center justify-center mb-4">
            <Crown className="w-8 h-8 text-purple-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">
              HireLift Pro {isOneTime ? 'One-Time Access' : 'Subscription'}
            </h2>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <div className="text-gray-500">Amount Paid</div>
              <div className="font-semibold text-gray-900">₹{amount}</div>
            </div>
            <div className="text-center">
              <div className="text-gray-500">Access Duration</div>
              <div className="font-semibold text-gray-900">
                {isOneTime ? '30 Days' : 'Monthly'}
              </div>
            </div>
          </div>

          {isOneTime && user?.expiryDate && (
            <div className="mt-4 pt-4 border-t border-purple-100">
              <div className="flex items-center justify-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-1" />
                Expires on: {new Date(user.expiryDate).toLocaleDateString()}
              </div>
            </div>
          )}
        </motion.div>

        {/* Features Unlocked */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            🚀 Features Unlocked
          </h3>
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
            <div className="flex items-center">
              <Gift className="w-4 h-4 mr-2 text-green-500" />
              Unlimited Audits
            </div>
            <div className="flex items-center">
              <Gift className="w-4 h-4 mr-2 text-green-500" />
              HR Contact Lists
            </div>
            <div className="flex items-center">
              <Gift className="w-4 h-4 mr-2 text-green-500" />
              Email Templates
            </div>
            <div className="flex items-center">
              <Gift className="w-4 h-4 mr-2 text-green-500" />
              Priority Support
            </div>
          </div>
        </motion.div>

        {/* Verification Notice for Premium Plans */}
        {parseInt(amount) > 99 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-6"
          >
            <div className="flex items-center justify-center mb-3">
              <Clock className="w-6 h-6 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">
                Payment Verification
              </h3>
            </div>
            
            <div className="text-sm text-gray-700 text-center space-y-3">
              <p>
                <strong>We will contact you after verifying your payment through email.</strong>
              </p>
              <p>
                If you don't get any response from our side within <strong>24 to 48 hours</strong> of payment, 
                feel free to contact us directly.
              </p>
            </div>

            <motion.button
              onClick={() => router.push('/contact')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center"
            >
              <Mail className="w-4 h-4 mr-2" />
              Contact Us
            </motion.button>
          </motion.div>
        )}

        {/* Redirect Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-sm text-gray-500 mb-6"
        >
          Redirecting to dashboard in {countdown} seconds...
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="space-y-3"
        >
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center justify-center"
          >
            Go to Dashboard
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
          
          <button
            onClick={() => router.push('/audit')}
            className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-all duration-200"
          >
            Start Resume Audit
          </button>        </motion.div>
      </motion.div>
    </div>
  );
}

// Loading component for Suspense fallback
function PaymentSuccessLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 max-w-lg w-full text-center border border-white/20"
      >
        <div className="w-20 h-20 mx-auto mb-6">
          <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-green-500"></div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Loading Payment Details...
        </h1>
        <p className="text-gray-600">
          Please wait while we process your payment information.
        </p>
      </motion.div>
    </div>
  );
}

// Main component with Suspense boundary
export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<PaymentSuccessLoading />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
