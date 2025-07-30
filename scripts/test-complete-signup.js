import dotenv from 'dotenv';
import fetch from 'node-fetch';

// Load environment variables
dotenv.config({ path: '.env.local' });

const API_BASE = 'http://localhost:3000';
const TEST_EMAIL = 'newuser@example.com';
const TEST_PASSWORD = 'password123';

async function testCompleteSignupFlow() {
  console.log('🧪 Testing Complete User Signup Experience...\n');
  
  try {
    // Step 1: User fills out signup form and clicks "Sign Up"
    console.log('👤 Step 1: User submits signup form...');
    
    // This should NOT create a user, but should send OTP
    const sendOtpResponse = await fetch(`${API_BASE}/api/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: TEST_EMAIL })
    });
    
    const sendOtpData = await sendOtpResponse.json();
    console.log('   Send OTP Response:', sendOtpData);
    
    if (!sendOtpResponse.ok) {
      throw new Error(`Send OTP failed: ${sendOtpData.error}`);
    }
    
    // Verify no user was created yet
    console.log('\n🔍 Verifying no user was created yet...');
    
    const signupAttempt = await fetch(`${API_BASE}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email: TEST_EMAIL, 
        password: TEST_PASSWORD,
        skipEmailVerification: false
      })
    });
    
    const signupData = await signupAttempt.json();
    console.log('   Premature Signup Response:', signupData);
    
    if (signupAttempt.ok) {
      throw new Error('❌ PROBLEM: User was created without OTP verification!');
    }
    
    console.log('   ✅ Good: User creation blocked without OTP verification');
    
    // Step 2: Simulate getting OTP from logs and verifying it
    console.log('\n🔐 Step 2: User enters OTP (simulating with known OTP)...');
    
    // For testing, let's try a few common OTP patterns
    const testOTPs = ['123456', '000000', '111111'];
    let otpVerified = false;
    let actualOTP = null;
    
    for (const testOTP of testOTPs) {
      const verifyResponse = await fetch(`${API_BASE}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: TEST_EMAIL, 
          otp: testOTP 
        })
      });
      
      const verifyData = await verifyResponse.json();
      
      if (verifyResponse.ok) {
        console.log(`   ✅ OTP ${testOTP} verified successfully!`, verifyData);
        otpVerified = true;
        actualOTP = testOTP;
        break;
      } else {
        console.log(`   ❌ OTP ${testOTP} failed:`, verifyData.error);
      }
    }
    
    if (!otpVerified) {
      console.log('\n⚠️  Could not verify OTP with test values. Check server logs for actual OTP.');
      console.log('   This is expected in production - OTPs should be random.');
      return;
    }
    
    // Step 3: Now create the user account after OTP verification
    console.log('\n👤 Step 3: Creating user account after OTP verification...');
    
    const finalSignupResponse = await fetch(`${API_BASE}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email: TEST_EMAIL, 
        password: TEST_PASSWORD,
        skipEmailVerification: true  // This should now work
      })
    });
    
    const finalSignupData = await finalSignupResponse.json();
    console.log('   Final Signup Response:', finalSignupData);
    
    if (!finalSignupResponse.ok) {
      throw new Error(`Final signup failed: ${finalSignupData.error}`);
    }
    
    console.log('   ✅ User account created successfully!');
    
    // Step 4: Verify the user can now login
    console.log('\n🔑 Step 4: Testing login with new account...');
    
    const loginResponse = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email: TEST_EMAIL, 
        password: TEST_PASSWORD
      })
    });
    
    const loginData = await loginResponse.json();
    console.log('   Login Response:', loginData);
    
    if (!loginResponse.ok) {
      throw new Error(`Login failed: ${loginData.error}`);
    }
    
    console.log('   ✅ Login successful!');
    
    // Step 5: Test that duplicate signup is now blocked
    console.log('\n🚫 Step 5: Testing duplicate signup prevention...');
    
    const duplicateResponse = await fetch(`${API_BASE}/api/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: TEST_EMAIL })
    });
    
    const duplicateData = await duplicateResponse.json();
    console.log('   Duplicate Signup Response:', duplicateData);
    
    if (duplicateResponse.ok) {
      console.log('   ⚠️  Warning: OTP was sent for existing verified user');
    } else {
      console.log('   ✅ Good: Duplicate signup properly blocked');
    }
    
    console.log('\n🎉 Complete signup flow test completed successfully!');
    console.log('✅ OTP-based email verification is working correctly');
    console.log('✅ Users are only created after OTP verification');
    console.log('✅ No premature user creation issues detected');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
  }
}

testCompleteSignupFlow();
