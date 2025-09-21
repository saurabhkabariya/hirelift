import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { updateBrevoContact, PLAN_TYPES } from '@/lib/brevoService';

export async function POST(request) {
  try {
    const { email, firebaseUid } = await request.json();

    if (!email || !firebaseUid) {
      return NextResponse.json(
        { error: 'Email and Firebase UID are required' },
        { status: 400 }
      );
    }

    await connectDB();

    let user = await User.findOne({ 
      $or: [
        { email: email.toLowerCase() },
        { firebaseUid: firebaseUid }
      ]
    });

    if (user) {
      if (!user.firebaseUid) {
        user.firebaseUid = firebaseUid;
      }
      
      if (!user.emailVerified) {
        user.emailVerified = true;
        user.verifiedAt = new Date();
      }
      
      await user.save();
    } else {
      user = new User({
        email: email.toLowerCase(),
        password: null,
        firebaseUid: firebaseUid,
        auditCount: 0,
        isPremium: false,
        emailVerified: true,
        verifiedAt: new Date(),
        lastLoginAt: new Date(),
        createdAt: new Date(),
        authMethod: 'google'
      });

      await user.save();
    }

    try {
      await updateBrevoContact(email, PLAN_TYPES.FREE, {
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        additionalAttributes: {
          USER_ID: user._id.toString(),
          AUTH_METHOD: 'google',
          LAST_LOGIN: new Date().toISOString(),
          EMAIL_VERIFIED: 'true'
        }
      });
    } catch (brevoError) {
      console.error('Brevo update failed:', brevoError.message);
    }

    user.lastLoginAt = new Date();
    await user.save();

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

    const userResponse = {
      id: user._id,
      email: user.email,
      auditCount: user.auditCount,
      isPremium: user.isPremium,
      emailVerified: user.emailVerified,
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