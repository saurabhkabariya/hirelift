import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth';
import razorpayService from '@/lib/razorpay';
import User from '@/models/User';
import connectDB from '@/lib/mongodb';
import crypto from 'crypto';
import { updateBrevoContact, PLAN_TYPES } from '@/lib/brevoService';

/**
 * POST /api/verify-payment
 * Verify Razorpay one-time payment and update user status
 */
async function verifyPaymentHandler(request) {
  try {
    await connectDB();
    
    const { user } = request.auth;
    const body = await request.json();
    
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature
    } = body;

    // Validation
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing payment details' },
        { status: 400 }
      );
    }

    console.log('🔍 Verifying one-time payment for user:', user.email);
    console.log('📋 Payment details:', {
      payment_id: razorpay_payment_id,
      order_id: razorpay_order_id
    });

    // Verify payment signature using HMAC SHA256
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    const body_signature = razorpay_order_id + '|' + razorpay_payment_id;
    
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(body_signature)
      .digest('hex');

    const isValidSignature = crypto.timingSafeEqual(
      Buffer.from(razorpay_signature),
      Buffer.from(expectedSignature)
    );

    if (!isValidSignature) {
      console.error('❌ Invalid payment signature');
      return NextResponse.json(
        { error: 'Payment verification failed - invalid signature' },
        { status: 400 }
      );
    }

    console.log('✅ Payment signature verified successfully');

    // Get payment details from Razorpay
    let paymentDetails;
    try {
      paymentDetails = await razorpayService.getPayment(razorpay_payment_id);
      console.log('📊 Payment status:', paymentDetails.status);
    } catch (error) {
      console.error('❌ Failed to fetch payment details:', error);
      return NextResponse.json(
        { error: 'Failed to verify payment with Razorpay' },
        { status: 500 }
      );
    }

    // Check if payment is successful
    if (paymentDetails.status !== 'captured') {
      return NextResponse.json(
        { 
          error: 'Payment not successful',
          status: paymentDetails.status 
        },
        { status: 400 }
      );
    }

    // Calculate expiry date (30 days from now)
    const purchaseDate = new Date();
    const expiryDate = new Date(purchaseDate.getTime() + (30 * 24 * 60 * 60 * 1000));

    // Determine plan type from payment amount
    const paymentAmount = paymentDetails.amount / 100; // Convert from paise to rupees
    let planType = 'basic'; // Default
    
    switch (paymentAmount) {
      case 99:
        planType = 'basic';
        break;
      case 299:
        planType = 'resume-fix';
        break;
      case 599:
        planType = 'professional';
        break;
      case 999:
        planType = 'premium';
        break;
      default:
        if (paymentAmount >= 500) planType = 'premium';
        else if (paymentAmount >= 200) planType = 'professional';
        else planType = 'basic';
    }

    // Update user to premium status
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        isPremium: true,
        proPlanType: planType, // Set specific plan type
        planDetails: {
          type: planType,
          purchaseType: 'onetime'
        },
        purchaseDate: purchaseDate,
        expiryDate: expiryDate,
        paymentDetails: {
          razorpay_payment_id,
          razorpay_order_id,
          amount: paymentDetails.amount,
          currency: paymentDetails.currency,
          method: paymentDetails.method,
          status: paymentDetails.status,
          created_at: new Date(paymentDetails.created_at * 1000)
        },
        updatedAt: new Date()
      },
      { new: true }
    );

    console.log('✅ User upgraded to one-time Pro:', user.email);
    console.log('📅 Pro access expires on:', expiryDate.toISOString());

    // Update user plan in Brevo
    try {
      let brevoPlanType = PLAN_TYPES.PREMIUM; // Default
      
      // Map plan type to Brevo plan type
      switch (planType) {
        case 'basic':
          brevoPlanType = PLAN_TYPES.BASIC;
          break;
        case 'resume-fix':
          brevoPlanType = PLAN_TYPES.RESUME_ATS_FIX;
          break;
        case 'professional':
          brevoPlanType = PLAN_TYPES.PROFESSIONAL;
          break;
        case 'premium':
          brevoPlanType = PLAN_TYPES.PREMIUM;
          break;
        default:
          brevoPlanType = PLAN_TYPES.BASIC;
      }
      
      const brevoResult = await updateBrevoContact(user.email, brevoPlanType, {
        additionalAttributes: {
          LAST_PAYMENT_DATE: new Date().toISOString(),
          PAYMENT_AMOUNT: paymentAmount.toString(),
          PAYMENT_METHOD: 'razorpay',
          PAYMENT_TYPE: 'onetime',
          RAZORPAY_PAYMENT_ID: razorpay_payment_id,
          RAZORPAY_ORDER_ID: razorpay_order_id,
          PURCHASE_DATE: purchaseDate.toISOString(),
          EXPIRY_DATE: expiryDate.toISOString(),
          USER_ID: user._id.toString(),
          IS_PREMIUM: 'true',
          PRO_PLAN_TYPE: planType
        }
      });
      
      if (brevoResult.success) {
        console.log(`💳 Payment success: Updated Brevo contact ${user.email} to ${brevoPlanType}`);
      } else {
        console.error(`❌ Brevo update failed for ${user.email}:`, brevoResult.error);
      }
    } catch (brevoError) {
      console.error(`❌ Brevo integration error for ${user.email}:`, brevoError);
      // Don't fail the payment process, just log the error
    }

    // Note: Plan expiry will be handled by the cron job that runs daily
    // checking /api/check-expiry endpoint
    console.log('📝 Plan expiry will be handled by scheduled job on:', expiryDate.toISOString());

    return NextResponse.json({
      success: true,
      message: 'Payment verified and user upgraded successfully',
      user: {
        id: updatedUser._id,
        email: updatedUser.email,
        name: updatedUser.name,
        isPremium: updatedUser.isPremium,
        proPlanType: updatedUser.proPlanType,
        purchaseDate: updatedUser.purchaseDate,
        expiryDate: updatedUser.expiryDate
      },
      payment: {
        id: razorpay_payment_id,
        order_id: razorpay_order_id,
        amount: paymentDetails.amount,
        currency: paymentDetails.currency,
        method: paymentDetails.method,
        status: paymentDetails.status
      }
    });

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
