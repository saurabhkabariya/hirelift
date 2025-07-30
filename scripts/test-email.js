// Test script for email functionality
import { sendOTPEmail } from '../lib/email/emailService.js';

async function testEmail() {
  console.log('Testing OTP email sending...');
  
  try {
    const result = await sendOTPEmail('test@example.com', '123456');
    console.log('Email sent successfully:', result);
  } catch (error) {
    console.error('Email sending failed:', error);
  }
}

testEmail();
