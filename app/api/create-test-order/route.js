import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth';
import razorpayService from '@/lib/razorpay';
import connectDB from '@/lib/mongodb';

/**
 * POST /api/create-test-order
 * Create a Razorpay test order for admin testing - bypasses existing pro access checks
 * Only accessible by admin email: websiteads074@gmail.com
 */
async function createTestOrderHandler(request) {
  try {
    await connectDB();
    
    const { user } = request.auth;
    const body = await request.json();
    
    // Restrict access to admin only
    if (user.email !== 'websiteads074@gmail.com') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }
    
    const {
      amount = 100, // Default 1 rupee in paisa
      currency = 'INR',
      description = 'Test Payment - Admin Only'
    } = body;

    // Basic validation
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Valid amount is required' },
        { status: 400 }
      );
    }

    console.log('🧪 Creating test payment order for admin:', user.email);

    // Generate unique test receipt ID
    const timestamp = Date.now().toString().slice(-8);
    const receiptId = `test_${timestamp}_admin`;

    // Create Razorpay test order
    const orderData = {
      amount: parseInt(amount), // amount in paisa
      currency: currency,
      receipt: receiptId,
      notes: {
        user_id: user._id.toString(),
        user_email: user.email,
        payment_type: 'test',
        plan_name: 'Test Payment',
        description: description,
        admin_test: true
      }
    };

    const order = await razorpayService.createOrder(orderData);

    console.log('✅ Test Razorpay order created:', order.id);

    // Return order details to frontend
    return NextResponse.json({
      success: true,
      message: 'Test order created successfully',
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt
      },
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });

  } catch (error) {
    console.error('❌ Test order creation error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to create test order',
        details: error.message
      },
      { status: 500 }
    );
  }
}

export const POST = withAuth(createTestOrderHandler);