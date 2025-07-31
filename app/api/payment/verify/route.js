import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth';
import razorpayService from '@/lib/razorpay';
import Subscription from '@/models/Subscription';
import User from '@/models/User';
import connectDB from '@/lib/mongodb';

/**
 * POST /api/payment/verify
 * Verify payment and update user status immediately
 */
async function verifyPaymentHandler(request) {
  try {
    await connectDB();
    
    const { user } = request.auth;
    const body = await request.json();
    
    const {
      razorpay_payment_id,
      razorpay_subscription_id,
      razorpay_signature
    } = body;

    // Validation
    if (!razorpay_payment_id || !razorpay_subscription_id) {
      return NextResponse.json(
        { error: 'Missing payment details' },
        { status: 400 }
      );
    }

    console.log('🔍 Verifying payment for user:', user.email);
    console.log('📋 Payment details:', {
      payment_id: razorpay_payment_id,
      subscription_id: razorpay_subscription_id
    });

    // Find the subscription in our database
    const subscription = await Subscription.findOne({
      userId: user._id,
      razorpaySubscriptionId: razorpay_subscription_id
    });

    if (!subscription) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      );
    }

    // Get subscription details from Razorpay to verify status
    const razorpaySubscription = await razorpayService.getSubscription(razorpay_subscription_id);
    
    console.log('📊 Razorpay subscription status:', razorpaySubscription.status);

    // Check if payment is successful (subscription should be active or authenticated)
    const successfulStatuses = ['active', 'authenticated'];
    const isPaymentSuccessful = successfulStatuses.includes(razorpaySubscription.status);

    if (isPaymentSuccessful) {
      // Update subscription status in database
      await Subscription.findByIdAndUpdate(subscription._id, {
        status: razorpaySubscription.status,
        paidCount: razorpaySubscription.paid_count || 0,
        remainingCount: razorpaySubscription.remain_count || razorpaySubscription.total_count,
        updatedAt: new Date()
      });

      // Update user premium status immediately
      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        {
          isPremium: true,
          updatedAt: new Date()
        },
        { new: true }
      );

      console.log('✅ Payment verified and user upgraded to premium:', user.email);

      return NextResponse.json({
        success: true,
        message: 'Payment verified successfully',
        user: {
          id: updatedUser._id,
          email: updatedUser.email,
          name: updatedUser.name,
          isPremium: updatedUser.isPremium
        },
        subscription: {
          id: subscription._id,
          status: razorpaySubscription.status,
          razorpaySubscriptionId: razorpay_subscription_id
        }
      });

    } else {
      console.log('⚠️ Payment not successful, subscription status:', razorpaySubscription.status);
      
      return NextResponse.json({
        success: false,
        message: 'Payment verification failed',
        status: razorpaySubscription.status
      }, { status: 400 });
    }

  } catch (error) {
    console.error('❌ Payment verification error:', error);
    
    return NextResponse.json(
      { 
        error: 'Payment verification failed',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

export const POST = withAuth(verifyPaymentHandler);
