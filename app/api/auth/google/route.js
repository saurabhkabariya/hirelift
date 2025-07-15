import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request) {
  try {
    const { email, firebaseUid } = await request.json();

    // Validate input
    if (!email || !firebaseUid) {
      return NextResponse.json(
        { error: 'Email and Firebase UID are required' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Check if user already exists
    let user = await User.findOne({ 
      $or: [
        { email: email.toLowerCase() },
        { firebaseUid: firebaseUid }
      ]
    });

    if (user) {
      // Update existing user with Firebase UID if not present
      if (!user.firebaseUid) {
        user.firebaseUid = firebaseUid;
        await user.save();
      }
    } else {
      // Create new user
      user = new User({
        email: email.toLowerCase(),
        password: null, // Google Auth users don't have passwords
        firebaseUid: firebaseUid,
        auditCount: 0,
        isPremium: false,
      });
      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.email,
        auditCount: user.auditCount,
        isPremium: user.isPremium,
        firebaseUid: user.firebaseUid
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return success response
    const userResponse = {
      id: user._id,
      email: user.email,
      auditCount: user.auditCount,
      isPremium: user.isPremium,
      firebaseUid: user.firebaseUid,
      createdAt: user.createdAt,
    };

    return NextResponse.json(
      { 
        message: 'Google authentication successful',
        user: userResponse,
        token
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Google auth error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 