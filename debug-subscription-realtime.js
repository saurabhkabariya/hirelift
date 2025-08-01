/**
 * Real-time Subscription Payment Debug Script
 * 
 * This script helps debug subscription payment verification issues
 * by providing step-by-step testing and detailed logging.
 */

// Enhanced debugging functions
window.subscriptionDebug = {
  // Test authentication status
  async checkAuth() {
    console.log('🔐 Checking authentication status...');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('❌ No authentication token found');
        return false;
      }
      
      const response = await fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) {
        console.error('❌ Authentication failed:', response.status);
        return false;
      }
      
      const data = await response.json();
      console.log('✅ User authenticated:', data.user.email);
      console.log('👤 User status:', {
        isPremium: data.user.isPremium,
        proPlanType: data.user.proPlanType,
        purchaseDate: data.user.purchaseDate,
        expiryDate: data.user.expiryDate
      });
      
      return data.user;
    } catch (error) {
      console.error('❌ Auth check error:', error);
      return false;
    }
  },
  
  // Test subscription payment verification with real data
  async testVerification(paymentData) {
    if (!paymentData) {
      console.error('❌ Payment data required');
      console.log('💡 Usage: subscriptionDebug.testVerification({');
      console.log('  razorpay_payment_id: "pay_XXXXX",');
      console.log('  razorpay_subscription_id: "sub_XXXXX",');
      console.log('  razorpay_signature: "signature_XXXXX"');
      console.log('});');
      return;
    }
    
    console.log('🧪 Testing subscription payment verification...');
    console.log('📋 Payment data:', paymentData);
    
    try {
      const token = localStorage.getItem('token');
      
      console.log('📤 Sending verification request...');
      const response = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(paymentData)
      });
      
      console.log('📊 Response status:', response.status);
      
      const responseData = await response.json();
      console.log('📊 Response data:', responseData);
      
      if (response.ok) {
        console.log('✅ VERIFICATION SUCCESSFUL!');
        console.log('👤 User data:', responseData.user);
        console.log('📋 Subscription data:', responseData.subscription);
        
        // Verify user fields
        const user = responseData.user;
        console.log('\n🔍 Field Verification:');
        console.log('isPremium:', user.isPremium ? '✅' : '❌');
        console.log('proPlanType:', user.proPlanType === 'subscription' ? '✅' : '❌');
        console.log('purchaseDate:', user.purchaseDate ? '✅' : '❌');
        console.log('expiryDate:', user.expiryDate ? '✅' : '❌');
        
        return responseData;
      } else {
        console.log('❌ VERIFICATION FAILED');
        console.log('Error:', responseData.message || responseData.error);
        
        if (responseData.shouldRetry) {
          console.log('🔄 Retry suggested:', responseData.shouldRetry);
          console.log('📊 Status:', responseData.status);
        }
        
        return responseData;
      }
    } catch (error) {
      console.error('❌ Verification test error:', error);
      return null;
    }
  },
  
  // Monitor user status changes
  async monitorUserStatus(intervalSeconds = 5) {
    console.log(`🔄 Monitoring user status every ${intervalSeconds} seconds...`);
    console.log('💡 Call subscriptionDebug.stopMonitoring() to stop');
    
    let previousStatus = await this.checkAuth();
    
    this.monitorInterval = setInterval(async () => {
      const currentStatus = await this.checkAuth();
      
      if (currentStatus && previousStatus) {
        // Check for changes
        const changes = [];
        if (currentStatus.isPremium !== previousStatus.isPremium) {
          changes.push(`isPremium: ${previousStatus.isPremium} → ${currentStatus.isPremium}`);
        }
        if (currentStatus.proPlanType !== previousStatus.proPlanType) {
          changes.push(`proPlanType: ${previousStatus.proPlanType} → ${currentStatus.proPlanType}`);
        }
        if (currentStatus.purchaseDate !== previousStatus.purchaseDate) {
          changes.push(`purchaseDate: ${previousStatus.purchaseDate} → ${currentStatus.purchaseDate}`);
        }
        if (currentStatus.expiryDate !== previousStatus.expiryDate) {
          changes.push(`expiryDate: ${previousStatus.expiryDate} → ${currentStatus.expiryDate}`);
        }
        
        if (changes.length > 0) {
          console.log('🔄 USER STATUS CHANGED:');
          changes.forEach(change => console.log('  ', change));
        }
        
        previousStatus = currentStatus;
      }
    }, intervalSeconds * 1000);
  },
  
  // Stop monitoring
  stopMonitoring() {
    if (this.monitorInterval) {
      clearInterval(this.monitorInterval);
      this.monitorInterval = null;
      console.log('⏹️ Stopped monitoring user status');
    }
  },
  
  // Simulate subscription payment flow
  async simulatePayment() {
    console.log('🎭 Simulating subscription payment flow...');
    console.log('⚠️  This is for debugging only - use real payment data');
    
    const mockData = {
      razorpay_payment_id: `pay_debug_${Date.now()}`,
      razorpay_subscription_id: `sub_debug_${Date.now()}`,
      razorpay_signature: `debug_signature_${Date.now()}`
    };
    
    console.log('📋 Mock payment data:', mockData);
    console.log('💡 This will likely fail verification since it\'s mock data');
    
    return await this.testVerification(mockData);
  },
  
  // Check server logs (if available)
  async checkServerLogs() {
    console.log('📋 To check server logs, look at your terminal/console where the Next.js dev server is running');
    console.log('🔍 Look for these log messages:');
    console.log('  - 🔍 Verifying payment for user: [email]');
    console.log('  - 📋 Payment details: {...}');
    console.log('  - 📊 Razorpay subscription status: [status]');
    console.log('  - 🔍 Payment status check: {...}');
    console.log('  - ✅ Payment verified and user upgraded...');
  }
};

// Quick access functions
window.checkAuth = window.subscriptionDebug.checkAuth;
window.testPaymentVerification = window.subscriptionDebug.testVerification;
window.monitorUser = window.subscriptionDebug.monitorUserStatus;

console.log('🧪 Subscription Debug Tools Loaded!');
console.log('💡 Available functions:');
console.log('  - subscriptionDebug.checkAuth() - Check authentication status');
console.log('  - subscriptionDebug.testVerification(paymentData) - Test payment verification');
console.log('  - subscriptionDebug.monitorUserStatus() - Monitor user status changes');
console.log('  - subscriptionDebug.simulatePayment() - Simulate payment with mock data');
console.log('  - subscriptionDebug.checkServerLogs() - Tips for checking server logs');
console.log('\n🚀 Quick start:');
console.log('  1. checkAuth() - Verify you\'re logged in');
console.log('  2. monitorUser() - Start monitoring status changes');
console.log('  3. Make a subscription payment');
console.log('  4. Watch for status changes in real-time');
console.log('\n💡 Or test with real payment data:');
console.log('  testPaymentVerification({ razorpay_payment_id: "pay_XXX", ... })');
