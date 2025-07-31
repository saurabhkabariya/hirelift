/**
 * Payment utility for Razorpay integration
 * Handles frontend payment flow with Razorpay SDK
 */

import toast from 'react-hot-toast';

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
    onPaymentEnd
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

      // Get auth token
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found. Please login again.');
      }

      // Call backend to create subscription
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          planId,
          totalCount,
          quantity,
          startAt,
          customerName: user.name || user.email,
          customerContact: user.phone || ''
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create subscription');
      }

      // Extract subscription details
      const { subscription, customer, options } = data;

      // Configure Razorpay checkout options
      const razorpayOptions = {
        key: this.razorpayKeyId,
        subscription_id: subscription.id,
        name: 'HireLift',
        description: 'Pro Subscription - Unlimited Resume Audits',
        image: '/favicon.ico',
        handler: async (response) => {
          try {
            toast.success('Payment successful! Updating your account...');
            
            // Update user context or refetch user data
            // The webhook will handle the actual subscription activation
            
            onSuccess?.(response, subscription);
          } catch (error) {
            console.error('Payment success handler error:', error);
            toast.error('Payment completed but failed to update account. Please contact support.');
            onError?.(error);
          }
        },
        prefill: {
          name: user.name || user.email.split('@')[0],
          email: user.email,
          contact: user.phone || ''
        },
        theme: {
          color: '#6366f1'
        },
        modal: {
          backdropclose: false,
          escape: false,
          handleback: false,
          confirm_close: true,
          ondismiss: () => {
            toast.error('Payment cancelled');
            onPaymentEnd?.();
          }
        },
        retry: {
          enabled: true,
          max_count: 3
        }
      };

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
