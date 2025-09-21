/**
 * Payment Controller Integration Examples
 * Shows how to integrate Brevo contact management with Razorpay payment success handlers
 */

const { updateBrevoContact, PLAN_TYPES } = require('../lib/brevoService');

/**
 * Example: Razorpay Payment Success Handler
 * Called after successful payment verification
 */
async function handlePaymentSuccess(req, res) {
  try {
    const { 
      razorpay_payment_id, 
      razorpay_order_id, 
      razorpay_signature,
      userEmail,
      planType,
      amount,
      paymentType // 'subscription' or 'onetime'
    } = req.body;
    
    // Your existing Razorpay signature verification logic here...
    // const isValidSignature = verifyRazorpaySignature(...);
    
    // Map payment amounts to plan types for Brevo
    const brevoPlanType = mapPaymentToPlanType(amount, planType);
    
    // Update user in your database first
    // await updateUserPaymentStatus(...);
    
    // Update Brevo contact with new plan type
    const brevoResult = await updateBrevoContact(userEmail, brevoPlanType, {
      additionalAttributes: {
        LAST_PAYMENT_DATE: new Date().toISOString(),
        LAST_PAYMENT_AMOUNT: amount,
        PAYMENT_METHOD: 'razorpay',
        PAYMENT_TYPE: paymentType,
        RAZORPAY_PAYMENT_ID: razorpay_payment_id,
        RAZORPAY_ORDER_ID: razorpay_order_id
      }
    });
    
    if (brevoResult.success) {
      console.log(`💳 Payment success: Updated Brevo contact ${userEmail} to ${brevoPlanType}`);
    } else {
      console.error(`❌ Brevo update failed for ${userEmail}:`, brevoResult.error);
    }
    
    // Send payment confirmation email (your existing logic)
    // await sendPaymentConfirmationEmail(userEmail, planType, amount);
    
    res.status(200).json({
      success: true,
      message: 'Payment processed successfully',
      planType: brevoPlanType,
      brevoStatus: brevoResult.success ? 'synced' : 'failed'
    });
    
  } catch (error) {
    console.error('❌ Payment success handler error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment processing failed',
      error: error.message
    });
  }
}

/**
 * Example: Subscription Payment Handler for ₹99/month Basic Plan
 */
async function handleBasicSubscriptionPayment(req, res) {
  try {
    const { userEmail, subscriptionId, customerId } = req.body;
    
    // Your existing subscription setup logic here...
    
    // Update Brevo contact to Basic plan
    const brevoResult = await updateBrevoContact(userEmail, PLAN_TYPES.BASIC, {
      additionalAttributes: {
        SUBSCRIPTION_ID: subscriptionId,
        CUSTOMER_ID: customerId,
        SUBSCRIPTION_START_DATE: new Date().toISOString(),
        SUBSCRIPTION_STATUS: 'active',
        BILLING_CYCLE: 'monthly'
      }
    });
    
    if (brevoResult.success) {
      console.log(`📊 Basic subscription activated for ${userEmail}`);
    }
    
    res.status(200).json({
      success: true,
      message: 'Basic subscription activated',
      planType: PLAN_TYPES.BASIC
    });
    
  } catch (error) {
    console.error('❌ Basic subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Subscription activation failed',
      error: error.message
    });
  }
}

/**
 * Example: One-time Payment Handler for Premium Plans
 */
async function handleOneTimePayment(req, res) {
  try {
    const { userEmail, amount, planType, paymentId } = req.body;
    
    // Calculate expiry date (30 days from now)
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);
    
    // Map amount to plan type
    const brevoPlanType = mapPaymentToPlanType(amount, planType);
    
    // Update Brevo contact
    const brevoResult = await updateBrevoContact(userEmail, brevoPlanType, {
      additionalAttributes: {
        PURCHASE_TYPE: 'onetime',
        PURCHASE_DATE: new Date().toISOString(),
        EXPIRY_DATE: expiryDate.toISOString(),
        PAYMENT_AMOUNT: amount,
        PAYMENT_ID: paymentId
      }
    });
    
    if (brevoResult.success) {
      console.log(`🎯 One-time purchase: ${userEmail} upgraded to ${brevoPlanType}`);
    }
    
    res.status(200).json({
      success: true,
      message: 'One-time payment processed',
      planType: brevoPlanType,
      expiryDate: expiryDate.toISOString()
    });
    
  } catch (error) {
    console.error('❌ One-time payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment processing failed',
      error: error.message
    });
  }
}

/**
 * Example: Subscription Cancellation Handler
 */
async function handleSubscriptionCancellation(req, res) {
  try {
    const { userEmail, subscriptionId } = req.body;
    
    // Your existing cancellation logic here...
    
    // Downgrade to free plan in Brevo
    const brevoResult = await updateBrevoContact(userEmail, PLAN_TYPES.FREE, {
      additionalAttributes: {
        SUBSCRIPTION_STATUS: 'cancelled',
        CANCELLATION_DATE: new Date().toISOString(),
        PREVIOUS_PLAN: 'basic' // Track what they had before
      }
    });
    
    if (brevoResult.success) {
      console.log(`❌ Subscription cancelled: ${userEmail} downgraded to free`);
    }
    
    res.status(200).json({
      success: true,
      message: 'Subscription cancelled',
      planType: PLAN_TYPES.FREE
    });
    
  } catch (error) {
    console.error('❌ Subscription cancellation error:', error);
    res.status(500).json({
      success: false,
      message: 'Cancellation failed',
      error: error.message
    });
  }
}

/**
 * Example: Refund Handler
 */
