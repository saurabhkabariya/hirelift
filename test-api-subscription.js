/**
 * Test the subscription API endpoint directly
 */

// Load environment variables FIRST
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env.local from the project root
config({ path: join(__dirname, '.env.local') });

// Verify MongoDB URI is loaded
if (!process.env.MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in environment');
  console.log('Available env vars:', Object.keys(process.env).filter(key => key.includes('MONGO')));
  process.exit(1);
}

import fetch from 'node-fetch';
import jwt from 'jsonwebtoken';
import connectDB from './lib/mongodb.js';
import User from './models/User.js';

async function testSubscriptionAPI() {
  try {
    console.log('🔧 Testing subscription API endpoint...');
    
    // Connect to database
    await connectDB();
    
    // Create or find test user
    const testEmail = 'test-subscription-api@hirelift.com';
    let testUser = await User.findOne({ email: testEmail });
    
    if (!testUser) {
      console.log('👤 Creating test user...');
      testUser = new User({
        name: 'Test Subscription User',
        email: testEmail,
        password: 'hashedpassword123', // This would normally be hashed
        isPremium: false
      });
      await testUser.save();
      console.log('✅ Test user created:', testUser._id);
    } else {
      console.log('✅ Found existing test user:', testUser._id);
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: testUser._id.toString(),
        email: testUser.email,
        isPremium: testUser.isPremium
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    console.log('🔑 Generated auth token');
    
    // Test subscription creation via API
    console.log('🚀 Testing subscription creation via API...');
    const response = await fetch('http://localhost:3001/api/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        planId: process.env.PLAN_ID || 'plan_QzYt9RLYww9UcP',
        totalCount: 12,
        quantity: 1,
        customerName: 'Test Subscription User',
        customerContact: '+919876543210'
      })
    });
    
    const responseData = await response.json();
    
    if (response.ok) {
      console.log('✅ API subscription creation successful!');
      console.log('📋 Response data:');
      console.log('   Subscription ID:', responseData.subscription?.id);
      console.log('   Customer ID:', responseData.customer?.id);
      console.log('   Razorpay Subscription ID:', responseData.razorpaySubscription?.id);
      console.log('   Status:', responseData.razorpaySubscription?.status);
      console.log('   Payment Options Available:', !!responseData.paymentOptions);
    } else {
      console.error('❌ API subscription creation failed:');
      console.error('   Status:', response.status);
      console.error('   Error:', responseData.error);
      console.error('   Details:', responseData);
      throw new Error(`API call failed: ${responseData.error}`);
    }
    
    return responseData;
    
  } catch (error) {
    console.error('❌ API test failed:', error.message);
    throw error;
  }
}

testSubscriptionAPI()
  .then(() => {
    console.log('\n✅ API test completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ API test failed:', error);
    process.exit(1);
  });
