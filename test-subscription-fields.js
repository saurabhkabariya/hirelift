// Test script to verify subscription payment fields are being set correctly
import mongoose from 'mongoose';

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://freemovies:CeY6Ixs8LHqAmSaC@freemovies.pkr2u.mongodb.net/hirelift?retryWrites=true&w=majority&appName=freemovies';

// User model (simplified for testing)
const userSchema = new mongoose.Schema({
  email: String,
  name: String,
  isPremium: { type: Boolean, default: false },
  proPlanType: { type: String, enum: ['one-time', 'subscription'], default: null },
  purchaseDate: Date,
  expiryDate: Date,
  emailVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

async function testSubscriptionFields() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find subscription users
    const subscriptionUsers = await User.find({
      isPremium: true,
      proPlanType: 'subscription'
    }).select('email name isPremium proPlanType purchaseDate expiryDate');

    console.log('\n📊 Subscription Users Analysis:');
    console.log('======================================');
    
    if (subscriptionUsers.length === 0) {
      console.log('❌ No subscription users found');
    } else {
      subscriptionUsers.forEach((user, index) => {
        console.log(`\n${index + 1}. User: ${user.email}`);
        console.log(`   Name: ${user.name}`);
        console.log(`   Premium: ${user.isPremium}`);
        console.log(`   Plan Type: ${user.proPlanType}`);
        console.log(`   Purchase Date: ${user.purchaseDate || 'NOT SET'}`);
        console.log(`   Expiry Date: ${user.expiryDate || 'NULL (subscription)'}`);
      });
    }

    // Check for premium users missing subscription tracking
    const premiumMissingFields = await User.find({
      isPremium: true,
      $or: [
        { proPlanType: null },
        { proPlanType: { $exists: false } },
        { purchaseDate: null },
        { purchaseDate: { $exists: false } }
      ]
    }).select('email name isPremium proPlanType purchaseDate expiryDate');

    console.log('\n🔍 Premium Users Missing Subscription Fields:');
    console.log('=============================================');
    
    if (premiumMissingFields.length === 0) {
      console.log('✅ All premium users have proper subscription tracking');
    } else {
      premiumMissingFields.forEach((user, index) => {
        console.log(`\n${index + 1}. User: ${user.email}`);
        console.log(`   Premium: ${user.isPremium}`);
        console.log(`   Plan Type: ${user.proPlanType || 'MISSING'}`);
        console.log(`   Purchase Date: ${user.purchaseDate || 'MISSING'}`);
        console.log(`   Expiry Date: ${user.expiryDate || 'NULL'}`);
      });
    }

    console.log('\n✅ Test completed successfully');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

testSubscriptionFields();
