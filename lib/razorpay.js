import Razorpay from 'razorpay';
import crypto from 'crypto';

class RazorpayService {
  constructor() {
    this._razorpay = null;
    this.keySecret = process.env.RAZORPAY_KEY_SECRET;
  }

  // Lazy initialization of Razorpay instance
  get razorpay() {
    if (!this._razorpay) {
      if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        throw new Error('Razorpay credentials not found in environment variables');
      }
      
      this._razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET
      });
    }
    return this._razorpay;
  }

  /**
   * Create a Razorpay customer
   * @param {Object} customerData - Customer information
   * @returns {Promise<Object>} Created customer object
   */
  async createCustomer(customerData) {
    try {
      const customer = await this.razorpay.customers.create({
        name: customerData.name || 'HireLift User',
        email: customerData.email,
        contact: customerData.contact || '',
        fail_existing: '0', // Don't fail if customer already exists
        notes: {
          source: 'HireLift',
          created_at: new Date().toISOString()
        }
      });
      
      console.log('✅ Razorpay customer created:', customer.id);
      return customer;
    } catch (error) {
      console.error('❌ Error creating Razorpay customer:', error);
      throw new Error(`Failed to create customer: ${error.message}`);
    }
  }

  /**
   * Get or create a customer by email
   * @param {string} email - Customer email
   * @param {Object} additionalData - Additional customer data
   * @returns {Promise<Object>} Customer object
   */
  async getOrCreateCustomer(email, additionalData = {}) {
    try {
      // First, try to find existing customer by email
      const existingCustomers = await this.razorpay.customers.all({
        count: 10
      });
      
      const existingCustomer = existingCustomers.items.find(
        customer => customer.email === email
      );
      
      if (existingCustomer) {
        console.log('✅ Found existing Razorpay customer:', existingCustomer.id);
        return existingCustomer;
      }
      
      // Create new customer if not found
      return await this.createCustomer({ email, ...additionalData });
    } catch (error) {
      console.error('❌ Error getting/creating customer:', error);
      throw new Error(`Failed to get or create customer: ${error.message}`);
    }
  }

  /**
   * Create a subscription
   * @param {Object} subscriptionData - Subscription details
   * @returns {Promise<Object>} Created subscription object
   */
  async createSubscription(subscriptionData) {
    try {
      const {
        planId,
        customerId,
        totalCount,
        quantity = 1,
        startAt,
        addons = [],
        notes = {}
      } = subscriptionData;

      const subscription = await this.razorpay.subscriptions.create({
        plan_id: planId,
        customer_id: customerId,
        quantity: quantity,
        total_count: totalCount,
        start_at: startAt ? Math.floor(startAt.getTime() / 1000) : undefined,
        addons: addons,
        notes: {
          source: 'HireLift',
          created_at: new Date().toISOString(),
          ...notes
        },
        notify: 1 // Send notifications to customer
      });

      console.log('✅ Razorpay subscription created:', subscription.id);
      return subscription;
    } catch (error) {
      console.error('❌ Error creating subscription:', error);
      throw new Error(`Failed to create subscription: ${error.message}`);
    }
  }

  /**
   * Get subscription details
   * @param {string} subscriptionId - Razorpay subscription ID
   * @returns {Promise<Object>} Subscription object
   */
  async getSubscription(subscriptionId) {
    try {
      const subscription = await this.razorpay.subscriptions.fetch(subscriptionId);
      return subscription;
    } catch (error) {
      console.error('❌ Error fetching subscription:', error);
      throw new Error(`Failed to fetch subscription: ${error.message}`);
    }
  }

  /**
   * Cancel a subscription
   * @param {string} subscriptionId - Razorpay subscription ID
   * @param {boolean} cancelAtCycleEnd - Whether to cancel at cycle end
   * @returns {Promise<Object>} Cancelled subscription object
   */
  async cancelSubscription(subscriptionId, cancelAtCycleEnd = false) {
    try {
      const subscription = await this.razorpay.subscriptions.cancel(
        subscriptionId,
        cancelAtCycleEnd
      );
      
      console.log('✅ Subscription cancelled:', subscriptionId);
      return subscription;
    } catch (error) {
      console.error('❌ Error cancelling subscription:', error);
      throw new Error(`Failed to cancel subscription: ${error.message}`);
    }
  }

  /**
   * Pause a subscription
   * @param {string} subscriptionId - Razorpay subscription ID
   * @returns {Promise<Object>} Paused subscription object
   */
  async pauseSubscription(subscriptionId) {
    try {
      const subscription = await this.razorpay.subscriptions.pause(subscriptionId);
      console.log('✅ Subscription paused:', subscriptionId);
      return subscription;
    } catch (error) {
      console.error('❌ Error pausing subscription:', error);
      throw new Error(`Failed to pause subscription: ${error.message}`);
    }
  }

  /**
   * Resume a subscription
   * @param {string} subscriptionId - Razorpay subscription ID
   * @returns {Promise<Object>} Resumed subscription object
   */
  async resumeSubscription(subscriptionId) {
    try {
      const subscription = await this.razorpay.subscriptions.resume(subscriptionId);
      console.log('✅ Subscription resumed:', subscriptionId);
      return subscription;
    } catch (error) {
      console.error('❌ Error resuming subscription:', error);
      throw new Error(`Failed to resume subscription: ${error.message}`);
    }
  }

  /**
   * Get plan details
   * @param {string} planId - Razorpay plan ID
   * @returns {Promise<Object>} Plan object
   */
  async getPlan(planId) {
    try {
      const plan = await this.razorpay.plans.fetch(planId);
      return plan;
    } catch (error) {
      console.error('❌ Error fetching plan:', error);
      throw new Error(`Failed to fetch plan: ${error.message}`);
    }
  }

  /**
   * Verify webhook signature
   * @param {string} body - Raw webhook body
   * @param {string} signature - Razorpay signature from headers
   * @param {string} secret - Webhook secret (optional, uses key_secret if not provided)
   * @returns {boolean} True if signature is valid
   */
  verifyWebhookSignature(body, signature, secret = null) {
    try {
      const expectedSignature = crypto
        .createHmac('sha256', secret || this.keySecret)
        .update(body)
        .digest('hex');

      return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
      );
    } catch (error) {
      console.error('❌ Error verifying webhook signature:', error);
      return false;
    }
  }

  /**
   * Verify payment signature (for payment verification)
   * @param {Object} params - Payment verification parameters
   * @returns {boolean} True if signature is valid
   */
  verifyPaymentSignature(params) {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = params;
      
      const body = razorpay_order_id + '|' + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac('sha256', this.keySecret)
        .update(body)
        .digest('hex');

      return crypto.timingSafeEqual(
        Buffer.from(razorpay_signature),
        Buffer.from(expectedSignature)
      );
    } catch (error) {
      console.error('❌ Error verifying payment signature:', error);
      return false;
    }
  }

  /**
   * Create payment options for frontend
   * @param {Object} subscription - Subscription object
   * @param {Object} customer - Customer object
   * @param {Object} plan - Plan object
   * @returns {Object} Payment options for Razorpay checkout
   */
  createPaymentOptions(subscription, customer, plan) {
    return {
      key: process.env.RAZORPAY_KEY_ID,
      subscription_id: subscription.id,
      name: 'HireLift',
      description: `${plan.item.name} Subscription`,
      image: process.env.NEXT_PUBLIC_APP_URL 
        ? `${process.env.NEXT_PUBLIC_APP_URL}/logo.png` 
        : '/logo.png',
      handler: function(response) {
        // This will be handled by the frontend
        console.log('Payment successful:', response);
      },
      prefill: {
        name: customer.name || 'HireLift User',
        email: customer.email,
        contact: customer.contact || ''
      },
      notes: {
        address: 'HireLift Subscription'
      },
      theme: {
        color: '#7209B7'
      },
      modal: {
        ondismiss: function() {
          console.log('Payment modal dismissed');
        }
      }
    };
  }
}

// Export singleton instance
export default new RazorpayService();
