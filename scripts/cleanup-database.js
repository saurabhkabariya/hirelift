import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import OTPVerification from '../models/OTPVerification.js';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function cleanupDatabase() {
  try {
    console.log('🔍 Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('🧹 Cleaning up unverified users...');
    const result = await User.deleteMany({ emailVerified: false });
    console.log(`✅ Deleted ${result.deletedCount} unverified users`);
    
    console.log('🧹 Cleaning up OTP verification records...');
    const otpResult = await OTPVerification.deleteMany({});
    console.log(`✅ Deleted ${otpResult.deletedCount} OTP verification records`);
    
    console.log('📋 Remaining users:');
    const remainingUsers = await User.find({}, 'email emailVerified createdAt');
    remainingUsers.forEach((user, index) => {
      console.log(`${index + 1}. Email: ${user.email} (Verified: ${user.emailVerified})`);
    });
    
    await mongoose.disconnect();
    console.log('✅ Database cleanup complete');
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

cleanupDatabase();
