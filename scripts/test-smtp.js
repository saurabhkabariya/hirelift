// Test script to verify SMTP configuration
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables from .env.local
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '..', '.env.local');
config({ path: envPath });

console.log('🔍 Checking SMTP Environment Variables:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('SMTP_HOST:', process.env.SMTP_HOST);
console.log('SMTP_PORT:', process.env.SMTP_PORT);
console.log('SMTP_SECURE:', process.env.SMTP_SECURE);
console.log('SMTP_USER:', process.env.SMTP_USER ? '***' + process.env.SMTP_USER.slice(-5) : 'NOT SET');
console.log('SMTP_PASS:', process.env.SMTP_PASS ? '***' + process.env.SMTP_PASS.slice(-3) : 'NOT SET');
console.log('SMTP_FROM:', process.env.SMTP_FROM);

const hasSmtpConfig = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;
console.log('✅ Has SMTP Config:', hasSmtpConfig);

// Test email sending
import { sendOTPEmail } from '../lib/email/emailService.js';

async function testEmailSending() {
  console.log('\n🧪 Testing email sending...');
  
  try {
    const result = await sendOTPEmail('test@example.com', '123456');
    console.log('✅ Email test result:', result);
  } catch (error) {
    console.error('❌ Email test failed:', error.message);
  }
}

testEmailSending();
