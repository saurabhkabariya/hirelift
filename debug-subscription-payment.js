/**
 * Debug script for subscription payment verification issues
 * Run this in browser console after a "successful" payment to debug the issue
 */

async function debugSubscriptionPayment() {
  try {
    console.log('🔧 Debugging subscription payment verification...');
    
    // Get current user and token
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token) {
      console.error('❌ No token found');
      return;
    }
    
    console.log('👤 Current user:', {
      email: user.email,
      isPremium: user.isPremium,
      id: user.id
    });
    
    // Check current subscription status
    console.log('📊 Checking subscription status...');
    
    const subResponse = await fetch('/api/subscribe', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (subResponse.ok) {
      const subData = await subResponse.json();
      console.log('📋 Current subscription:', subData);
      
      if (subData.subscription) {
        const sub = subData.subscription;
        console.log('🔍 Subscription details:', {
          id: sub.id,
          status: sub.status,
          razorpaySubscriptionId: sub.razorpaySubscriptionId,
          isActive: sub.isActive,
          isExpired: sub.isExpired,
          startAt: sub.startAt,
          endAt: sub.endAt,
          paidCount: sub.paidCount,
          remainingCount: sub.remainingCount
        });
        
        // If subscription exists but user isn't premium, there's a sync issue
        if (sub.isActive && !user.isPremium) {
          console.log('⚠️ SYNC ISSUE: Active subscription but user not premium');
          console.log('💡 Trying to refresh user data...');
          
          // Try to refetch user
          const userResponse = await fetch('/api/auth/me', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          if (userResponse.ok) {
            const userData = await userResponse.json();
            console.log('🔄 Refreshed user data:', userData.user);
            
            if (userData.user.isPremium) {
              console.log('✅ User is now premium! Updating localStorage...');
              localStorage.setItem('user', JSON.stringify(userData.user));
              window.location.reload();
            } else {
              console.log('❌ User still not premium after refresh');
            }
          }
        }
      }
    } else {
      console.log('⚠️ No subscription found or error fetching subscription');
      console.log('Response status:', subResponse.status);
      const errorData = await subResponse.json().catch(() => ({}));
      console.log('Error data:', errorData);
    }
    
    // Check if there are any recent payments that failed verification
    console.log('🔍 Checking for verification issues...');
    
    // Manual user refresh
    console.log('🔄 Manually refreshing user data...');
    const meResponse = await fetch('/api/auth/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (meResponse.ok) {
      const meData = await meResponse.json();
      console.log('👤 Latest user data from server:', meData.user);
      
      if (meData.user.isPremium !== user.isPremium) {
        console.log('🔄 User premium status changed! Updating...');
        localStorage.setItem('user', JSON.stringify(meData.user));
        
        // Trigger a page refresh or update context
        if (typeof window.authContext?.refetchUser === 'function') {
          await window.authContext.refetchUser();
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Debug script error:', error);
  }
}

// Function to test payment verification manually
async function testPaymentVerification(paymentData) {
  try {
    console.log('🧪 Testing payment verification with data:', paymentData);
    
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('❌ No token found');
      return;
    }
    
    const response = await fetch('/api/payment/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(paymentData)
    });
    
    const data = await response.json();
    
    console.log('📤 Verification response status:', response.status);
    console.log('📄 Verification response data:', data);
    
    if (response.ok) {
      console.log('✅ Payment verification successful');
      
      // Update localStorage with new user data
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        console.log('🔄 Updated user in localStorage');
      }
    } else {
      console.log('❌ Payment verification failed');
      console.log('💡 Check subscription status and payment details');
    }
    
    return data;
    
  } catch (error) {
    console.error('❌ Payment verification test error:', error);
  }
}

// Auto-run debug
console.log('🔄 Running subscription payment debug...');
debugSubscriptionPayment();

console.log(`
📋 DEBUGGING INSTRUCTIONS:

1. Run debugSubscriptionPayment() to check current status
2. If you have payment details, run testPaymentVerification(paymentData)
3. Check console for subscription status and sync issues
4. Look for "SYNC ISSUE" messages

🔧 COMMON ISSUES:
- Subscription created but payment verification failed
- User not marked as premium despite active subscription
- Token authentication issues
- Subscription status not recognized

💡 SOLUTIONS:
- Check subscription.status in Razorpay dashboard
- Verify accepted statuses in verification code
- Ensure webhook is working properly
- Check database sync between User and Subscription models
`);
