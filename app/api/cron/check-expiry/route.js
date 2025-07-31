import { NextResponse } from 'next/server';
import User from '@/models/User';
import connectDB from '@/lib/mongodb';

/**
 * GET /api/cron/check-expiry
 * Cron job to check and update expired one-time premium users
 */
export async function GET(request) {
  try {
    // Verify cron job authorization (you can add a secret key check here)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET || 'hirelift-cron-secret';
    
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    console.log('🕒 Running expiry check cron job...');

    // Find users with expired one-time premium access
    const expiredUsers = await User.find({
      isPremium: true,
      proPlanType: 'onetime',
      expiryDate: { $lte: new Date() }
    });

    console.log(`📊 Found ${expiredUsers.length} expired one-time premium users`);

    // Update expired users
    const updateResults = await Promise.all(
      expiredUsers.map(async (user) => {
        try {
          await User.findByIdAndUpdate(user._id, {
            isPremium: false,
            proPlanType: null,
            expiryDate: null,
            updatedAt: new Date()
          });

          console.log(`⏰ Expired premium access for user: ${user.email}`);
          return { email: user.email, status: 'expired' };
        } catch (error) {
          console.error(`❌ Failed to expire user ${user.email}:`, error);
          return { email: user.email, status: 'error', error: error.message };
        }
      })
    );

    return NextResponse.json({
      success: true,
      message: 'Expiry check completed',
      processed: expiredUsers.length,
      results: updateResults
    });

  } catch (error) {
    console.error('❌ Cron job error:', error);
    
    return NextResponse.json(
      { 
        error: 'Cron job failed',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
