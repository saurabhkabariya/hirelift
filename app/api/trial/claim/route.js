import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export async function POST(request) {
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

    // Check if user has already claimed trial
    if (user.hasClaimedTrial) {
      return NextResponse.json(
        { error: 'Trial has already been claimed for this account' },
        { status: 400 }
      );
    }

    // Check if user already has an active premium plan
    if (user.isPremium && user.expiryDate && new Date() < user.expiryDate) {
      return NextResponse.json(
        { error: 'User already has an active premium plan' },
        { status: 400 }
      );
    }

    // Set up 7-day trial
    const now = new Date();
    const trialEndDate = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000)); // 7 days from now

    user.hasClaimedTrial = true;
    user.trialStartDate = now;
    user.trialEndDate = trialEndDate;
    user.isTrialActive = true;
    user.isPremium = true; // Set to true during trial
    user.proPlanType = 'trial';
    // Note: We don't set planDetails for trials since it's not a purchase

    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Trial activated successfully!',
      trialInfo: {
        startDate: user.trialStartDate,
        endDate: user.trialEndDate,
        daysRemaining: 7
      }
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to activate trial. Please try again.' },
      { status: 500 }
    );
  }
}