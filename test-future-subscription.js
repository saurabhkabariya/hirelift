/**
 * Test future subscription creation
 */

// Load environment variables
import { config } from 'dotenv';
config({ path: '.env.local' });

import razorpayService from './lib/razorpay.js';

async function testFutureSubscription() {
  try {
    console.log('🔧 Testing future subscription creation...');
    
    const planId = process.env.PLAN_ID || 'plan_QzYt9RLYww9UcP';
    const testEmail = 'test-future-subscription@hirelift.com';
    
    // Create customer
    const customer = await razorpayService.getOrCreateCustomer(testEmail, {
      name: 'Future Test User',
      contact: '+919999999998'
    });
    console.log('✅ Customer:', customer.id);
    
    // Create future date (7 days from now)
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);
    
    console.log('📅 Scheduling subscription for:', futureDate.toISOString());
    
    // Create subscription with future start date
    const subscription = await razorpayService.createSubscription({
      planId: planId,
      customerId: customer.id,
      totalCount: 6,
      quantity: 1,
      startAt: futureDate,
      notes: {
        test: 'future-subscription-test',
        scheduled_for: futureDate.toISOString()
      }
    });
    
    console.log('✅ Future subscription created successfully!');
    console.log('📄 Subscription details:');
    console.log('   ID:', subscription.id);
    console.log('   Status:', subscription.status);
    console.log('   Start At:', new Date(subscription.start_at * 1000).toISOString());
    
    return subscription;
    
  } catch (error) {
    console.error('❌ Future subscription test failed:', error.message);
    throw error;
  }
}

testFutureSubscription()
  .then(() => {
    console.log('\n✅ Future subscription test completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Future subscription test failed:', error);
    process.exit(1);
  });
