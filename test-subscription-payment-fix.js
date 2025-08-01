/**
 * Test Script: Subscription Payment User Fields Verification
 * 
 * This script tests if subscription payments properly set user fields:
 * - proPlanType: 'subscription'
 * - purchaseDate: Date
 * - expiryDate: Date
 * 
 * Run this in browser console after making a subscription payment.
 */

async function testSubscriptionUserFields() {
  console.log('🧪 Testing Subscription Payment User Fields...\n');
  
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
    
    console.log('📊 Current User Data:');
    console.log({
      email: user.email,
      isPremium: user.isPremium,
      proPlanType: user.proPlanType,
      purchaseDate: user.purchaseDate,
      expiryDate: user.expiryDate,
      paymentDetails: user.paymentDetails
    });
    
    console.log('\n🔍 Field Verification:');
    
    // Check if user is premium
    if (user.isPremium) {
      console.log('✅ isPremium: true');
    } else {
      console.log('❌ isPremium: false (user should be premium after payment)');
    }
    
    // Check proPlanType
    if (user.proPlanType === 'subscription') {
      console.log('✅ proPlanType: subscription');
    } else {
      console.log(`❌ proPlanType: ${user.proPlanType} (should be 'subscription')`);
    }
    
    // Check purchaseDate
    if (user.purchaseDate) {
      const purchaseDate = new Date(user.purchaseDate);
      console.log(`✅ purchaseDate: ${purchaseDate.toISOString()}`);
      
      // Check if purchase date is reasonable (within last hour)
      const now = new Date();
      const diffMinutes = (now - purchaseDate) / (1000 * 60);
      if (diffMinutes < 60) {
        console.log('✅ purchaseDate is recent (within last hour)');
      } else {
        console.log(`⚠️  purchaseDate is ${Math.round(diffMinutes)} minutes ago`);
      }
    } else {
      console.log('❌ purchaseDate: missing');
    }
    
    // Check expiryDate
    if (user.expiryDate) {
      const expiryDate = new Date(user.expiryDate);
      console.log(`✅ expiryDate: ${expiryDate.toISOString()}`);
      
      // Check if expiry date is in the future
      const now = new Date();
      if (expiryDate > now) {
        const daysUntilExpiry = (expiryDate - now) / (1000 * 60 * 60 * 24);
        console.log(`✅ expiryDate is in the future (${Math.round(daysUntilExpiry)} days from now)`);
      } else {
        console.log('❌ expiryDate is in the past');
      }
    } else {
      console.log('❌ expiryDate: missing');
    }
    
    // Check payment details
    if (user.paymentDetails) {
      console.log('✅ paymentDetails: present');
      
      if (user.paymentDetails.method === 'subscription') {
        console.log('✅ paymentDetails.method: subscription');
      } else {
        console.log(`❌ paymentDetails.method: ${user.paymentDetails.method} (should be 'subscription')`);
      }
      
      if (user.paymentDetails.razorpay_subscription_id) {
        console.log('✅ paymentDetails.razorpay_subscription_id: present');
      } else {
        console.log('❌ paymentDetails.razorpay_subscription_id: missing');
      }
    } else {
      console.log('❌ paymentDetails: missing');
    }
    
    console.log('\n📋 Summary:');
    const hasAllFields = user.isPremium && 
                        user.proPlanType === 'subscription' && 
                        user.purchaseDate && 
                        user.expiryDate && 
                        user.paymentDetails;
    
    if (hasAllFields) {
      console.log('✅ ALL SUBSCRIPTION FIELDS ARE CORRECTLY SET!');
      console.log('🎉 Subscription payment verification is working properly.');
    } else {
      console.log('❌ SOME SUBSCRIPTION FIELDS ARE MISSING OR INCORRECT!');
      console.log('🔧 Need to investigate subscription payment verification logic.');
    }
    
  } catch (error) {
    console.error('❌ Error testing subscription user fields:', error);
  }
}

// Auto-run the test
testSubscriptionUserFields();

// Also provide manual functions for specific tests
window.testSubscriptionFields = testSubscriptionUserFields;

console.log('🧪 Subscription payment user fields test loaded!');
console.log('💡 Use testSubscriptionFields() to run again manually.');
