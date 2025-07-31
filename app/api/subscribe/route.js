import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth';
import razorpayService from '@/lib/razorpay';
import Subscription from '@/models/Subscription';
import connectDB from '@/lib/mongodb';

/**
 * POST /api/subscribe
 * Create a new subscription for the authenticated user
 */
async function subscribeHandler(request) {
  try {
    await connectDB();
    
    const { user } = request.auth;
    const body = await request.json();
    
    const {
      planId,
      totalCount,
      quantity = 1,
      startAt,
      customerName,
      customerContact
    } = body;

    // Validation
    if (!planId) {
      return NextResponse.json(
        { error: 'Plan ID is required' },
        { status: 400 }
      );
    }

    // Check if user already has an active subscription
    const existingSubscription = await Subscription.findActiveByUserId(user._id);
    if (existingSubscription) {
      return NextResponse.json(
        { 
          error: 'User already has an active subscription',
          subscription: {
            id: existingSubscription.razorpaySubscriptionId,
            status: existingSubscription.status,
            endAt: existingSubscription.endAt
          }
        },
        { status: 409 }
      );
    }

    console.log('🚀 Creating subscription for user:', user.email);

    // Step 1: Get plan details from Razorpay
    const plan = await razorpayService.getPlan(planId);
    console.log('📋 Plan details:', plan.item.name, plan.item.amount / 100, plan.item.currency);

    // Step 2: Create or get Razorpay customer
    const customer = await razorpayService.getOrCreateCustomer(user.email, {
      name: customerName || user.name || 'HireLift User',
      contact: customerContact || ''
    });    // Step 3: Calculate subscription timing (for our database record)
    const subscriptionStartAt = startAt ? new Date(startAt) : new Date();
    const subscriptionEndAt = calculateEndDate(subscriptionStartAt, plan);

    // Step 4: Create subscription in Razorpay (start immediately)
    const razorpaySubscription = await razorpayService.createSubscription({
      planId: planId,
      customerId: customer.id,
      totalCount: totalCount,
      quantity: quantity,
      // Don't set startAt - let it start immediately
      notes: {
        userId: user._id.toString(),
        email: user.email,
        source: 'HireLift Web App'
      }
    });

    // Step 5: Save subscription to database
    const subscription = new Subscription({
      userId: user._id,
      razorpaySubscriptionId: razorpaySubscription.id,
      razorpayCustomerId: customer.id,
      razorpayPlanId: planId,
      status: razorpaySubscription.status,
      startAt: subscriptionStartAt,
      endAt: subscriptionEndAt,
      planDetails: {
        name: plan.item.name,
        amount: plan.item.amount,
        currency: plan.item.currency,
        period: plan.period,
        interval: plan.interval
      },
      totalCount: razorpaySubscription.total_count,
      paidCount: razorpaySubscription.paid_count || 0,
      remainingCount: razorpaySubscription.remain_count || razorpaySubscription.total_count,
      metadata: {
        createdBy: 'api',
        userAgent: request.headers.get('user-agent') || 'unknown'
      }
    });

    await subscription.save();

    // Step 6: Create payment options for frontend
    const paymentOptions = razorpayService.createPaymentOptions(
      razorpaySubscription,
      customer,
      plan
    );

    console.log('✅ Subscription created successfully:', subscription.razorpaySubscriptionId);    // Step 7: Return response with payment options
    return NextResponse.json({
      success: true,
      message: 'Subscription created successfully',
      subscription: {
        id: subscription._id,
        razorpaySubscriptionId: subscription.razorpaySubscriptionId,
        status: subscription.status,
        startAt: subscription.startAt,
        endAt: subscription.endAt,
        planDetails: subscription.planDetails
      },
      razorpaySubscription: {
        id: razorpaySubscription.id,
        status: razorpaySubscription.status,
        plan_id: razorpaySubscription.plan_id,
        customer_id: razorpaySubscription.customer_id,
        total_count: razorpaySubscription.total_count,
        paid_count: razorpaySubscription.paid_count,
        remain_count: razorpaySubscription.remain_count
      },
      paymentOptions,
      customer: {
        id: customer.id,
        email: customer.email,
        name: customer.name
      }
    }, { status: 201 });

  } catch (error) {
    console.error('❌ Subscription creation error:', error);
    
    // Handle specific Razorpay errors
    if (error.message.includes('Plan not found')) {
      return NextResponse.json(
        { error: 'Invalid plan ID provided' },
        { status: 400 }
      );
    }
    
    if (error.message.includes('Customer')) {
      return NextResponse.json(
        { error: 'Failed to create customer account' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Failed to create subscription',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/subscribe
 * Get user's subscription details
 */
async function getSubscriptionHandler(request) {
  try {
    await connectDB();
    
    const { user } = request.auth;

    // Get user's current subscription
    const subscription = await Subscription.findOne({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(1);

    if (!subscription) {
      return NextResponse.json({
        subscription: null,
        message: 'No subscription found'
      });
    }

    // Get latest subscription data from Razorpay
    try {
      const razorpaySubscription = await razorpayService.getSubscription(
        subscription.razorpaySubscriptionId
      );
      
      // Update local subscription with latest data
      subscription.status = razorpaySubscription.status;
      subscription.paidCount = razorpaySubscription.paid_count || 0;
      subscription.remainingCount = razorpaySubscription.remain_count || 0;
      await subscription.save();
      
    } catch (razorpayError) {
      console.warn('⚠️ Could not fetch latest subscription data from Razorpay:', razorpayError.message);
    }

    return NextResponse.json({
      subscription: {
        id: subscription._id,
        razorpaySubscriptionId: subscription.razorpaySubscriptionId,
        status: subscription.status,
        startAt: subscription.startAt,
        endAt: subscription.endAt,
        planDetails: subscription.planDetails,
        totalCount: subscription.totalCount,
        paidCount: subscription.paidCount,
        remainingCount: subscription.remainingCount,
        isActive: subscription.isActive(),
        isExpired: subscription.isExpired(),
        createdAt: subscription.createdAt
      }
    });

  } catch (error) {
    console.error('❌ Get subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscription details' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/subscribe
 * Cancel user's subscription
 */
async function cancelSubscriptionHandler(request) {
  try {
    await connectDB();
    
    const { user } = request.auth;
    const url = new URL(request.url);
    const cancelAtCycleEnd = url.searchParams.get('cancel_at_cycle_end') === 'true';

    // Find user's active subscription
    const subscription = await Subscription.findActiveByUserId(user._id);
    
    if (!subscription) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 404 }
      );
    }

    // Cancel subscription in Razorpay
    const cancelledSubscription = await razorpayService.cancelSubscription(
      subscription.razorpaySubscriptionId,
      cancelAtCycleEnd
    );

    // Update subscription in database
    subscription.status = cancelledSubscription.status;
    subscription.cancelledAt = new Date();
    subscription.cancelReason = cancelAtCycleEnd ? 'User cancelled at cycle end' : 'User cancelled immediately';
    
    if (cancelledSubscription.ended_at) {
      subscription.endAt = new Date(cancelledSubscription.ended_at * 1000);
    }
    
    await subscription.save();

    console.log('✅ Subscription cancelled:', subscription.razorpaySubscriptionId);

    return NextResponse.json({
      success: true,
      message: 'Subscription cancelled successfully',
      subscription: {
        id: subscription._id,
        status: subscription.status,
        cancelledAt: subscription.cancelledAt,
        endAt: subscription.endAt
      }
    });

  } catch (error) {
    console.error('❌ Cancel subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to cancel subscription' },
      { status: 500 }
    );
  }
}

// Calculate subscription end date based on plan
function calculateEndDate(startDate, plan) {
  const endDate = new Date(startDate);
  
  switch (plan.period) {
    case 'daily':
      endDate.setDate(endDate.getDate() + (plan.interval || 1));
      break;
    case 'weekly':
      endDate.setDate(endDate.getDate() + ((plan.interval || 1) * 7));
      break;
    case 'monthly':
      endDate.setMonth(endDate.getMonth() + (plan.interval || 1));
      break;
    case 'yearly':
      endDate.setFullYear(endDate.getFullYear() + (plan.interval || 1));
      break;
    default:
      // Default to monthly if period is not recognized
      endDate.setMonth(endDate.getMonth() + 1);
  }
  
  return endDate;
}

// Export route handlers with authentication
export const POST = withAuth(subscribeHandler);
export const GET = withAuth(getSubscriptionHandler);
export const DELETE = withAuth(cancelSubscriptionHandler);
