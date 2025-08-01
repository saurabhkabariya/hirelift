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
    }    // Get subscription details from Razorpay to verify status
    const razorpaySubscription = await razorpayService.getSubscription(razorpay_subscription_id);
    
    console.log('📊 Razorpay subscription status:', razorpaySubscription.status);
    console.log('📊 Full subscription details:', {
      id: razorpaySubscription.id,
      status: razorpaySubscription.status,
      current_start: razorpaySubscription.current_start,
      current_end: razorpaySubscription.current_end,
      paid_count: razorpaySubscription.paid_count,
      total_count: razorpaySubscription.total_count,
      customer_id: razorpaySubscription.customer_id
    });

    // Check if payment is successful - expanded statuses for better coverage
    const successfulStatuses = [
      'active',        // Subscription is active and running
      'authenticated', // Payment authenticated, subscription ready
      'created',       // Subscription created and payment processed
      'pending'        // Payment pending but subscription valid
    ];
    const isPaymentSuccessful = successfulStatuses.includes(razorpaySubscription.status);

    // For debugging - log the decision
    console.log('🔍 Payment status check:', {
      status: razorpaySubscription.status,
      isSuccessful: isPaymentSuccessful,
      acceptedStatuses: successfulStatuses
    });

    if (isPaymentSuccessful) {      // Update subscription status in database
      await Subscription.findByIdAndUpdate(subscription._id, {
        status: razorpaySubscription.status,
        paidCount: razorpaySubscription.paid_count || 0,
        remainingCount: razorpaySubscription.remain_count || razorpaySubscription.total_count,
        updatedAt: new Date()
      });

      // Calculate subscription dates for user record
      const purchaseDate = new Date();
      
      // Get subscription end date from our database subscription record or calculate it
      let expiryDate;
      if (subscription.endAt) {
        expiryDate = new Date(subscription.endAt);
      } else {
        // Fallback: calculate based on subscription total count (assuming monthly)
        expiryDate = new Date(purchaseDate);
        const monthsToAdd = razorpaySubscription.total_count || 12; // Default to 12 months
        expiryDate.setMonth(expiryDate.getMonth() + monthsToAdd);
      }

      // Update user premium status with subscription details
      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        {
          isPremium: true,
          proPlanType: 'subscription',
          purchaseDate: purchaseDate,
          expiryDate: expiryDate,
          paymentDetails: {
            razorpay_payment_id: razorpay_payment_id,
            razorpay_subscription_id: razorpay_subscription_id,
            amount: razorpaySubscription.plan_id ? 'subscription_amount' : 'unknown', // We can get this from plan details if needed
            currency: 'INR',
            method: 'subscription',
            status: razorpaySubscription.status,
            created_at: new Date()
          },
          updatedAt: new Date()
        },
        { new: true }
      );

      console.log('✅ Payment verified and user upgraded to premium with subscription details:', user.email);
      console.log('📅 Subscription details:', {
        proPlanType: 'subscription',
        purchaseDate: purchaseDate.toISOString(),
        expiryDate: expiryDate.toISOString(),
        totalCount: razorpaySubscription.total_count
      });      return NextResponse.json({
        success: true,
        message: 'Payment verified successfully',
        user: {
          id: updatedUser._id,
          email: updatedUser.email,
          name: updatedUser.name,
          isPremium: updatedUser.isPremium,
          proPlanType: updatedUser.proPlanType,
          purchaseDate: updatedUser.purchaseDate,
          expiryDate: updatedUser.expiryDate
        },
        subscription: {
          id: subscription._id,
          status: razorpaySubscription.status,
          razorpaySubscriptionId: razorpay_subscription_id,
          totalCount: razorpaySubscription.total_count,
          paidCount: razorpaySubscription.paid_count,
          remainingCount: razorpaySubscription.remain_count
        }
      });} else {
      console.log('⚠️ Payment verification failed - subscription status not recognized');
      console.log('📊 Status details:', {
        currentStatus: razorpaySubscription.status,
        acceptedStatuses: successfulStatuses,
        subscriptionId: razorpay_subscription_id,
        customerId: razorpaySubscription.customer_id
      });
      
      // Provide more specific error messages based on status
      let errorMessage = 'Payment verification failed';
      let shouldRetry = false;
      
      switch (razorpaySubscription.status) {
        case 'created':
          errorMessage = 'Payment is being processed. Please wait a moment and try again.';
          shouldRetry = true;
          break;
        case 'pending':
          errorMessage = 'Payment is pending. This may take a few minutes to complete.';
          shouldRetry = true;
          break;
        case 'halted':
          errorMessage = 'Subscription is temporarily halted. Please contact support.';
          break;
        case 'cancelled':
          errorMessage = 'Subscription was cancelled. Please create a new subscription.';
          break;
        case 'completed':
          errorMessage = 'Subscription has completed its term. Please renew your subscription.';
          break;
        case 'expired':
          errorMessage = 'Subscription has expired. Please create a new subscription.';
          break;
        default:
          errorMessage = `Payment verification failed. Status: ${razorpaySubscription.status}. Please contact support.`;
      }
      
      return NextResponse.json({
        success: false,
        message: errorMessage,
        status: razorpaySubscription.status,
        shouldRetry: shouldRetry,
        subscriptionDetails: {
          id: razorpay_subscription_id,
          status: razorpaySubscription.status,
          paidCount: razorpaySubscription.paid_count || 0,
          totalCount: razorpaySubscription.total_count || 0
        }
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
