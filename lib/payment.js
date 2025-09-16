/**
 * Payment utility for Razorpay integration
 * Handles frontend payment flow with Razorpay SDK
 */

import toast from 'react-hot-toast';
import { fetchWithAuth, isAuthError } from './authUtils';

class PaymentService {
  constructor() {
    this.razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    
    if (!this.razorpayKeyId) {
      console.error('Razorpay Key ID not found in environment variables');
    }
  }

  /**
   * Create a subscription and initiate payment
   * @param {Object} subscriptionData - Subscription details
   * @param {Object} user - Current user object
   * @param {Function} onSuccess - Success callback
   * @param {Function} onError - Error callback
   * @param {Object} options - Additional options
   * @param {Object} router - Next.js router instance for auth redirects
   */
  async createSubscription({
    planId,
    totalCount = 12,
    quantity = 1,
    startAt = null,
    user,
    onSuccess,
    onError,
    onPaymentStart,
    onPaymentEnd,
    router = null
  }) {
    try {
      // Validate required parameters
      if (!planId) {
        throw new Error('Plan ID is required');
      }

      if (!user) {
        throw new Error('User authentication required');
      }      // Check if Razorpay is loaded
      if (typeof window.Razorpay === 'undefined') {
        // Try to load Razorpay SDK dynamically
        try {
          await this.loadRazorpaySDK();
        } catch (loadError) {
          throw new Error('Failed to load payment system. Please refresh the page and try again.');
        }
      }

      onPaymentStart?.();

      // Call backend to create subscription using auth-aware fetch
      const response = await fetchWithAuth('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          planId,
          totalCount,
          quantity,
          startAt,
          customerName: user.name || user.email,
          customerContact: user.phone || ''
        })
      }, router);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create subscription');
      }      // Extract subscription details
      const { subscription, customer, paymentOptions, razorpaySubscription } = data;

      console.log('🔍 API Response data:', {
        hasSubscription: !!subscription,
        hasCustomer: !!customer,
        hasPaymentOptions: !!paymentOptions,
        hasRazorpaySubscription: !!razorpaySubscription
      });

      if (!paymentOptions) {
        throw new Error('Payment options not received from server');
      }

      if (!razorpaySubscription?.id) {
        throw new Error('Razorpay subscription ID not found in response');
      }      // Configure Razorpay checkout options by merging with server options
      const razorpayOptions = {
        ...paymentOptions, // Use options from server        // Override/add frontend-specific handlers
        handler: async (response) => {
          try {
            console.log('💳 Payment successful:', response);
            toast.success('Payment successful! Verifying and updating your account...');
            
            // Verify payment with retry logic for timing issues
            await this.verifyPaymentWithRetry(response);
            
            onSuccess?.(response, subscription);
          } catch (error) {
            console.error('Payment success handler error:', error);
            
            // Check if this is a retry-able error
            if (error.shouldRetry) {
              toast.error('Payment processing... Please wait a moment while we verify your payment.');
              
              // Retry after a delay
              setTimeout(async () => {
                try {
                  await this.verifyPaymentWithRetry(response, 1); // Second attempt
                  onSuccess?.(response, subscription);
                  toast.success('Payment verified successfully!');
                } catch (retryError) {
                  console.error('Payment retry failed:', retryError);
                  toast.error('Payment completed but verification is taking longer than expected. Your account will be updated shortly. If issues persist, please contact support.');
                  onError?.(retryError);
                }
              }, 3000);
            } else {
              toast.error('Payment completed but failed to update account. Please contact support.');
              onError?.(error);
            }
          }
        },
        modal: {
          ...paymentOptions.modal,
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

      console.log('🔧 Final Razorpay options:', {
        hasKey: !!razorpayOptions.key,
        hasSubscriptionId: !!razorpayOptions.subscription_id,
        keyPreview: razorpayOptions.key ? `${razorpayOptions.key.substring(0, 8)}...` : 'missing',
        subscriptionId: razorpayOptions.subscription_id
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
      console.error('Create subscription error:', error);
      toast.error(error.message || 'Failed to initiate payment');
      onError?.(error);
      onPaymentEnd?.();
    }
  }

  /**
   * Verify payment and update user status immediately
   * @param {Object} paymentResponse - Razorpay payment response
   * @param {Object} router - Next.js router instance for auth redirects
   * @returns {Promise<Object>}
   */
  async verifyPayment(paymentResponse, router = null) {
    try {
      console.log('🔍 Verifying payment with server...', paymentResponse);

      const response = await fetchWithAuth('/api/payment/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          razorpay_payment_id: paymentResponse.razorpay_payment_id,
          razorpay_subscription_id: paymentResponse.razorpay_subscription_id,
          razorpay_signature: paymentResponse.razorpay_signature
        })
      }, router);

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
   * Verify payment with retry logic for timing issues
   * @param {Object} paymentResponse - Razorpay payment response
   * @param {number} attemptNumber - Current attempt number (for logging)
   * @param {Object} router - Next.js router instance for auth redirects
   * @returns {Promise<Object>}
   */
  async verifyPaymentWithRetry(paymentResponse, attemptNumber = 0, router = null) {
    try {
      console.log(`🔍 Verifying payment with server (attempt ${attemptNumber + 1})...`, paymentResponse);

      const response = await fetchWithAuth('/api/payment/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          razorpay_payment_id: paymentResponse.razorpay_payment_id,
          razorpay_subscription_id: paymentResponse.razorpay_subscription_id,
          razorpay_signature: paymentResponse.razorpay_signature
        })
      });

      const data = await response.json();

      if (!response.ok) {
        // Check if this is a retry-able error
        if (data.shouldRetry && attemptNumber < 2) {
          console.log(`⏱️ Retry-able error detected, will retry... Status: ${data.status}`);
          const error = new Error(data.message || 'Payment verification failed');
          error.shouldRetry = true;
          error.status = data.status;
          error.subscriptionDetails = data.subscriptionDetails;
          throw error;
        }
        
        const error = new Error(data.message || 'Payment verification failed');
        error.shouldRetry = data.shouldRetry || false;
        error.status = data.status;
        error.subscriptionDetails = data.subscriptionDetails;
        throw error;
      }

      console.log('✅ Payment verified successfully:', data);
      return data;

    } catch (error) {
      console.error('Payment verification error:', error);
      throw error;
    }
  }

  /**
   * Verify if Razorpay SDK is loaded
   * @returns {boolean}
   */
  isRazorpayLoaded() {
    return typeof window !== 'undefined' && typeof window.Razorpay !== 'undefined';
  }

  /**
   * Load Razorpay SDK dynamically if not already loaded
   * @returns {Promise<boolean>}
   */
  async loadRazorpaySDK() {
    return new Promise((resolve, reject) => {
      if (this.isRazorpayLoaded()) {
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
   * Get user's current subscription status
   * @returns {Promise<Object>}
   */
  async getCurrentSubscription() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch('/api/subscribe', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const data = await response.json();
        
        // Handle specific authentication errors more gracefully
        if (response.status === 401 || response.status === 403) {
          // Clear invalid token
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          throw new Error('Authentication failed. Please login again.');
        }
        
        // For other errors, check if it's a user not found error
        if (data.error && data.error.includes('User not found')) {
          // Clear invalid token
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          throw new Error('User account not found. Please login again.');
        }
        
        throw new Error(data.error || 'Failed to fetch subscription');
      }

      return await response.json();
    } catch (error) {
      console.error('Get subscription error:', error);
      throw error;
    }
  }

  /**
   * Cancel current subscription
   * @returns {Promise<Object>}
   */
  async cancelSubscription() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch('/api/subscribe', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to cancel subscription');
      }

      return await response.json();
    } catch (error) {
      console.error('Cancel subscription error:', error);
      throw error;
    }
  }
}

// Create singleton instance
const paymentService = new PaymentService();

export default paymentService;
