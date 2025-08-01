/**
 * Complete subscription payment testing and debugging solution
 * Run this in browser console to test the improved payment flow
 */

// Global test state
window.subscriptionTest = {
  logs: [],
  results: {}
};

function log(message, data = null) {
  const logEntry = { timestamp: new Date().toISOString(), message, data };
  window.subscriptionTest.logs.push(logEntry);
  console.log(`[${logEntry.timestamp}] ${message}`, data || '');
}

async function testCompleteSubscriptionFlow() {
  try {
    log('🚀 Starting complete subscription flow test...');
    
    // Step 1: Check authentication
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token || !user.email) {
      log('❌ Not authenticated - please login first');
      return;
    }
    
    log('✅ User authenticated', { email: user.email, isPremium: user.isPremium });
    
    // Step 2: Check current subscription status
    log('📊 Checking current subscription status...');
    
    const subResponse = await fetch('/api/subscribe', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (subResponse.ok) {
      const subData = await subResponse.json();
      log('📋 Current subscription data', subData);
      window.subscriptionTest.results.currentSubscription = subData;
      
      if (subData.subscription) {
        const sub = subData.subscription;
        log('🔍 Subscription analysis', {
          hasActiveSubscription: sub.isActive,
          status: sub.status,
          userIsPremium: user.isPremium,
          syncIssue: sub.isActive && !user.isPremium
        });
        
        if (sub.isActive && !user.isPremium) {
          log('⚠️ DETECTED: Sync issue - active subscription but user not premium');
          
          // Try to fix sync issue
          await fixUserPremiumStatus();
          return;
        }
      }
    } else {
      log('ℹ️ No existing subscription found');
    }
    
    // Step 3: Test payment verification with mock data (if subscription exists)
    if (window.subscriptionTest.results.currentSubscription?.subscription) {
      await testPaymentVerificationFlow();
    }
    
    // Step 4: Test subscription creation (if no active subscription)
    if (!window.subscriptionTest.results.currentSubscription?.subscription?.isActive) {
      log('💡 No active subscription - you can test creation flow');
      log('ℹ️ Go to /pricing page and try subscribing to test the improved flow');
    }
    
    // Step 5: Provide debugging report
    generateDebuggingReport();
    
  } catch (error) {
    log('❌ Test flow error', error.message);
  }
}

async function fixUserPremiumStatus() {
  try {
    log('🔧 Attempting to fix user premium status...');
    
    const token = localStorage.getItem('token');
    const response = await fetch('/api/auth/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (response.ok) {
      const data = await response.json();
      log('📄 Server user data', data.user);
      
      if (data.user.isPremium) {
        log('✅ User is premium on server - updating localStorage');
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Trigger page refresh or context update
        if (typeof window.location !== 'undefined') {
          log('🔄 Refreshing page to update UI...');
          setTimeout(() => window.location.reload(), 2000);
        }
      } else {
        log('❌ User still not premium on server - checking subscription webhook status');
        await checkWebhookStatus();
      }
    }
  } catch (error) {
    log('❌ Error fixing user status', error.message);
  }
}

async function testPaymentVerificationFlow() {
  try {
    log('🧪 Testing payment verification flow...');
    
    const subscription = window.subscriptionTest.results.currentSubscription.subscription;
    
    // Mock payment data for testing
    const mockPaymentData = {
      razorpay_payment_id: 'pay_test_' + Date.now(),
      razorpay_subscription_id: subscription.razorpaySubscriptionId,
      razorpay_signature: 'test_signature_' + Date.now()
    };
    
    log('📤 Testing verification with mock data', mockPaymentData);
    
    const token = localStorage.getItem('token');
    const response = await fetch('/api/payment/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(mockPaymentData)
    });
    
    const data = await response.json();
    
    log('📥 Verification response', {
      status: response.status,
      success: response.ok,
      data: data
    });
    
    window.subscriptionTest.results.verificationTest = {
      status: response.status,
      success: response.ok,
      data: data
    };
    
  } catch (error) {
    log('❌ Verification test error', error.message);
  }
}

async function checkWebhookStatus() {
  try {
    log('🔗 Checking webhook processing status...');
    
    // This would require checking database or logs
    // For now, just log recommendation
    log('💡 Webhook check recommendations:', {
      checkDatabase: 'Verify subscription status in database',
      checkWebhooks: 'Ensure webhook endpoint is accessible',
      checkRazorpay: 'Check Razorpay dashboard for subscription status',
      checkLogs: 'Review server logs for webhook processing errors'
    });
    
  } catch (error) {
    log('❌ Webhook check error', error.message);
  }
}

function generateDebuggingReport() {
  log('📊 Generating debugging report...');
  
  const report = {
    timestamp: new Date().toISOString(),
    userStatus: JSON.parse(localStorage.getItem('user') || '{}'),
    subscriptionStatus: window.subscriptionTest.results.currentSubscription,
    verificationTest: window.subscriptionTest.results.verificationTest,
    logs: window.subscriptionTest.logs,
    recommendations: []
  };
  
  // Generate recommendations
  const user = report.userStatus;
  const sub = report.subscriptionStatus?.subscription;
  
  if (sub?.isActive && !user.isPremium) {
    report.recommendations.push('SYNC ISSUE: Active subscription but user not premium - check webhook processing');
  }
  
  if (!sub?.isActive && user.isPremium) {
    report.recommendations.push('ORPHANED PREMIUM: User is premium but no active subscription - check database consistency');
  }
  
  if (report.verificationTest && !report.verificationTest.success) {
    report.recommendations.push('VERIFICATION ISSUE: Payment verification failing - check subscription status validation');
  }
  
  console.group('📋 SUBSCRIPTION DEBUGGING REPORT');
  console.log('Full Report:', report);
  console.log('Quick Summary:', {
    userEmail: user.email,
    userIsPremium: user.isPremium,
    hasActiveSubscription: sub?.isActive || false,
    subscriptionStatus: sub?.status || 'none',
    syncIssues: report.recommendations.length
  });
  console.log('Recommendations:', report.recommendations);
  console.groupEnd();
  
  window.subscriptionTest.results.finalReport = report;
  
  return report;
}

// Auto-run test
console.log('🔄 Running complete subscription flow test...');
testCompleteSubscriptionFlow();

console.log(`
📋 SUBSCRIPTION TESTING SUITE

🔧 Available Functions:
- testCompleteSubscriptionFlow() - Run full diagnostic
- fixUserPremiumStatus() - Try to fix sync issues  
- testPaymentVerificationFlow() - Test verification API
- generateDebuggingReport() - Create detailed report

📊 Results stored in: window.subscriptionTest.results
📝 Logs stored in: window.subscriptionTest.logs

💡 AFTER PAYMENT:
If you complete a payment and see "failed to update account":
1. Run testCompleteSubscriptionFlow()
2. Check the debugging report  
3. Look for sync issues or status problems
4. Try fixUserPremiumStatus() if needed
`);
