/**
 * Test script for Razorpay Subscription Integration
 * 
 * This script tests the complete subscription flow:
 * 1. Authentication
 * 2. Subscription creation
 * 3. Webhook simulation
 * 
 * Run with: node scripts/test-razorpay-subscription.js
 */

// Load environment variables
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env.local from the project root
config({ path: join(__dirname, '..', '.env.local') });

import fetch from 'node-fetch';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// Configuration
const BASE_URL = 'http://localhost:3000';
const TEST_USER = {
  email: 'test.subscription@hirelift.com',
  password: 'TestPassword123!'
};

// Test Plan ID (you need to create this in Razorpay Dashboard)
const TEST_PLAN_ID = 'plan_QzYt9RLYww9UcP'; // Actual plan ID from environment

class RazorpaySubscriptionTester {
  constructor() {
    this.authToken = null;
    this.subscriptionId = null;
  }

  /**
   * Generate a test JWT token for testing (bypass actual login)
   */
  generateTestToken(userId = '507f1f77bcf86cd799439011') {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET not found in environment variables');
    }
    
    return jwt.sign(
      { 
        userId: userId,
        email: TEST_USER.email,
        isPremium: false
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
  }

  /**
   * Test 1: Create Subscription
   */
  async testCreateSubscription() {
    console.log('\n🧪 Test 1: Creating Subscription...');
    
    try {
      // Generate test token
      this.authToken = this.generateTestToken();
      
      const response = await fetch(`${BASE_URL}/api/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.authToken}`
        },
        body: JSON.stringify({
          planId: TEST_PLAN_ID,
          totalCount: 12, // 12 payments for yearly subscription
          quantity: 1,
          customerName: 'Test Subscription User',
          customerContact: '+919876543210'
        })
      });

      const result = await response.json();
      
      if (response.ok) {
        console.log('✅ Subscription created successfully!');
        console.log('📋 Subscription ID:', result.subscription.razorpaySubscriptionId);
        console.log('💳 Payment Options:', !!result.paymentOptions);
        console.log('👤 Customer ID:', result.customer.id);
        
        this.subscriptionId = result.subscription.razorpaySubscriptionId;
        return true;
      } else {
        console.log('❌ Subscription creation failed:', result.error);
        return false;
      }
    } catch (error) {
      console.log('❌ Test error:', error.message);
      return false;
    }
  }

  /**
   * Test 2: Get Subscription Details
   */
  async testGetSubscription() {
    console.log('\n🧪 Test 2: Getting Subscription Details...');
    
    try {
      const response = await fetch(`${BASE_URL}/api/subscribe`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.authToken}`
        }
      });

      const result = await response.json();
      
      if (response.ok) {
        console.log('✅ Subscription details retrieved!');
        console.log('📊 Status:', result.subscription?.status);
        console.log('📅 Start Date:', result.subscription?.startAt);
        console.log('📅 End Date:', result.subscription?.endAt);
        console.log('🔄 Is Active:', result.subscription?.isActive);
        return true;
      } else {
        console.log('❌ Failed to get subscription:', result.error);
        return false;
      }
    } catch (error) {
      console.log('❌ Test error:', error.message);
      return false;
    }
  }

  /**
   * Test 3: Simulate Webhook
   */
  async testWebhook() {
    console.log('\n🧪 Test 3: Simulating Webhook...');
    
    if (!this.subscriptionId) {
      console.log('⚠️  Skipping webhook test - no subscription ID available');
      return false;
    }

    try {
      // Create webhook payload
      const webhookPayload = {
        entity: 'event',
        account_id: 'acc_test123',
        event: 'subscription.activated',
        contains: ['subscription'],
        payload: {
          subscription: {
            entity: 'subscription',
            id: this.subscriptionId,
            status: 'active',
            current_start: Math.floor(Date.now() / 1000),
            current_end: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60), // 30 days
            ended_at: null,
            quantity: 1,
            total_count: 12,
            paid_count: 1,
            remain_count: 11
          }
        },
        created_at: Math.floor(Date.now() / 1000)
      };

      const body = JSON.stringify(webhookPayload);
      
      // Generate webhook signature (for testing - normally Razorpay does this)
      const signature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest('hex');

      const response = await fetch(`${BASE_URL}/api/webhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-razorpay-signature': signature
        },
        body: body
      });

      const result = await response.json();
      
      if (response.ok) {
        console.log('✅ Webhook processed successfully!');
        console.log('📨 Event:', result.event);
        console.log('💬 Message:', result.message);
        return true;
      } else {
        console.log('❌ Webhook processing failed:', result.error);
        return false;
      }
    } catch (error) {
      console.log('❌ Webhook test error:', error.message);
      return false;
    }
  }

  /**
   * Test 4: Cancel Subscription
   */
  async testCancelSubscription() {
    console.log('\n🧪 Test 4: Cancelling Subscription...');
    
    try {
      const response = await fetch(`${BASE_URL}/api/subscribe?cancel_at_cycle_end=true`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.authToken}`
        }
      });

      const result = await response.json();
      
      if (response.ok) {
        console.log('✅ Subscription cancelled successfully!');
        console.log('📊 Status:', result.subscription.status);
        console.log('🗓️  Cancelled At:', result.subscription.cancelledAt);
        return true;
      } else {
        console.log('❌ Cancellation failed:', result.error);
        return false;
      }
    } catch (error) {
      console.log('❌ Cancellation test error:', error.message);
      return false;
    }
  }

  /**
   * Run all tests
   */
  async runAllTests() {
    console.log('🚀 Starting Razorpay Subscription Integration Tests...');
    console.log('🔧 Base URL:', BASE_URL);
    console.log('📋 Test Plan ID:', TEST_PLAN_ID);
    
    // Check environment variables
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.log('❌ Razorpay credentials not found in environment variables');
      console.log('💡 Make sure RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are set in .env.local');
      return;
    }

    if (TEST_PLAN_ID === 'plan_XXXXXXXXXXXXXXXX') {
      console.log('❌ Please update TEST_PLAN_ID with a real Razorpay plan ID');
      console.log('💡 Create a plan in Razorpay Dashboard and update the TEST_PLAN_ID variable');
      return;
    }

    const results = {
      createSubscription: await this.testCreateSubscription(),
      getSubscription: await this.testGetSubscription(),
      webhook: await this.testWebhook(),
      cancelSubscription: await this.testCancelSubscription()
    };

    // Summary
    console.log('\n📊 Test Results Summary:');
    console.log('========================');
    Object.entries(results).forEach(([test, passed]) => {
      console.log(`${passed ? '✅' : '❌'} ${test}: ${passed ? 'PASSED' : 'FAILED'}`);
    });

    const passedTests = Object.values(results).filter(Boolean).length;
    const totalTests = Object.keys(results).length;
    
    console.log(`\n🎯 Overall: ${passedTests}/${totalTests} tests passed`);
    
    if (passedTests === totalTests) {
      console.log('🎉 All tests passed! Razorpay subscription integration is working correctly.');
    } else {
      console.log('⚠️  Some tests failed. Please check the logs above for details.');
    }
  }
}

// Run tests if called directly
if (import.meta.url === new URL(import.meta.url).href) {
  const tester = new RazorpaySubscriptionTester();
  tester.runAllTests().catch(console.error);
}

export default RazorpaySubscriptionTester;
