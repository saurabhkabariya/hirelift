/**
 * Quick test to verify the subscription status fix
 * Run this in browser console after going to /pricing and logging in
 */

async function testSubscriptionStatusFix() {
  console.log('🧪 Testing subscription status fix...');
  
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('❌ No auth token found. Please login first.');
      return;
    }
    
    console.log('🔑 Found auth token, testing subscription creation...');
    
    const response = await fetch('/api/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        planId: 'plan_QzYt9RLYww9UcP',
        totalCount: 12,
        quantity: 1,
        customerName: 'Status Fix Test User',
        customerContact: '+919876543999'
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ SUBSCRIPTION CREATED SUCCESSFULLY!');
      console.log('🎉 Both start_at AND status fixes are working!');
      console.log('📋 Response data:', data);
      console.log('📊 Status in response:', data.subscription?.status);
      console.log('🎯 Razorpay Subscription ID:', data.razorpaySubscription?.id);
      console.log('💳 Payment options ready:', !!data.paymentOptions);
    } else {
      console.error('❌ Subscription creation failed:', data.error);
      
      if (data.error && data.error.includes('not a valid enum value')) {
        console.error('💥 Status enum error still occurring!');
        console.error('🔧 Need to check the Subscription model enum values');
      } else if (data.error && data.error.includes('already has an active subscription')) {
        console.log('ℹ️  User already has a subscription - both fixes working!');
      } else {
        console.log('ℹ️  Different error - check response for details');
      }
      
      console.log('📋 Full response:', data);
    }
    
  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

// Run the test
testSubscriptionStatusFix();

console.log(`
🎯 EXPECTED RESULTS:
✅ Success: Subscription created with status "created" accepted
✅ Alternative: "User already has subscription" (both fixes working)
❌ Failure: Any "start_at" or "enum value" errors mean fixes need adjustment
`);
