// Browser test script for subscription payment flow
// Run this in browser console after initiating a subscription payment

async function testSubscriptionPaymentFlow() {
  console.log('🧪 Testing Subscription Payment Flow');
  console.log('=====================================');

  try {
    // Check if user is logged in
    const authResponse = await fetch('/api/auth/me');
    if (!authResponse.ok) {
      console.error('❌ User not authenticated');
      return;
    }
    
    const authData = await authResponse.json();
    console.log('✅ User authenticated:', authData.user.email);

    // Test payment verification endpoint
    console.log('\n🔍 Testing payment verification...');
    
    // Note: You'll need to replace these with actual payment IDs from Razorpay
    const testPaymentData = {
      razorpay_payment_id: 'pay_XXXXXXXXXX', // Replace with actual payment ID
      razorpay_subscription_id: 'sub_XXXXXXXXXX', // Replace with actual subscription ID
      razorpay_signature: 'signature_XXXXXXXXXX' // Replace with actual signature
    };

    console.log('⚠️  Note: Replace payment IDs with actual values from successful payment');
    console.log('Payment data structure:', testPaymentData);

    // After a successful payment, verify user fields are set correctly
    const checkUserFields = async () => {
      const userResponse = await fetch('/api/auth/me');
      const userData = await userResponse.json();
      
      console.log('\n📊 User Data After Payment:');
      console.log('============================');
      console.log('Email:', userData.user.email);
      console.log('Premium Status:', userData.user.isPremium);
      console.log('Plan Type:', userData.user.proPlanType);
      console.log('Purchase Date:', userData.user.purchaseDate);
      console.log('Expiry Date:', userData.user.expiryDate);
      
      // Validate subscription user fields
      const validationResults = {
        isPremium: userData.user.isPremium === true,
        proPlanType: userData.user.proPlanType === 'subscription',
        purchaseDate: userData.user.purchaseDate !== null,
        expiryDate: userData.user.expiryDate === null // Should be null for subscriptions
      };
      
      console.log('\n✅ Field Validation Results:');
      console.log('=============================');
      Object.entries(validationResults).forEach(([field, isValid]) => {
        console.log(`${isValid ? '✅' : '❌'} ${field}: ${isValid ? 'VALID' : 'INVALID'}`);
      });
      
      const allValid = Object.values(validationResults).every(v => v === true);
      console.log(`\n${allValid ? '✅' : '❌'} Overall Validation: ${allValid ? 'PASSED' : 'FAILED'}`);
      
      return allValid;
    };

    // Instructions for manual testing
    console.log('\n📋 Manual Testing Instructions:');
    console.log('===============================');
    console.log('1. Go to the pricing page');
    console.log('2. Select subscription plan');
    console.log('3. Complete payment with Razorpay');
    console.log('4. After payment success, run: checkUserFields()');
    console.log('5. Verify all fields are properly set');

    // Make checkUserFields available globally for manual testing
    window.checkUserFields = checkUserFields;
    
    console.log('\n✅ Test functions loaded. Use checkUserFields() after payment completion.');

  } catch (error) {
    console.error('❌ Test setup failed:', error);
  }
}

// Auto-run the test setup
testSubscriptionPaymentFlow();
