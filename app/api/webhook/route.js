import { NextResponse } from 'next/server';
import razorpayService from '@/lib/razorpay';
import Subscription from '@/models/Subscription';
import User from '@/models/User';
import connectDB from '@/lib/mongodb';

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

  // Calculate subscription dates
  const purchaseDate = new Date();
  let expiryDate = new Date(purchaseDate);
  
  // Use subscription end date if available, otherwise calculate from total count
  if (subscription.end_at) {
    expiryDate = new Date(subscription.end_at * 1000); // Razorpay timestamps are in seconds
  } else if (dbSubscription.endAt) {
    expiryDate = new Date(dbSubscription.endAt);
  } else {
    // Fallback: calculate based on total count (assuming monthly)
    const monthsToAdd = subscription.total_count || 12;
    expiryDate.setMonth(expiryDate.getMonth() + monthsToAdd);
  }

  // Update user premium status with subscription details
  await User.findByIdAndUpdate(dbSubscription.userId, {
    isPremium: true,
    proPlanType: 'subscription',
    purchaseDate: purchaseDate,
    expiryDate: expiryDate,
    paymentDetails: {
      razorpay_subscription_id: subscription.id,
      amount: 'subscription_amount',
      currency: 'INR',
      method: 'subscription',
      status: subscription.status,
      created_at: new Date()
    },
    updatedAt: new Date()
  });

  console.log('✅ Subscription activated and user upgraded to premium with details:', subscription.id);
  console.log('📅 Webhook subscription details:', {
    proPlanType: 'subscription',
    purchaseDate: purchaseDate.toISOString(),
    expiryDate: expiryDate.toISOString(),
    subscriptionStatus: subscription.status
  });

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
  // Calculate subscription dates for charged subscription
  const purchaseDate = new Date();
  let expiryDate = new Date(purchaseDate);
  
  // Use subscription end date if available, otherwise calculate from total count
  if (subscription.end_at) {
    expiryDate = new Date(subscription.end_at * 1000); // Razorpay timestamps are in seconds
  } else if (dbSubscription.endAt) {
    expiryDate = new Date(dbSubscription.endAt);
  } else {
    // Fallback: calculate based on total count (assuming monthly)
    const monthsToAdd = subscription.total_count || 12;
    expiryDate.setMonth(expiryDate.getMonth() + monthsToAdd);
  }

  // Ensure user remains premium with full subscription details
  await User.findByIdAndUpdate(dbSubscription.userId, {
    isPremium: true,
    proPlanType: 'subscription',
    purchaseDate: purchaseDate,
    expiryDate: expiryDate,
    paymentDetails: {
      razorpay_subscription_id: subscription.id,
      razorpay_payment_id: payment?.id,
      amount: 'subscription_amount',
      currency: 'INR',
      method: 'subscription',
      status: subscription.status,
      created_at: new Date()
    },
    updatedAt: new Date()
  });

  console.log('✅ Subscription charged and user premium details updated:', subscription.id);
  console.log('📅 Charged subscription details:', {
    proPlanType: 'subscription',
    purchaseDate: purchaseDate.toISOString(),
    expiryDate: expiryDate.toISOString(),
    paymentId: payment?.id
  });

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
    await User.findByIdAndUpdate(dbSubscription.userId, {
      isPremium: false,
      updatedAt: new Date()
    });
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
    // Calculate subscription dates for resumed subscription
    const purchaseDate = new Date();
    let expiryDate = new Date(purchaseDate);
    
    // Use subscription end date if available, otherwise calculate from total count
    if (subscription.end_at) {
      expiryDate = new Date(subscription.end_at * 1000); // Razorpay timestamps are in seconds
    } else if (dbSubscription.endAt) {
      expiryDate = new Date(dbSubscription.endAt);
    } else {
      // Fallback: calculate based on total count (assuming monthly)
      const monthsToAdd = subscription.total_count || 12;
      expiryDate.setMonth(expiryDate.getMonth() + monthsToAdd);
    }

    await User.findByIdAndUpdate(dbSubscription.userId, {
      isPremium: true,
      proPlanType: 'subscription',
      purchaseDate: purchaseDate,
      expiryDate: expiryDate,
      paymentDetails: {
        razorpay_subscription_id: subscription.id,
        amount: 'subscription_amount',
        currency: 'INR',
        method: 'subscription',
        status: subscription.status,
        created_at: new Date()
      },
      updatedAt: new Date()
    });

    console.log('✅ Subscription resumed and user premium details updated:', subscription.id);
    console.log('📅 Resumed subscription details:', {
      proPlanType: 'subscription',
      purchaseDate: purchaseDate.toISOString(),
      expiryDate: expiryDate.toISOString(),
      subscriptionStatus: subscription.status
    });
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
