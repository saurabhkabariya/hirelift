/**
 * One-time Payment Service for Razorpay integration
 * Handles frontend one-time payment flow with Razorpay SDK
 */

import toast from 'react-hot-toast';
import { fetchWithAuth, isAuthError } from './authUtils';

class OneTimePaymentService {
  constructor() {
    this.razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    
    if (!this.razorpayKeyId) {
      console.error('Razorpay Key ID not found in environment variables');
    }
  }

  /**
   * Create order and initiate one-time payment
   * @param {Object} paymentData - Payment details
   * @param {Object} router - Next.js router instance for auth redirects
   */
  async createOneTimePayment({
    amount, // amount in the specified currency
    currency = 'INR', // currency code (INR or USD)
    description = 'HireLift Pro One-Time Access',
    user,
    onSuccess,
    onError,
    onPaymentStart,
    onPaymentEnd,
    router = null,
    planType = 'basic', // Add planType parameter
    testId = null // Add testId for unique test payments
  }) {
    try {
      // Validate required parameters
      if (!amount || amount <= 0) {
        throw new Error('Valid amount is required');
      }

      if (!user) {
        throw new Error('User authentication required');
      }

      // Check if Razorpay is loaded
      if (typeof window.Razorpay === 'undefined') {
        try {
          await this.loadRazorpaySDK();
        } catch (loadError) {
          throw new Error('Failed to load payment system. Please refresh the page and try again.');
        }
      }

      onPaymentStart?.();

      // Create order on backend using auth-aware fetch
      const orderResponse = await fetchWithAuth('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: currency === 'INR' ? amount * 100 : amount * 100, // convert to smallest currency unit (paisa for INR, cents for USD)
          currency: currency,
          notes: {
            plan_type: 'onetime',
            description: description
          }
        })
      }, router);

      const orderData = await orderResponse.json();

      if (!orderResponse.ok) {
        throw new Error(orderData.error || 'Failed to create order');
      }

      console.log('✅ Order created:', orderData.order.id);

      // Configure Razorpay checkout options
      const razorpayOptions = {
        key: this.razorpayKeyId,
        amount: orderData.order.amount, // amount in smallest currency unit
        currency: orderData.order.currency,
        name: 'HireLift',
        description: description,
        image: '/favicon.ico',
        order_id: orderData.order.id,
        handler: async (response) => {
          try {
            console.log('💳 Payment successful:', response);
            toast.success('Payment successful! Verifying and updating your account...');
            
            // For test payments, skip verification and call success directly
            if (planType === 'test') {
              console.log('🧪 Test payment detected, skipping verification');
              onSuccess?.(response, orderData.order);
              onPaymentEnd?.();
              return;
            }
            
            // Verify payment on backend for regular payments
            await this.verifyOneTimePayment(response);
            
            onSuccess?.(response, orderData.order);
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error('Payment completed but verification failed. Please contact support.');
            onError?.(error);
          } finally {
            onPaymentEnd?.();
          }
        },
        prefill: {
          name: user.name || user.email.split('@')[0],
          email: user.email,
          contact: user.phone || ''
        },
        notes: {
          user_id: user._id || user.id,
          payment_type: 'onetime',
          plan_type: planType || 'basic',
          test_id: testId || null,
          timestamp: Date.now() // Add timestamp for uniqueness
        },
        theme: {
          color: '#7209B7'
        },
        method: {
          upi: true,
          card: true,
          netbanking: true,
          wallet: true
        },
        modal: {
          backdropclose: false,
          escape: false,
          handleback: false,
          confirm_close: true,
          ondismiss: () => {
            console.log('💳 Payment modal dismissed');
            toast.error('Payment cancelled');
            onPaymentEnd?.();
          }
        },
        retry: {
          enabled: true,
          max_count: 3
        }
      };

      // Notify payment start
      onPaymentStart?.();

      console.log('🔧 Opening Razorpay checkout with options:', {
        key: razorpayOptions.key ? `${razorpayOptions.key.substring(0, 8)}...` : 'missing',
        amount: razorpayOptions.amount,
        currency: razorpayOptions.currency,
        order_id: razorpayOptions.order_id
      });

      // Create and open Razorpay checkout
      const razorpayInstance = new window.Razorpay(razorpayOptions);
      
      razorpayInstance.on('payment.failed', (response) => {
        console.error('Payment failed:', response.error);
        toast.error(`Payment failed: ${response.error.description || 'Unknown error'}`);
        onError?.(new Error(response.error.description || 'Payment failed'));
        onPaymentEnd?.();
      });

      razorpayInstance.open();

    } catch (error) {
      console.error('Create one-time payment error:', error);
      toast.error(error.message || 'Failed to initiate payment');
      onError?.(error);
      onPaymentEnd?.();
    }
  }

  /**
   * Verify one-time payment on backend
   * @param {Object} paymentResponse - Razorpay payment response
   */
  async verifyOneTimePayment(paymentResponse) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      console.log('🔍 Verifying payment with server...', paymentResponse);

      const response = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          razorpay_payment_id: paymentResponse.razorpay_payment_id,
          razorpay_order_id: paymentResponse.razorpay_order_id,
          razorpay_signature: paymentResponse.razorpay_signature
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Payment verification failed');
      }

      console.log('✅ Payment verified successfully:', data);
      return data;

    } catch (error) {
      console.error('Payment verification error:', error);
      throw error;
    }
  }

  /**
   * Load Razorpay SDK dynamically if not already loaded
   */
  async loadRazorpaySDK() {
    return new Promise((resolve, reject) => {
      if (typeof window !== 'undefined' && typeof window.Razorpay !== 'undefined') {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      
      script.onload = () => {
        resolve(true);
      };
      
      script.onerror = () => {
        reject(new Error('Failed to load Razorpay SDK'));
      };

      document.head.appendChild(script);
    });
  }

  /**
   * Check if user has active one-time access
   * @param {Object} user - Current user object
   * @returns {boolean}
   */
  hasActiveOneTimeAccess(user) {
    if (!user || !user.isPremium || user.proPlanType !== 'onetime') {
      return false;
    }

    if (!user.expiryDate) {
      return false;
    }

    return new Date() < new Date(user.expiryDate);
  }

  /**
   * Get remaining days for one-time access
   * @param {Object} user - Current user object
   * @returns {number}
   */
  getRemainingDays(user) {
    if (!this.hasActiveOneTimeAccess(user)) {
      return 0;
    }

    const now = new Date();
    const expiry = new Date(user.expiryDate);
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return Math.max(0, diffDays);
  }
}

// Export singleton instance
export default new OneTimePaymentService();
