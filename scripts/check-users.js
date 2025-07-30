import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function checkUsers() {
  try {
    console.log('🔍 Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('📋 Checking existing users...');
    const users = await User.find({}, 'email emailVerified createdAt');
    
    if (users.length === 0) {
      console.log('✅ No users found in database');
    } else {
      console.log(`📊 Found ${users.length} users:`);
      users.forEach((user, index) => {
        console.log(`${index + 1}. Email: ${user.email}`);
        console.log(`   Verified: ${user.emailVerified}`);
        console.log(`   Created: ${user.createdAt}`);
        console.log('');
      });
    }
    
    await mongoose.disconnect();
    console.log('✅ Database check complete');
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkUsers();
