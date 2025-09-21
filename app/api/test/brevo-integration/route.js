import { NextResponse } from 'next/server';
import { updateBrevoContact, PLAN_TYPES } from '@/lib/brevoService';

/**
 * POST /api/test/brevo-integration
 * Comprehensive test of Brevo integration
 */
export async function POST(request) {
  try {
    const { testEmail = 'test@hirelift.com' } = await request.json();
    
    const testResults = [];
    let allTestsPassed = true;
    
    // Test 1: Create new user with free plan
    try {
      const test1 = await updateBrevoContact(testEmail, PLAN_TYPES.FREE, {
        firstName: 'Test',
        lastName: 'User',
        additionalAttributes: {
          SOURCE: 'integration_test',
          TEST_STEP: 'signup',
          TEST_DATE: new Date().toISOString()
        }
      });
      
      testResults.push({
        test: 'User Signup (Free Plan)',
        success: test1.success,
        action: test1.action,
        result: test1.success ? 'Contact created/updated with free plan' : test1.error
      });
      
      if (!test1.success) allTestsPassed = false;
    } catch (error) {
      testResults.push({
        test: 'User Signup (Free Plan)',
        success: false,
        error: error.message
      });
      allTestsPassed = false;
    }
    
    // Small delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Test 2: Upgrade to Basic plan (₹99)
    try {
      const test2 = await updateBrevoContact(testEmail, PLAN_TYPES.BASIC, {
        additionalAttributes: {
          PAYMENT_AMOUNT: '99',
          PAYMENT_DATE: new Date().toISOString(),
          TEST_STEP: 'basic_upgrade'
        }
      });
      
      testResults.push({
        test: 'Payment Success (Basic Plan)',
        success: test2.success,
        action: test2.action,
        result: test2.success ? 'Contact updated to basic plan' : test2.error
      });
      
      if (!test2.success) allTestsPassed = false;
    } catch (error) {
      testResults.push({
        test: 'Payment Success (Basic Plan)',
        success: false,
        error: error.message
      });
      allTestsPassed = false;
    }
    
    // Small delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Test 3: Upgrade to Premium plan (₹999)
    try {
      const test3 = await updateBrevoContact(testEmail, PLAN_TYPES.PREMIUM, {
        additionalAttributes: {
          PAYMENT_AMOUNT: '999',
          PAYMENT_DATE: new Date().toISOString(),
          TEST_STEP: 'premium_upgrade'
        }
      });
      
      testResults.push({
        test: 'Payment Success (Premium Plan)',
        success: test3.success,
        action: test3.action,
        result: test3.success ? 'Contact updated to premium plan' : test3.error
      });
      
      if (!test3.success) allTestsPassed = false;
    } catch (error) {
      testResults.push({
        test: 'Payment Success (Premium Plan)',
        success: false,
        error: error.message
      });
      allTestsPassed = false;
    }
    
    // Small delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Test 4: Downgrade back to free (expiration simulation)
    try {
      const test4 = await updateBrevoContact(testEmail, PLAN_TYPES.FREE, {
        additionalAttributes: {
          DOWNGRADE_DATE: new Date().toISOString(),
          DOWNGRADE_REASON: 'subscription_expired',
          PREVIOUS_PLAN: 'premium',
          TEST_STEP: 'expiration_downgrade'
        }
      });
      
      testResults.push({
        test: 'Plan Expiration (Downgrade to Free)',
        success: test4.success,
        action: test4.action,
        result: test4.success ? 'Contact downgraded to free plan' : test4.error
      });
      
      if (!test4.success) allTestsPassed = false;
    } catch (error) {
      testResults.push({
        test: 'Plan Expiration (Downgrade to Free)',
        success: false,
        error: error.message
      });
      allTestsPassed = false;
    }
    
    // Test 5: Professional plan (₹599)
    try {
      const test5 = await updateBrevoContact(testEmail, PLAN_TYPES.PROFESSIONAL, {
        additionalAttributes: {
          PAYMENT_AMOUNT: '599',
          PAYMENT_DATE: new Date().toISOString(),
          TEST_STEP: 'professional_upgrade'
        }
      });
      
      testResults.push({
        test: 'Payment Success (Professional Plan)',
        success: test5.success,
        action: test5.action,
        result: test5.success ? 'Contact updated to professional plan' : test5.error
      });
      
      if (!test5.success) allTestsPassed = false;
    } catch (error) {
      testResults.push({
        test: 'Payment Success (Professional Plan)',
        success: false,
        error: error.message
      });
      allTestsPassed = false;
    }
    
    // Final test summary
    const summary = {
      totalTests: testResults.length,
      passedTests: testResults.filter(t => t.success).length,
      failedTests: testResults.filter(t => !t.success).length,
      allTestsPassed,
      testEmail,
      timestamp: new Date().toISOString()
    };
    
    return NextResponse.json({
      success: allTestsPassed,
      message: allTestsPassed ? 'All Brevo integration tests passed!' : 'Some tests failed',
      summary,
      testResults,
      instructions: {
        message: 'Check your Brevo dashboard to see the contact with different plan types',
        brevoListName: 'HireLift Users',
        contactEmail: testEmail,
        customAttribute: 'PLAN_TYPE'
      }
    });
    
  } catch (error) {
    console.error('❌ Integration test error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message,
        message: 'Integration test failed'
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/test/brevo-integration
 * Get test instructions
 */
export async function GET() {
  return NextResponse.json({
    message: 'Brevo Integration Test Endpoint',
    instructions: {
      method: 'POST',
      body: {
        testEmail: 'your-test-email@example.com (optional)'
      },
      description: 'This endpoint will test the complete Brevo integration workflow including signup, payments, and downgrades'
    },
    testFlow: [
      '1. Create user with free plan',
      '2. Upgrade to basic plan (₹99)',
      '3. Upgrade to premium plan (₹999)',
      '4. Simulate expiration (downgrade to free)',
      '5. Upgrade to professional plan (₹599)'
    ],
    environment: {
      brevoConfigured: !!process.env.BREVO_API_KEY,
      nodeEnv: process.env.NODE_ENV
    }
  });
}