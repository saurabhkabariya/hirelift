import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export async function GET(request) {
  try {
    await connectDB();
    
    // Get user from JWT token
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No valid authentication token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid authentication token' },
        { status: 401 }
      );
    }

    // Find user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const now = new Date();
    
    // Check if trial has expired and needs to be deactivated
    if (user.isTrialActive && user.trialEndDate && now >= user.trialEndDate) {
      // Trial has expired, deactivate it
      user.isTrialActive = false;
      user.isPremium = false; // Remove premium access unless they have a paid plan
      
      // Only keep isPremium true if they have a valid paid plan
      if (user.expiryDate && now < user.expiryDate) {
        user.isPremium = true;
      }
      
      await user.save();
    }

    // Calculate trial status
    const trialStatus = {
      hasClaimedTrial: user.hasClaimedTrial,
      isTrialActive: user.isTrialActive,
      canClaimTrial: !user.hasClaimedTrial && (!user.isPremium || (user.expiryDate && now >= user.expiryDate)),
      trialStartDate: user.trialStartDate,
      trialEndDate: user.trialEndDate,
      daysRemaining: 0,
      isExpired: false
    };

    if (user.trialEndDate) {
      const timeDiff = user.trialEndDate.getTime() - now.getTime();
      const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      
      trialStatus.daysRemaining = Math.max(0, daysRemaining);
      trialStatus.isExpired = daysRemaining <= 0;
    }

    // Get current plan status
    const currentPlan = {
      type: 'free',
      isActive: false,
      planName: 'Free Plan'
    };

    if (user.isTrialActive && user.trialEndDate && now < user.trialEndDate) {
      currentPlan.type = 'trial';
      currentPlan.isActive = true;
      currentPlan.planName = 'Career Accelerator Trial';
    } else if (user.isPremium && user.expiryDate && now < user.expiryDate) {
      currentPlan.type = 'premium';
      currentPlan.isActive = true;
      currentPlan.planName = user.planDetails?.type || user.proPlanType || 'Premium Plan';
    }

    return NextResponse.json({
      success: true,
      trialStatus,
      currentPlan,
      user: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isPremium: user.isPremium,
        hasClaimedTrial: user.hasClaimedTrial,
        isTrialActive: user.isTrialActive
      }
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to check trial status', details: error.message },
      { status: 500 }
    );
  }
}