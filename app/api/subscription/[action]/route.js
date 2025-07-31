import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth';
import razorpayService from '@/lib/razorpay';
import Subscription from '@/models/Subscription';
import connectDB from '@/lib/mongodb';

/**
 * POST /api/subscription/pause
 * Pause user's active subscription
 */
async function pauseSubscriptionHandler(request) {
  try {
    await connectDB();
    
    const { user } = request.auth;

    // Find user's active subscription
    const subscription = await Subscription.findActiveByUserId(user._id);
    
    if (!subscription) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 404 }
      );
    }

    if (subscription.status !== 'active') {
      return NextResponse.json(
        { error: 'Subscription is not active' },
        { status: 400 }
      );
    }

    // Pause subscription in Razorpay
    const pausedSubscription = await razorpayService.pauseSubscription(
      subscription.razorpaySubscriptionId
    );

    // Update subscription in database
    subscription.status = pausedSubscription.status;
    await subscription.save();

    console.log('✅ Subscription paused:', subscription.razorpaySubscriptionId);

    return NextResponse.json({
      success: true,
      message: 'Subscription paused successfully',
      subscription: {
        id: subscription._id,
        razorpaySubscriptionId: subscription.razorpaySubscriptionId,
        status: subscription.status
      }
    });

  } catch (error) {
    console.error('❌ Pause subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to pause subscription' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/subscription/resume
 * Resume user's paused subscription
 */
async function resumeSubscriptionHandler(request) {
  try {
    await connectDB();
    
    const { user } = request.auth;

    // Find user's paused subscription
    const subscription = await Subscription.findOne({
      userId: user._id,
      status: 'paused'
    }).sort({ createdAt: -1 });
    
    if (!subscription) {
      return NextResponse.json(
        { error: 'No paused subscription found' },
        { status: 404 }
      );
    }

    // Resume subscription in Razorpay
    const resumedSubscription = await razorpayService.resumeSubscription(
      subscription.razorpaySubscriptionId
    );

    // Update subscription in database
    subscription.status = resumedSubscription.status;
    await subscription.save();

    console.log('✅ Subscription resumed:', subscription.razorpaySubscriptionId);

    return NextResponse.json({
      success: true,
      message: 'Subscription resumed successfully',
      subscription: {
        id: subscription._id,
        razorpaySubscriptionId: subscription.razorpaySubscriptionId,
        status: subscription.status
      }
    });

  } catch (error) {
    console.error('❌ Resume subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to resume subscription' },
      { status: 500 }
    );
  }
}

// Export route handlers with authentication
export const POST = withAuth(async (request) => {
  const url = new URL(request.url);
  const action = url.pathname.split('/').pop();

  switch (action) {
    case 'pause':
      return pauseSubscriptionHandler(request);
    case 'resume':
      return resumeSubscriptionHandler(request);
    default:
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
  }
});
