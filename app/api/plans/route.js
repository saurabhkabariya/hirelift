import { NextResponse } from 'next/server';
import razorpayService from '@/lib/razorpay';

/**
 * GET /api/plans
 * Get available subscription plans from Razorpay
 */
export async function GET(request) {
  try {
    const planId = process.env.PLAN_ID;

    // If specific plan ID is requested
    if (planId) {
      try {
        const plan = await razorpayService.getPlan(planId);
        
        return NextResponse.json({
          success: true,
          plan: {
            id: plan.id,
            name: plan.item.name,
            description: plan.item.description,
            amount: plan.item.amount,
            currency: plan.item.currency,
            period: plan.period,
            interval: plan.interval,
            createdAt: new Date(plan.created_at * 1000)
          }
        });
      } catch (error) {
        return NextResponse.json(
          { error: 'Plan not found' },
          { status: 404 }
        );
      }
    }

    // For demo purposes, return predefined plans
    // In production, you might want to fetch all plans from Razorpay or maintain them in your database
    const predefinedPlans = [
      {
        id: 'plan_QzYt9RLYww9UcP',
        name: 'HireLift Pro',
        description: 'Perfect for individuals getting started',
        amount: 9900, // ₹99 in paise
        currency: 'INR',
        period: 'monthly',
        interval: 1,
        features: [
          'Unlimited Resume Audits per month',
          'Basic ATS optimization',
          'Email support',
          'Job matching alerts',
          'Company and HR details',
          'Custom Outreach templates'
        ]
      }
    ];

    return NextResponse.json({
      success: true,
      plans: predefinedPlans,
      message: 'Available subscription plans'
    });

  } catch (error) {
    console.error('❌ Plans API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch plans' },
      { status: 500 }
    );
  }
}

/**
 * Utility function to validate if a plan exists
 * This can be used by other API routes
 */
export async function validatePlan(planId) {
  try {
    const plan = await razorpayService.getPlan(planId);
    return {
      valid: true,
      plan: {
        id: plan.id,
        name: plan.item.name,
        amount: plan.item.amount,
        currency: plan.item.currency,
        period: plan.period,
        interval: plan.interval
      }
    };
  } catch (error) {
    return {
      valid: false,
      error: error.message
    };
  }
}
