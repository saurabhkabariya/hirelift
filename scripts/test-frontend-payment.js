/**
 * Frontend Payment Integration Test
 * Test script to verify Razorpay payment integration in the browser
 * Run this in the browser console on the pricing page
 */

(function testPaymentIntegration() {
  console.log('🔍 Testing HireLift Payment Integration...');
  
  // Test 1: Check if Razorpay SDK is loaded
  console.log('\n1. Testing Razorpay SDK...');
  if (typeof window.Razorpay !== 'undefined') {
    console.log('✅ Razorpay SDK loaded successfully');
  } else {
    console.log('❌ Razorpay SDK not loaded');
    return;
  }
  
  // Test 2: Check environment variables
  console.log('\n2. Testing Environment Variables...');
  const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  if (razorpayKeyId) {
    console.log(`✅ Razorpay Key ID found: ${razorpayKeyId.substring(0, 10)}...`);
  } else {
    console.log('❌ NEXT_PUBLIC_RAZORPAY_KEY_ID not found');
  }
  
  // Test 3: Test API endpoints
  console.log('\n3. Testing API Endpoints...');
  
  // Test plans endpoint
  fetch('/api/plans')
    .then(response => response.json())
    .then(data => {
      if (data.success && data.plans) {
        console.log('✅ Plans API working:', data.plans.length, 'plans found');
        console.log('   Available plans:', data.plans.map(p => p.id).join(', '));
      } else {
        console.log('❌ Plans API error:', data);
      }
    })
    .catch(error => {
      console.log('❌ Plans API failed:', error.message);
    });
  
  // Test auth status
  const token = localStorage.getItem('token');
  if (token) {
    console.log('✅ User authentication token found');
    
    // Test subscription endpoint (requires auth)
    fetch('/api/subscribe', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => response.json())
    .then(data => {
      if (response.ok) {
        console.log('✅ Subscription API accessible');
      } else {
        console.log('ℹ️ Subscription API response:', data.error);
      }
    })
    .catch(error => {
      console.log('❌ Subscription API failed:', error.message);
    });
  } else {
    console.log('ℹ️ No authentication token (user not logged in)');
  }
  
  // Test 4: Payment service functionality
  console.log('\n4. Testing Payment Service...');
  try {
    // This will fail without proper user auth, but tests if the service loads
    const paymentService = window.paymentService;
    if (paymentService) {
      console.log('✅ Payment service accessible');
      console.log('   Razorpay loaded check:', paymentService.isRazorpayLoaded());
    } else {
      console.log('❌ Payment service not accessible');
    }
  } catch (error) {
    console.log('❌ Payment service error:', error.message);
  }
  
  console.log('\n🎯 Test Summary:');
  console.log('- Razorpay SDK: Check browser console for status');
  console.log('- Environment: Check for NEXT_PUBLIC_RAZORPAY_KEY_ID');
  console.log('- APIs: Check network tab for /api/plans and /api/subscribe');
  console.log('- Auth: Login to test full payment flow');
  
  console.log('\n💡 To test payment flow:');
  console.log('1. Login to the application');
  console.log('2. Go to pricing page (/pricing)');
  console.log('3. Click "Upgrade to Pro" button');
  console.log('4. Check for Razorpay checkout modal');
  
})();

// Make payment service globally accessible for testing
if (typeof window !== 'undefined') {
  import('../lib/payment.js').then(module => {
    window.paymentService = module.default;
  });
}
