// Migration script to fix subscription users missing proper tracking fields
import mongoose from 'mongoose';
import connectDB from './lib/mongodb.js';
import User from './models/User.js';
import Subscription from './models/Subscription.js';

async function fixSubscriptionUserFields() {
  try {
    await connectDB();
    console.log('✅ Connected to MongoDB');

    // Find premium users who might be missing subscription tracking
    const premiumUsers = await User.find({
      isPremium: true,
      $or: [
        { proPlanType: null },
        { proPlanType: { $exists: false } },
        { purchaseDate: null },
        { purchaseDate: { $exists: false } }
      ]
    });

    console.log(`\n🔍 Found ${premiumUsers.length} premium users with missing subscription fields`);

    if (premiumUsers.length === 0) {
      console.log('✅ All premium users already have proper subscription tracking');
      return;
    }

    let updatedCount = 0;

    for (const user of premiumUsers) {
      // Check if user has any subscriptions
      const userSubscription = await Subscription.findOne({ userId: user._id });
      
      if (userSubscription) {
        // User has subscription, mark as subscription type
        const now = new Date();
        await User.findByIdAndUpdate(user._id, {
          proPlanType: 'subscription',
          purchaseDate: user.purchaseDate || userSubscription.createdAt || now,
          expiryDate: null, // Subscriptions don't have fixed expiry
          updatedAt: now
        });
        
        console.log(`✅ Updated subscription user: ${user.email}`);
        updatedCount++;
      } else {
        // User has no subscription, might be one-time payment
        // Check if they have payment details
        if (user.paymentDetails && user.paymentDetails.razorpay_payment_id) {
          const now = new Date();
          await User.findByIdAndUpdate(user._id, {
            proPlanType: 'onetime',
            purchaseDate: user.purchaseDate || user.paymentDetails.created_at || now,
            // Keep existing expiryDate if any
            updatedAt: now
          });
          
          console.log(`✅ Updated one-time payment user: ${user.email}`);
          updatedCount++;
        } else {
          console.log(`⚠️  Premium user without subscription or payment details: ${user.email}`);
        }
      }
    }

    console.log(`\n✅ Migration completed. Updated ${updatedCount} users.`);

    // Show summary of current state
    const subscriptionUsers = await User.countDocuments({
      isPremium: true,
      proPlanType: 'subscription'
    });

    const oneTimeUsers = await User.countDocuments({
      isPremium: true,
      proPlanType: 'onetime'
    });

    const stillMissing = await User.countDocuments({
      isPremium: true,
      $or: [
        { proPlanType: null },
        { proPlanType: { $exists: false } }
      ]
    });

    console.log('\n📊 Current Premium User Distribution:');
    console.log(`   Subscription users: ${subscriptionUsers}`);
    console.log(`   One-time payment users: ${oneTimeUsers}`);
    console.log(`   Still missing plan type: ${stillMissing}`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the migration
fixSubscriptionUserFields();
