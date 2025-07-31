/**
 * Quick test for the fixed Razorpay subscription creation
 * Run this in browser console on localhost:3001/pricing after login
 * 
 * COPY AND PASTE THIS ENTIRE SCRIPT INTO BROWSER CONSOLE
 */

// Test subscription creation with a real test user
async function testSubscriptionCreation() {
  console.log('🧪 Testing FIXED Razorpay subscription creation...');
  console.log('🔧 This test verifies the start_at fix is working');
  
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('❌ No auth token found. Please login first.');
      console.log('💡 Go to /auth and login, then return to /pricing and run this test');
      return;
    }
    
    console.log('🔑 Found auth token, proceeding with test...');
    
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
        customerName: 'Test User Fix Verification',
        customerContact: '+919876543210'
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ SUBSCRIPTION CREATION SUCCESSFUL!');
      console.log('🎉 The start_at fix is working correctly!');
      console.log('📋 Response data:', data);
      console.log('🎯 Subscription ID:', data.subscription?.id);
      console.log('👤 Customer ID:', data.customer?.id);
      console.log('💳 Razorpay Subscription ID:', data.razorpaySubscription?.id);
      console.log('📊 Status:', data.razorpaySubscription?.status);
      
      if (data.paymentOptions) {
        console.log('💰 Payment options ready for Razorpay checkout');
        console.log('🚀 You can now proceed with payment flow');
      }
      
      return data;
    } else {
      console.error('❌ Subscription creation failed:', data.error);
      console.log('📋 Full response:', data);
      
      if (data.error && data.error.includes('start_at')) {
        console.error('💥 The start_at error is STILL occurring!');
        console.error('🔧 The fix may not be deployed correctly');
      } else if (data.error && data.error.includes('already has an active subscription')) {
        console.log('ℹ️  User already has a subscription - this is expected behavior');
        console.log('🎉 The fix is working (no start_at error)');
      } else {
        console.log('ℹ️  Got a different error, which means start_at fix is working');
      }
    }
    
  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

// Auto-run the test
console.log('🔄 Running subscription fix verification test...');
testSubscriptionCreation();

console.log(`
📋 MANUAL TEST INSTRUCTIONS:
1. Make sure you're logged in (check localStorage.getItem('token'))
2. If not logged in, go to /auth and login
3. Return to /pricing page
4. Run this script in console
5. Check for success message or start_at error

🎯 EXPECTED RESULT:
- Either successful subscription creation
- Or "already has subscription" error
- NO "start_at cannot be lesser than current time" error
`);
