import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth';
import razorpayService from '@/lib/razorpay';
import connectDB from '@/lib/mongodb';

/**
 * POST /api/create-order
 * Create a Razorpay order for one-time payment
 */
async function createOrderHandler(request) {
  try {
    await connectDB();
    
    const { user } = request.auth;
    const body = await request.json();
    
    const {
      amount, // amount in paisa (99 * 100 = 9900 paisa for ₹99)
      currency = 'INR',
      notes = {}
    } = body;

    // Validation
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Valid amount is required' },
        { status: 400 }
      );
    }

    // Check if user already has an active plan
    if (user.isPremium && user.expiryDate) {
      const expiryDate = new Date(user.expiryDate);
      
      if (new Date() < expiryDate) {
        // User has active paid plan, check what they're trying to buy
        const currentPlanType = user.planDetails?.type || user.proPlanType;
        const requestedPlan = notes.planType || 'basic'; // Get plan type from request
        
        // Allow upgrading to higher tier plans or different services
        const planHierarchy = {
          'basic': 1,
          'resume-fix': 2,
          'professional': 3,
          'premium': 4
        };
        
        const currentPlanLevel = planHierarchy[currentPlanType] || 0;
        const requestedPlanLevel = planHierarchy[requestedPlan] || 0;
        
        // Block if trying to buy same or lower tier plan
        if (currentPlanType === requestedPlan) {
          return NextResponse.json(
            { 
              error: `You already have an active ${currentPlanType} plan`,
              expiryDate: expiryDate.toISOString(),
              currentPlan: currentPlanType
            },
            { status: 409 }
          );
        }
        
        // Allow different service types (e.g., basic -> resume-fix is allowed)
        // Only block exact same plan repurchases
      }
    }    console.log('🚀 Creating one-time payment order for user:', user.email);

    // Generate unique receipt ID (max 40 characters for Razorpay)
    const timestamp = Date.now().toString().slice(-8); // Last 8 digits
    const userIdShort = user._id.toString().slice(-8); // Last 8 chars of user ID
    const receiptId = `ot_${userIdShort}_${timestamp}`; // Format: ot_12345678_12345678

    // Create Razorpay order
    const orderData = {
      amount: parseInt(amount), // amount in paisa
      currency: currency,
      receipt: receiptId,
      notes: {
        user_id: user._id.toString(),
        user_email: user.email,
        payment_type: 'onetime',
        plan_name: 'HireLift Pro One-Time',
        ...notes
      }
    };

    const order = await razorpayService.createOrder(orderData);

    console.log('✅ Razorpay order created:', order.id);

    // Return order details to frontend
    return NextResponse.json({
      success: true,
      message: 'Order created successfully',
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
    }, { status: 201 });

  } catch (error) {
    console.error('❌ Order creation error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to create order',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

export const POST = withAuth(createOrderHandler);
