/**
 * Migration script to fix existing Google users' email verification status
 * Run this script to update existing Google users to have emailVerified: true
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

import connectDB from '../lib/mongodb.js';
import User from '../models/User.js';

async function fixGoogleUsersVerification() {
  try {
    console.log('🔧 Starting migration to fix Google users verification status...');
    
    await connectDB();
    
    // Find all Google users (users with firebaseUid but not email verified)
    const googleUsers = await User.find({
      firebaseUid: { $exists: true, $ne: null },
      emailVerified: { $ne: true }
    });
    
    console.log(`📊 Found ${googleUsers.length} Google users that need verification status update`);
    
    if (googleUsers.length === 0) {
      console.log('✅ No Google users need updating. All Google users are already verified.');
      return;
    }
    
    // Update all Google users to be email verified
    const updateResult = await User.updateMany(
      {
        firebaseUid: { $exists: true, $ne: null },
        emailVerified: { $ne: true }
      },
      {
        $set: {
          emailVerified: true,
          verifiedAt: new Date(),
          updatedAt: new Date()
        }
      }
    );
    
    console.log(`✅ Successfully updated ${updateResult.modifiedCount} Google users`);
    console.log('📝 All Google users now have emailVerified: true');
    
    // Verify the update
    const remainingUnverified = await User.countDocuments({
      firebaseUid: { $exists: true, $ne: null },
      emailVerified: { $ne: true }
    });
    
    if (remainingUnverified === 0) {
      console.log('🎉 Migration completed successfully! All Google users are now verified.');
    } else {
      console.warn(`⚠️ Warning: ${remainingUnverified} Google users still need verification`);
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

// Run the migration
fixGoogleUsersVerification()
  .then(() => {
    console.log('\n✅ Migration completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  });
