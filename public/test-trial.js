// Test script for trial functionality
// Run this in the browser console on localhost to test trial features

const testTrialFlow = async () => {
  console.log('🧪 Starting Trial System Test...');
  
  try {
    // Test 1: Check trial status endpoint (health check)
    console.log('\n1️⃣ Testing trial status endpoint...');
    const statusResponse = await fetch('/api/trial/status', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (statusResponse.ok) {
      const statusData = await statusResponse.json();
      console.log('✅ Trial status check:', statusData);
    } else {
      console.log('❌ Trial status check failed:', statusResponse.status);
    }
    
    // Test 2: Check if user can claim trial
    if (statusData?.trialStatus?.canClaimTrial) {
      console.log('\n2️⃣ Testing trial claim...');
      const claimResponse = await fetch('/api/trial/claim', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (claimResponse.ok) {
        const claimData = await claimResponse.json();
        console.log('✅ Trial claimed successfully:', claimData);
      } else {
        const claimError = await claimResponse.json();
        console.log('❌ Trial claim failed:', claimError);
      }
    } else {
      console.log('2️⃣ User cannot claim trial (already claimed or has active plan)');
    }
    
    // Test 3: Check expiry endpoint health
    console.log('\n3️⃣ Testing expiry endpoint health...');
    const expiryHealthResponse = await fetch('/api/trial/expire');
    
    if (expiryHealthResponse.ok) {
      const expiryHealthData = await expiryHealthResponse.json();
      console.log('✅ Expiry endpoint health:', expiryHealthData);
    } else {
      console.log('❌ Expiry endpoint health check failed:', expiryHealthResponse.status);
    }
    
    console.log('\n🎉 Trial system test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

// Helper function to simulate trial expiry (for testing)
const simulateTrialExpiry = async () => {
  console.log('⚠️  Simulating trial expiry (admin only)...');
  
  // This would typically require admin privileges
  const response = await fetch('/api/trial/expire', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.CRON_SECRET}`, // This won't work in browser
      'Content-Type': 'application/json'
    }
  });
  
  if (response.ok) {
    const data = await response.json();
    console.log('✅ Simulated expiry result:', data);
  } else {
    console.log('❌ Expiry simulation failed (expected without proper auth)');
  }
};

// Helper function to check local trial components
const testTrialComponents = () => {
  console.log('🔧 Testing trial components...');
  
  // Check if trial showcase is present
  const trialShowcase = document.querySelector('[data-testid="trial-showcase"]');
  console.log(trialShowcase ? '✅ Trial showcase found' : '❌ Trial showcase not found');
  
  // Check if trial status hook is working (look for trial-related elements)
  const trialButtons = document.querySelectorAll('[data-testid*="trial"]');
  console.log(`Found ${trialButtons.length} trial-related elements`);
  
  // Check for trial expiry popup
  const expiryPopup = document.querySelector('[data-testid="trial-expiry-popup"]');
  console.log(expiryPopup ? '✅ Trial expiry popup component found' : 'ℹ️  Trial expiry popup not visible (normal)');
};

// Export functions for manual testing
window.testTrialFlow = testTrialFlow;
window.simulateTrialExpiry = simulateTrialExpiry;
window.testTrialComponents = testTrialComponents;

console.log(`
🧪 Trial Testing Functions Available:
- testTrialFlow() - Test complete trial API flow
- testTrialComponents() - Check trial UI components
- simulateTrialExpiry() - Simulate trial expiry (admin only)

Run testTrialFlow() to start testing!
`);

// Auto-run basic test if user is logged in
if (localStorage.getItem('token')) {
  console.log('🔍 User logged in, running basic trial test...');
  testTrialFlow();
} else {
  console.log('ℹ️  Please log in to test trial functionality');
}