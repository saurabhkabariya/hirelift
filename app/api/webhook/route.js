import { NextResponse } from 'next/server';
import razorpayService from '@/lib/razorpay';
import Subscription from '@/models/Subscription';
import User from '@/models/User';
import connectDB from '@/lib/mongodb';
import { updateBrevoContact, PLAN_TYPES } from '@/lib/brevoService';

/**
 * POST /api/webhook
 * Handle Razorpay webhook events
 */
export async function POST(request) {
  try {
    // Get raw body for signature verification
    const body = await request.text();
    const signature = request.headers.get('x-razorpay-signature');

    if (!signature) {
      console.error('❌ Missing Razorpay signature header');
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    const isValidSignature = razorpayService.verifyWebhookSignature(body, signature);
    
    if (!isValidSignature) {
      console.error('❌ Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Parse webhook payload
    const webhookData = JSON.parse(body);
    const { event, payload } = webhookData;

    console.log('🔔 Received webhook event:', event);
    console.log('📦 Webhook payload:', JSON.stringify(payload, null, 2));

    await connectDB();

    // Handle different webhook events
    let result;
    switch (event) {
      case 'subscription.activated':
        result = await handleSubscriptionActivated(payload);
        break;
      
      case 'subscription.charged':
        result = await handleSubscriptionCharged(payload);
        break;
      
      case 'subscription.completed':
        result = await handleSubscriptionCompleted(payload);
        break;
      
      case 'subscription.cancelled':
        result = await handleSubscriptionCancelled(payload);
        break;
      
      case 'subscription.paused':
        result = await handleSubscriptionPaused(payload);
        break;
      
      case 'subscription.resumed':
        result = await handleSubscriptionResumed(payload);
        break;
      
      case 'subscription.pending':
        result = await handleSubscriptionPending(payload);
        break;
      
      case 'subscription.halted':
        result = await handleSubscriptionHalted(payload);
        break;
      
      case 'payment.failed':
        result = await handlePaymentFailed(payload);
        break;
      
      default:
        console.log(`⚠️  Unhandled webhook event: ${event}`);
        result = { message: `Event ${event} received but not processed` };
    }

    console.log('✅ Webhook processed successfully:', result.message);

    return NextResponse.json({
      success: true,
      event: event,
      message: result.message,
      subscriptionId: result.subscriptionId
    });

  } catch (error) {
    console.error('❌ Webhook processing error:', error);
    
    // Log detailed error for debugging
    console.error('Webhook error details:', {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json(
      { 
        error: 'Webhook processing failed',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

/**
 * Handle subscription activated event
 */
async function handleSubscriptionActivated(payload) {
  const { subscription } = payload;
  
  const dbSubscription = await Subscription.findByRazorpayId(subscription.id);
  if (!dbSubscription) {
    throw new Error(`Subscription not found: ${subscription.id}`);
  }

  // Update subscription status
  await dbSubscription.updateFromWebhook({
    event_id: payload.event_id || 'webhook_activated',
    event: 'subscription.activated',
    created_at: Date.now() / 1000,
    subscription: subscription
  });
  // Update user premium status with proper subscription tracking
  const now = new Date();
  await User.findByIdAndUpdate(dbSubscription.userId, {
    isPremium: true,
    proPlanType: 'subscription',
    purchaseDate: now, // Update purchase date when subscription activates
    expiryDate: null, // Subscriptions are managed by webhook events
    updatedAt: now
  });

  console.log('✅ Subscription activated and user upgraded to premium:', subscription.id);

  return {
    message: 'Subscription activated successfully',
    subscriptionId: subscription.id
  };
}

/**
 * Handle subscription charged event (successful payment)
 */
async function handleSubscriptionCharged(payload) {
  const { subscription, payment } = payload;
  
  const dbSubscription = await Subscription.findByRazorpayId(subscription.id);
  if (!dbSubscription) {
    throw new Error(`Subscription not found: ${subscription.id}`);
  }

  // Update subscription with payment info
  await dbSubscription.updateFromWebhook({
    event_id: payment?.id || 'webhook_charged',
    event: 'subscription.charged',
    created_at: Date.now() / 1000,
    subscription: subscription
  });
  // Ensure user remains premium with proper subscription tracking
  const now = new Date();
  const updatedUser = await User.findByIdAndUpdate(dbSubscription.userId, {
    isPremium: true,
    proPlanType: 'subscription', // Ensure this is always set for subscription users
    expiryDate: null, // Subscriptions are managed by webhooks
    updatedAt: now
  });

  // Update user plan in Brevo for subscription payment
  if (updatedUser) {
    try {
      await updateBrevoContact(updatedUser.email, PLAN_TYPES.BASIC, {
        additionalAttributes: {
          SUBSCRIPTION_CHARGED_DATE: now.toISOString(),
          SUBSCRIPTION_STATUS: 'active',
          RAZORPAY_SUBSCRIPTION_ID: subscription.id,
          RAZORPAY_PAYMENT_ID: payment?.id || 'webhook_payment',
          PAYMENT_TYPE: 'subscription',
          WEBHOOK_EVENT: 'subscription.charged'
        }
      });
      console.log(`📧 Brevo updated for subscription charged: ${updatedUser.email}`);
    } catch (brevoError) {
      console.error(`❌ Brevo update failed for subscription charged:`, brevoError);
    }
  }

  console.log('✅ Subscription charged successfully:', subscription.id, 'Payment:', payment?.id);

  return {
    message: 'Subscription charged successfully',
    subscriptionId: subscription.id,
    paymentId: payment?.id
  };
}

/**
 * Handle subscription completed event
 */
async function handleSubscriptionCompleted(payload) {
  const { subscription } = payload;
  
  const dbSubscription = await Subscription.findByRazorpayId(subscription.id);
  if (!dbSubscription) {
    throw new Error(`Subscription not found: ${subscription.id}`);
  }

  // Update subscription status
  await dbSubscription.updateFromWebhook({
    event_id: payload.event_id || 'webhook_completed',
    event: 'subscription.completed',
    created_at: Date.now() / 1000,
    subscription: subscription
  });

  // Check if user should lose premium status when subscription completes
  const hasOtherActiveSubscriptions = await Subscription.findOne({
    userId: dbSubscription.userId,
    status: 'active',
    endAt: { $gt: new Date() },
    _id: { $ne: dbSubscription._id }
  });
  
  if (!hasOtherActiveSubscriptions) {
    const now = new Date();
    const updatedUser = await User.findByIdAndUpdate(dbSubscription.userId, {
      isPremium: false,
      proPlanType: null, // Clear subscription type
      expiryDate: null, // Clear expiry date
      updatedAt: now
    });

    // Downgrade user to free plan in Brevo when subscription completes
    if (updatedUser) {
      try {
        await updateBrevoContact(updatedUser.email, PLAN_TYPES.FREE, {
          additionalAttributes: {
            SUBSCRIPTION_COMPLETED_DATE: now.toISOString(),
            SUBSCRIPTION_STATUS: 'completed',
            RAZORPAY_SUBSCRIPTION_ID: subscription.id,
            PREVIOUS_PLAN: 'basic',
            WEBHOOK_EVENT: 'subscription.completed'
          }
        });
        console.log(`📧 Brevo downgraded to free after completion: ${updatedUser.email}`);
      } catch (brevoError) {
        console.error(`❌ Brevo downgrade failed after completion:`, brevoError);
      }
    }

    console.log('✅ User premium status revoked due to subscription completion');
  }

  console.log('✅ Subscription completed:', subscription.id);

  return {
    message: 'Subscription completed',
    subscriptionId: subscription.id
  };
}

/**
 * Handle subscription cancelled event
 */
async function handleSubscriptionCancelled(payload) {
  const { subscription } = payload;
  
  const dbSubscription = await Subscription.findByRazorpayId(subscription.id);
  if (!dbSubscription) {
    throw new Error(`Subscription not found: ${subscription.id}`);
  }

  // Update subscription status
  await dbSubscription.updateFromWebhook({
    event_id: payload.event_id || 'webhook_cancelled',
    event: 'subscription.cancelled',
    created_at: Date.now() / 1000,
    subscription: subscription
  });

  // Check if user should lose premium status
  const hasOtherActiveSubscriptions = await Subscription.findOne({
    userId: dbSubscription.userId,
    status: 'active',
    endAt: { $gt: new Date() },
    _id: { $ne: dbSubscription._id }
  });
  
  if (!hasOtherActiveSubscriptions) {
    const now = new Date();
    const updatedUser = await User.findByIdAndUpdate(dbSubscription.userId, {
      isPremium: false,
      proPlanType: null, // Clear subscription type
      expiryDate: null, // Clear expiry date
      updatedAt: now
    });

    // Downgrade user to free plan in Brevo
    if (updatedUser) {
      try {
        await updateBrevoContact(updatedUser.email, PLAN_TYPES.FREE, {
          additionalAttributes: {
            SUBSCRIPTION_CANCELLED_DATE: now.toISOString(),
            SUBSCRIPTION_STATUS: 'cancelled',
            RAZORPAY_SUBSCRIPTION_ID: subscription.id,
            PREVIOUS_PLAN: 'basic',
            WEBHOOK_EVENT: 'subscription.cancelled'
          }
        });
        console.log(`📧 Brevo downgraded to free: ${updatedUser.email}`);
      } catch (brevoError) {
        console.error(`❌ Brevo downgrade failed:`, brevoError);
      }
    }

    console.log('✅ User premium status revoked due to subscription cancellation');
  }

  console.log('✅ Subscription cancelled:', subscription.id);

  return {
    message: 'Subscription cancelled',
    subscriptionId: subscription.id
  };
}

/**
 * Handle subscription paused event
 */
async function handleSubscriptionPaused(payload) {
  const { subscription } = payload;
  
  const dbSubscription = await Subscription.findByRazorpayId(subscription.id);
  if (!dbSubscription) {
    throw new Error(`Subscription not found: ${subscription.id}`);
  }

  // Update subscription status
  await dbSubscription.updateFromWebhook({
    event_id: payload.event_id || 'webhook_paused',
    event: 'subscription.paused',
    created_at: Date.now() / 1000,
    subscription: subscription
  });

  console.log('✅ Subscription paused:', subscription.id);

  return {
    message: 'Subscription paused',
    subscriptionId: subscription.id
  };
}

/**
 * Handle subscription resumed event
 */
async function handleSubscriptionResumed(payload) {
  const { subscription } = payload;
  
  const dbSubscription = await Subscription.findByRazorpayId(subscription.id);
  if (!dbSubscription) {
    throw new Error(`Subscription not found: ${subscription.id}`);
  }

  // Update subscription status
  await dbSubscription.updateFromWebhook({
    event_id: payload.event_id || 'webhook_resumed',
    event: 'subscription.resumed',
    created_at: Date.now() / 1000,
    subscription: subscription
  });
  // Restore premium status if subscription is active
  if (subscription.status === 'active') {
    const now = new Date();
    const updatedUser = await User.findByIdAndUpdate(dbSubscription.userId, {
      isPremium: true,
      proPlanType: 'subscription', // Ensure subscription type is set
      expiryDate: null, // Subscriptions are managed by webhooks
      updatedAt: now
    });

    // Update user plan in Brevo for subscription resumption
    if (updatedUser) {
      try {
        await updateBrevoContact(updatedUser.email, PLAN_TYPES.BASIC, {
          additionalAttributes: {
            SUBSCRIPTION_RESUMED_DATE: now.toISOString(),
            SUBSCRIPTION_STATUS: 'active',
            RAZORPAY_SUBSCRIPTION_ID: subscription.id,
            WEBHOOK_EVENT: 'subscription.resumed'
          }
        });
        console.log(`📧 Brevo updated for subscription resumed: ${updatedUser.email}`);
      } catch (brevoError) {
        console.error(`❌ Brevo update failed for subscription resumed:`, brevoError);
      }
    }
  }

  console.log('✅ Subscription resumed:', subscription.id);

  return {
    message: 'Subscription resumed',
    subscriptionId: subscription.id
  };
}

/**
 * Handle subscription pending event
 */
async function handleSubscriptionPending(payload) {
  const { subscription } = payload;
  
  const dbSubscription = await Subscription.findByRazorpayId(subscription.id);
  if (!dbSubscription) {
    throw new Error(`Subscription not found: ${subscription.id}`);
  }

  // Update subscription status
  await dbSubscription.updateFromWebhook({
    event_id: payload.event_id || 'webhook_pending',
    event: 'subscription.pending',
    created_at: Date.now() / 1000,
    subscription: subscription
  });

  console.log('✅ Subscription pending:', subscription.id);

  return {
    message: 'Subscription pending',
    subscriptionId: subscription.id
  };
}

/**
 * Handle subscription halted event (payment failures)
 */
async function handleSubscriptionHalted(payload) {
  const { subscription } = payload;
  
  const dbSubscription = await Subscription.findByRazorpayId(subscription.id);
  if (!dbSubscription) {
    throw new Error(`Subscription not found: ${subscription.id}`);
  }

  // Update subscription status
  await dbSubscription.updateFromWebhook({
    event_id: payload.event_id || 'webhook_halted',
    event: 'subscription.halted',
    created_at: Date.now() / 1000,
    subscription: subscription
  });

  // User may lose premium status depending on grace period
  console.log('⚠️  Subscription halted due to payment issues:', subscription.id);

  return {
    message: 'Subscription halted',
    subscriptionId: subscription.id
  };
}

/**
 * Handle payment failed event
 */
async function handlePaymentFailed(payload) {
  const { payment } = payload;
  
  // Log payment failure for monitoring
  console.log('❌ Payment failed:', payment?.id, 'Subscription:', payment?.subscription_id);

  // You can add logic here to handle payment failures
  // such as sending notifications, updating retry counters, etc.

  return {
    message: 'Payment failure logged',
    paymentId: payment?.id,
    subscriptionId: payment?.subscription_id
  };
}

// Only allow POST method for webhooks
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
