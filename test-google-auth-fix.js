/**
 * Test script to verify Google authentication emailVerified fix
 * Run this in browser console on localhost:3000 after logging in
 */

// Test Google authentication endpoint
async function testGoogleAuthFix() {
  try {
    console.log('🧪 Testing Google authentication emailVerified fix...');
    
    // Get current user from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    console.log('👤 Current user:', {
      email: user.email,
      emailVerified: user.emailVerified,
      firebaseUid: user.firebaseUid
    });
    
    // Refetch user data to see if emailVerified is properly set
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('❌ No token found. Please log in first.');
      return;
    }
    
    const response = await fetch('/api/auth/me', {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      console.error('❌ Failed to fetch user:', response.status, response.statusText);
      return;
    }
    
    const data = await response.json();
    console.log('📄 Server response:', data);
    
    if (data.user) {
      console.log('✅ User data from server:', {
        email: data.user.email,
        emailVerified: data.user.emailVerified,
        firebaseUid: data.user.firebaseUid,
        isPremium: data.user.isPremium
      });
      
      if (data.user.firebaseUid && data.user.emailVerified) {
        console.log('🎉 SUCCESS: Google user has emailVerified: true');
      } else if (data.user.firebaseUid && !data.user.emailVerified) {
        console.log('⚠️ WARNING: Google user still has emailVerified: false');
        console.log('💡 This user may need to log out and log back in with Google');
      } else {
        console.log('ℹ️ INFO: This is not a Google user (no firebaseUid)');
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
console.log('🔄 Running Google authentication emailVerified test...');
testGoogleAuthFix();

console.log(`
📋 MANUAL TEST INSTRUCTIONS:
1. Make sure you're logged in with Google (check if user has firebaseUid)
2. If not logged in with Google, sign out and sign in with Google
3. Run this script in browser console
4. Check if emailVerified is true for Google users

🎯 EXPECTED RESULT:
- Google users should have emailVerified: true
- Regular email users should go through OTP verification
- No authentication errors for Google users
`);
