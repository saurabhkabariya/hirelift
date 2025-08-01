/**
 * Debug Script: Test Subscription Payment API Directly
 * 
 * This script tests the subscription payment verification API endpoint directly
 * to see if the "authenticated" status issue is resolved.
 * 
 * Usage: Run this in browser console after getting payment details from Razorpay
 */

async function testSubscriptionPaymentAPI() {
  console.log('🧪 Testing Subscription Payment API Directly...\n');
  
  try {
    // First, get the current user to ensure we're authenticated
    const authResponse = await fetch('/api/auth/me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (!authResponse.ok) {
      console.error('❌ Authentication failed. Please login first.');
      return;
    }
    
    const authData = await authResponse.json();
    console.log('✅ User authenticated:', authData.user.email);
    
    // You need to replace these with actual payment details from a subscription payment
    const testPaymentData = {
      razorpay_payment_id: 'pay_PLACEHOLDER', // Replace with actual payment ID
      razorpay_subscription_id: 'sub_PLACEHOLDER', // Replace with actual subscription ID
      razorpay_signature: 'sig_PLACEHOLDER' // Replace with actual signature
    };
    
    console.log('⚠️  IMPORTANT: Replace the PLACEHOLDER values with actual payment details from Razorpay');
    console.log('📋 Test payment data:', testPaymentData);
    
    // Test the verification endpoint
    console.log('\n🔍 Testing /api/payment/verify endpoint...');
    
    const verifyResponse = await fetch('/api/payment/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(testPaymentData)
    });
    
    const verifyData = await verifyResponse.json();
    
    console.log('\n📊 API Response:');
    console.log('Status:', verifyResponse.status);
    console.log('Data:', verifyData);
    
    if (verifyResponse.ok) {
      console.log('\n✅ Payment verification successful!');
      console.log('👤 Updated user:', verifyData.user);
      console.log('📋 Subscription:', verifyData.subscription);
      
      // Verify user fields are set correctly
      const user = verifyData.user;
      console.log('\n🔍 User Field Verification:');
      console.log('isPremium:', user.isPremium ? '✅' : '❌');
      console.log('proPlanType:', user.proPlanType === 'subscription' ? '✅' : '❌');
      console.log('purchaseDate:', user.purchaseDate ? '✅' : '❌');
      console.log('expiryDate:', user.expiryDate ? '✅' : '❌');
      
    } else {
      console.log('\n❌ Payment verification failed');
      console.log('Error message:', verifyData.message || verifyData.error);
      
      if (verifyData.shouldRetry) {
        console.log('🔄 Should retry:', verifyData.shouldRetry);
        console.log('💡 This might be a timing issue with Razorpay');
      }
    }
    
  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

// Function to create mock subscription payment for testing
function createMockSubscriptionPayment() {
  console.log('🧪 Creating Mock Subscription Payment for Testing...\n');
  
  const mockPayment = {
    razorpay_payment_id: 'pay_test_' + Date.now(),
    razorpay_subscription_id: 'sub_test_' + Date.now(),
    razorpay_signature: 'mock_signature_' + Date.now()
  };
  
  console.log('📋 Mock payment data (for testing purposes only):');
  console.log(JSON.stringify(mockPayment, null, 2));
  
  console.log('\n⚠️  Note: This is mock data and will likely fail verification.');
  console.log('💡 Use actual Razorpay payment details for real testing.');
  
  return mockPayment;
}

// Function to test with user-provided payment details
async function testWithRealPaymentDetails(paymentDetails) {
  if (!paymentDetails || !paymentDetails.razorpay_payment_id || !paymentDetails.razorpay_subscription_id) {
    console.error('❌ Invalid payment details provided');
    console.log('💡 Required format: { razorpay_payment_id, razorpay_subscription_id, razorpay_signature }');
    return;
  }
  
  console.log('🧪 Testing with Real Payment Details...\n');
  
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('❌ No authentication token found');
      return;
    }
    
    const response = await fetch('/api/payment/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(paymentDetails)
    });
    
    const data = await response.json();
    
    console.log('📊 Response Status:', response.status);
    console.log('📊 Response Data:', data);
    
    if (response.ok) {
      console.log('✅ SUCCESS! Payment verified and user updated');
      
      // Check user status immediately
      const userResponse = await fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const userData = await userResponse.json();
      
      console.log('\n👤 Updated User Status:');
      console.log('isPremium:', userData.user.isPremium);
      console.log('proPlanType:', userData.user.proPlanType);
      console.log('purchaseDate:', userData.user.purchaseDate);
      console.log('expiryDate:', userData.user.expiryDate);
      
    } else {
      console.log('❌ FAILED! Payment verification failed');
      console.log('Error:', data.message || data.error);
    }
    
  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
}

// Make functions available globally
window.testSubscriptionPaymentAPI = testSubscriptionPaymentAPI;
window.createMockSubscriptionPayment = createMockSubscriptionPayment;
window.testWithRealPaymentDetails = testWithRealPaymentDetails;

console.log('🧪 Subscription Payment API Test loaded!');
console.log('💡 Available functions:');
console.log('  - testSubscriptionPaymentAPI() - Basic API test');
console.log('  - createMockSubscriptionPayment() - Create mock data');
console.log('  - testWithRealPaymentDetails(paymentObj) - Test with real Razorpay data');
console.log('\n🚀 To test with real payment details:');
console.log('  testWithRealPaymentDetails({');
console.log('    razorpay_payment_id: "pay_XXXXX",');
console.log('    razorpay_subscription_id: "sub_XXXXX",');
console.log('    razorpay_signature: "signature_XXXXX"');
console.log('  });');
