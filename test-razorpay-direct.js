/**
 * Node.js test for Razorpay subscription creation fix
 */

// Load environment variables
import { config } from 'dotenv';
config({ path: '.env.local' });

import razorpayService from './lib/razorpay.js';

async function testSubscriptionCreation() {
  try {
    console.log('🔧 Testing Razorpay subscription creation fix...');
    
    // Test plan ID from environment
    const planId = process.env.PLAN_ID || 'plan_QzYt9RLYww9UcP';
    console.log('📋 Using plan ID:', planId);
    
    // First, let's get the plan to make sure it exists
    console.log('📋 Getting plan details...');
    const plan = await razorpayService.getPlan(planId);
    console.log('✅ Plan found:', plan.item.name, '- Amount:', plan.item.amount / 100, plan.item.currency);
    
    // Create a test customer
    console.log('👤 Creating test customer...');
    const testEmail = 'test-subscription-fix@hirelift.com';
    const customer = await razorpayService.getOrCreateCustomer(testEmail, {
      name: 'Test User for Subscription Fix',
      contact: '+919999999999'
    });
    console.log('✅ Customer created/found:', customer.id);
    
    // Test subscription creation WITHOUT startAt (should work now)
    console.log('🚀 Creating subscription without startAt...');
    const subscription = await razorpayService.createSubscription({
      planId: planId,
      customerId: customer.id,
      totalCount: 12,
      quantity: 1,
      // No startAt - should start immediately
      notes: {
        test: 'subscription-fix-test',
        created_at: new Date().toISOString()
      }
    });
    
    console.log('✅ Subscription created successfully!');
    console.log('📄 Subscription details:');
    console.log('   ID:', subscription.id);
    console.log('   Status:', subscription.status);
    console.log('   Plan:', subscription.plan_id);
    console.log('   Customer:', subscription.customer_id);
    console.log('   Total Count:', subscription.total_count);
    console.log('   Paid Count:', subscription.paid_count);
    console.log('   Remaining Count:', subscription.remain_count);
    
    console.log('\n🎉 Test passed! The subscription fix is working correctly.');
    
    return subscription;
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Full error:', error);
    throw error;
  }
}

// Run the test
testSubscriptionCreation()
  .then(() => {
    console.log('\n✅ Test completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Test failed with error:', error);
    process.exit(1);
  });
