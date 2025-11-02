import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request) {
  try {
    // Check for cron authorization (for production security)
    const authHeader = request.headers.get('Authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && (!authHeader || authHeader !== `Bearer ${cronSecret}`)) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid cron secret' },
        { status: 401 }
      );
    }

    await connectDB();
    
    const now = new Date();
    
    // Find all users with active trials that should be expired
    const expiredTrialUsers = await User.find({
      isTrialActive: true,
      trialEndDate: { $lte: now }
    });

    let expiredCount = 0;
    const expiredUserEmails = [];

    for (const user of expiredTrialUsers) {
      try {
        // Deactivate trial
        user.isTrialActive = false;
        
        // Remove premium access unless they have a valid paid plan
        if (!user.expiryDate || now >= user.expiryDate) {
          user.isPremium = false;
        }
        
        // If proPlanType was 'trial', reset it
        if (user.proPlanType === 'trial') {
          user.proPlanType = null;
        }
        
        await user.save();
        expiredCount++;
        expiredUserEmails.push(user.email);
        
      } catch (userError) {
        // Continue processing other users even if one fails
        console.error(`Failed to expire trial for user ${user.email}:`, userError);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Expired ${expiredCount} trials`,
      expiredCount,
      expiredUsers: expiredUserEmails,
      executedAt: now.toISOString()
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process trial expiration', details: error.message },
      { status: 500 }
    );
  }
}

// Health check endpoint for monitoring
export async function GET(request) {
  try {
    await connectDB();
    
    const now = new Date();
    
    // Count active trials and those about to expire
    const activeTrials = await User.countDocuments({
      isTrialActive: true,
      trialEndDate: { $gt: now }
    });
    
    const expiringSoon = await User.countDocuments({
      isTrialActive: true,
      trialEndDate: { 
        $lte: new Date(now.getTime() + (24 * 60 * 60 * 1000)), // Within 24 hours
        $gt: now 
      }
    });
    
    const expired = await User.countDocuments({
      isTrialActive: true,
      trialEndDate: { $lte: now }
    });

    return NextResponse.json({
      message: 'Trial expiry job endpoint is active',
      timestamp: now.toISOString(),
      stats: {
        activeTrials,
        expiringSoon,
        needingExpiration: expired
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Health check failed', details: error.message },
      { status: 500 }
    );
  }
}