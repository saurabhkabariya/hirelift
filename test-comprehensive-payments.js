/**
 * Comprehensive Payment Test Script
 * 
 * This script tests both one-time and subscription payment user field handling
 * to ensure all payment types correctly set user data.
 * 
 * Run this in browser console after making payments.
 */

async function comprehensivePaymentTest() {
  console.log('🧪 COMPREHENSIVE PAYMENT TEST\n');
  
  try {
    // Get current user data
    const response = await fetch('/api/auth/me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    const user = data.user;
    
    console.log('📊 CURRENT USER DATA:');
    console.log('==================');
    console.log(JSON.stringify({
      email: user.email,
      name: user.name,
      isPremium: user.isPremium,
      emailVerified: user.emailVerified,
      proPlanType: user.proPlanType,
      purchaseDate: user.purchaseDate,
      expiryDate: user.expiryDate,
      paymentDetails: user.paymentDetails,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }, null, 2));
    
    console.log('\n🔍 VALIDATION CHECKS:');
    console.log('====================');
    
    // Basic user validation
    console.log('\n1️⃣ Basic User Validation:');
    console.log(user.email ? '✅ Email: present' : '❌ Email: missing');
    console.log(user.name ? '✅ Name: present' : '❌ Name: missing');
    console.log(user.emailVerified ? '✅ Email verified: true' : '⚠️  Email verified: false');
    
    // Premium status validation
    console.log('\n2️⃣ Premium Status Validation:');
    if (user.isPremium) {
      console.log('✅ isPremium: true');
      
      // Check required fields for premium users
      console.log('\n3️⃣ Premium User Required Fields:');
      
      if (user.proPlanType) {
        console.log(`✅ proPlanType: ${user.proPlanType}`);
        
        // Validate proPlanType values
        if (['onetime', 'subscription'].includes(user.proPlanType)) {
          console.log('✅ proPlanType value is valid');
        } else {
          console.log(`❌ proPlanType value '${user.proPlanType}' is invalid`);
        }
      } else {
        console.log('❌ proPlanType: missing');
      }
      
      if (user.purchaseDate) {
        const purchaseDate = new Date(user.purchaseDate);
        console.log(`✅ purchaseDate: ${purchaseDate.toISOString()}`);
        
        // Check if purchase date is reasonable
        const now = new Date();
        const diffHours = (now - purchaseDate) / (1000 * 60 * 60);
        if (diffHours < 24) {
          console.log(`✅ purchaseDate is recent (${Math.round(diffHours)} hours ago)`);
        } else {
          console.log(`⚠️  purchaseDate is ${Math.round(diffHours)} hours ago`);
        }
      } else {
        console.log('❌ purchaseDate: missing');
      }
      
      if (user.expiryDate) {
        const expiryDate = new Date(user.expiryDate);
        console.log(`✅ expiryDate: ${expiryDate.toISOString()}`);
        
        // Check if expiry date is in the future
        const now = new Date();
        if (expiryDate > now) {
          const daysUntilExpiry = (expiryDate - now) / (1000 * 60 * 60 * 24);
          console.log(`✅ expiryDate is in the future (${Math.round(daysUntilExpiry)} days from now)`);
        } else {
          console.log('❌ expiryDate is in the past (user should not be premium)');
        }
      } else {
        console.log('❌ expiryDate: missing');
      }
      
      // Payment details validation
      console.log('\n4️⃣ Payment Details Validation:');
      if (user.paymentDetails) {
        console.log('✅ paymentDetails: present');
        
        const pd = user.paymentDetails;
        console.log(`Method: ${pd.method || 'missing'}`);
        console.log(`Status: ${pd.status || 'missing'}`);
        console.log(`Currency: ${pd.currency || 'missing'}`);
        
        if (user.proPlanType === 'onetime') {
          console.log('\n📝 One-time Payment Validation:');
          console.log(pd.razorpay_payment_id ? '✅ razorpay_payment_id: present' : '❌ razorpay_payment_id: missing');
          console.log(pd.razorpay_order_id ? '✅ razorpay_order_id: present' : '❌ razorpay_order_id: missing');
          console.log(pd.amount ? `✅ amount: ${pd.amount}` : '❌ amount: missing');
          console.log(pd.method === 'onetime' ? '✅ method: onetime' : `❌ method: ${pd.method} (should be 'onetime')`);
        } else if (user.proPlanType === 'subscription') {
          console.log('\n📝 Subscription Payment Validation:');
          console.log(pd.razorpay_subscription_id ? '✅ razorpay_subscription_id: present' : '❌ razorpay_subscription_id: missing');
          console.log(pd.method === 'subscription' ? '✅ method: subscription' : `❌ method: ${pd.method} (should be 'subscription')`);
          if (pd.razorpay_payment_id) {
            console.log('✅ razorpay_payment_id: present (payment processed)');
          } else {
            console.log('⚠️  razorpay_payment_id: missing (may be pending)');
          }
        }
      } else {
        console.log('❌ paymentDetails: missing');
      }
      
    } else {
      console.log('⚠️  isPremium: false');
      console.log('💡 User is not premium - check if payment was successful');
    }
    
    // Final assessment
    console.log('\n📋 FINAL ASSESSMENT:');
    console.log('===================');
    
    if (user.isPremium) {
      const hasRequiredFields = user.proPlanType && user.purchaseDate && user.expiryDate && user.paymentDetails;
      const hasValidPlanType = ['onetime', 'subscription'].includes(user.proPlanType);
      const hasValidExpiry = user.expiryDate && new Date(user.expiryDate) > new Date();
      
      if (hasRequiredFields && hasValidPlanType && hasValidExpiry) {
        console.log('🎉 ALL PAYMENT FIELDS ARE CORRECTLY SET!');
        console.log(`✅ Payment Type: ${user.proPlanType}`);
        console.log('✅ All required fields present and valid');
        console.log('✅ Payment integration working properly');
      } else {
        console.log('❌ PAYMENT FIELDS HAVE ISSUES!');
        if (!hasRequiredFields) console.log('🔧 Missing required fields');
        if (!hasValidPlanType) console.log('🔧 Invalid proPlanType');
        if (!hasValidExpiry) console.log('🔧 Invalid or expired expiryDate');
      }
    } else {
      console.log('⚠️  User is not premium');
      console.log('💡 If payment was made, check payment verification logic');
    }
    
  } catch (error) {
    console.error('❌ Error in comprehensive payment test:', error);
  }
}

// Test functions for specific payment types
async function testOneTimePayment() {
  console.log('🧪 Testing One-time Payment Fields...\n');
  const user = await getCurrentUser();
  
  if (user.proPlanType === 'onetime') {
    console.log('✅ One-time payment detected');
    // Add specific one-time validation
  } else {
    console.log('⚠️  User does not have one-time payment');
  }
}

async function testSubscriptionPayment() {
  console.log('🧪 Testing Subscription Payment Fields...\n');
  const user = await getCurrentUser();
  
  if (user.proPlanType === 'subscription') {
    console.log('✅ Subscription payment detected');
    // Add specific subscription validation
  } else {
    console.log('⚠️  User does not have subscription payment');
  }
}

async function getCurrentUser() {
  const response = await fetch('/api/auth/me');
  const data = await response.json();
  return data.user;
}

// Auto-run comprehensive test
comprehensivePaymentTest();

// Make functions available globally
window.comprehensivePaymentTest = comprehensivePaymentTest;
window.testOneTimePayment = testOneTimePayment;
window.testSubscriptionPayment = testSubscriptionPayment;

console.log('\n🧪 Comprehensive payment test loaded!');
console.log('💡 Available functions:');
console.log('  - comprehensivePaymentTest()');
console.log('  - testOneTimePayment()');
console.log('  - testSubscriptionPayment()');