async function handleRefund(req, res) {
  try {
    const { userEmail, paymentId, refundAmount, reason } = req.body;
    
    // Your existing refund logic here...
    
    // Downgrade to free plan and add refund info
    const brevoResult = await updateBrevoContact(userEmail, PLAN_TYPES.FREE, {
      additionalAttributes: {
        REFUND_DATE: new Date().toISOString(),
        REFUND_AMOUNT: refundAmount,
        REFUND_REASON: reason,
        REFUNDED_PAYMENT_ID: paymentId
      }
    });
    
    if (brevoResult.success) {
      console.log(`💰 Refund processed: ${userEmail} downgraded to free`);
    }
    
    res.status(200).json({
      success: true,
      message: 'Refund processed',
      planType: PLAN_TYPES.FREE
    });
    
  } catch (error) {
    console.error('❌ Refund processing error:', error);
    res.status(500).json({
      success: false,
      message: 'Refund processing failed',
      error: error.message
    });
  }
}

/**
 * Map payment amount and plan type to Brevo plan type
 * @param {number} amount - Payment amount in rupees
 * @param {string} planType - Plan type from frontend
 * @returns {string} Brevo plan type
 */
function mapPaymentToPlanType(amount, planType) {
  // Convert amount to number if it's a string
  const numAmount = typeof amount === 'string' ? parseInt(amount) : amount;
  
  // Direct mapping based on plan type if provided
  if (planType) {
    switch (planType.toLowerCase()) {
      case 'basic':
        return PLAN_TYPES.BASIC;
      case 'resume-fix':
      case 'resumefix':
      case 'ats-fix':
        return PLAN_TYPES.RESUME_ATS_FIX;
      case 'professional':
        return PLAN_TYPES.PROFESSIONAL;
      case 'premium':
        return PLAN_TYPES.PREMIUM;
    }
  }
  
  // Fallback mapping based on amount
  switch (numAmount) {
    case 99:
      return PLAN_TYPES.BASIC;
    case 299:
      return PLAN_TYPES.RESUME_ATS_FIX;
    case 599:
      return PLAN_TYPES.PROFESSIONAL;
    case 999:
      return PLAN_TYPES.PREMIUM;
    default:
      console.warn(`⚠️ Unknown payment amount: ${numAmount}, defaulting to free`);
      return PLAN_TYPES.FREE;
  }
}

/**
 * Webhook handler for Razorpay payment events
 */
async function handleRazorpayWebhook(req, res) {
  try {
    const { event, payload } = req.body;
    
    // Verify webhook signature (your existing logic)
    // const isValidWebhook = verifyWebhookSignature(...);
    
    switch (event) {
      case 'payment.captured':
        await handleWebhookPaymentCaptured(payload);
        break;
      case 'subscription.activated':
        await handleWebhookSubscriptionActivated(payload);
        break;
      case 'subscription.cancelled':
        await handleWebhookSubscriptionCancelled(payload);
        break;
      case 'refund.created':
        await handleWebhookRefundCreated(payload);
        break;
      default:
        console.log(`📡 Unhandled webhook event: ${event}`);
    }
    
    res.status(200).json({ success: true });
    
  } catch (error) {
    console.error('❌ Webhook processing error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * Handle payment captured webhook
 */
async function handleWebhookPaymentCaptured(payload) {
  const { payment, order } = payload;
  
  // Extract user email from order notes or metadata
  const userEmail = order.notes?.userEmail || order.receipt?.split('_')[1];
  
  if (userEmail && payment.amount) {
    const planType = mapPaymentToPlanType(payment.amount / 100, order.notes?.planType);
    
    await updateBrevoContact(userEmail, planType, {
      additionalAttributes: {
        WEBHOOK_PAYMENT_DATE: new Date().toISOString(),
        PAYMENT_STATUS: 'captured'
      }
    });
  }
}

/**
 * Handle subscription activated webhook
 */
async function handleWebhookSubscriptionActivated(payload) {
  const { subscription } = payload;
  
  // Extract user email from subscription notes
  const userEmail = subscription.notes?.userEmail;
  
  if (userEmail) {
    await updateBrevoContact(userEmail, PLAN_TYPES.BASIC, {
      additionalAttributes: {
        WEBHOOK_SUBSCRIPTION_DATE: new Date().toISOString(),
        SUBSCRIPTION_STATUS: 'active'
      }
    });
  }
}

/**
 * Handle subscription cancelled webhook
 */
async function handleWebhookSubscriptionCancelled(payload) {
  const { subscription } = payload;
  
  // Extract user email from subscription notes
  const userEmail = subscription.notes?.userEmail;
  
  if (userEmail) {
    await updateBrevoContact(userEmail, PLAN_TYPES.FREE, {
      additionalAttributes: {
        WEBHOOK_CANCELLATION_DATE: new Date().toISOString(),
        SUBSCRIPTION_STATUS: 'cancelled'
      }
    });
  }
}

/**
 * Handle refund created webhook
 */
async function handleWebhookRefundCreated(payload) {
  const { refund, payment } = payload;
  
  // Extract user email from payment notes
  const userEmail = payment.notes?.userEmail;
  
  if (userEmail) {
    await updateBrevoContact(userEmail, PLAN_TYPES.FREE, {
      additionalAttributes: {
        WEBHOOK_REFUND_DATE: new Date().toISOString(),
        REFUND_STATUS: 'processed'
      }
    });
  }
}

module.exports = {
  handlePaymentSuccess,
  handleBasicSubscriptionPayment,
  handleOneTimePayment,
  handleSubscriptionCancellation,
  handleRefund,
  handleRazorpayWebhook,
  mapPaymentToPlanType
};