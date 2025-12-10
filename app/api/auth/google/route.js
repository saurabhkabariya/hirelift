import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { createContact, updateBrevoContact, PLAN_TYPES } from '@/lib/brevoService';

export async function POST(request) {
  try {
    const { email, firebaseUid, displayName = '' } = await request.json();

    if (!email || !firebaseUid) {
      return NextResponse.json(
        { error: 'Email and Firebase UID are required' },
        { status: 400 }
      );
    }

    // Parse displayName into firstName and lastName
    let firstName = '';
    let lastName = '';
    if (displayName.trim()) {
      const nameParts = displayName.trim().split(' ');
      firstName = nameParts[0] || '';
      lastName = nameParts.slice(1).join(' ') || '';
    }

    await connectDB();

    let user = await User.findOne({ 
      $or: [
        { email: email.toLowerCase() },
        { firebaseUid: firebaseUid }
      ]
    });

    let isNewUser = false;
    
    if (user) {
      // Existing user - update Firebase UID if needed
      if (!user.firebaseUid) {
        user.firebaseUid = firebaseUid;
      }
      
      // Update names if they're not set and we have displayName
      if ((!user.firstName || !user.lastName) && (firstName || lastName)) {
        user.firstName = user.firstName || firstName;
        user.lastName = user.lastName || lastName;
      }
      
      if (!user.emailVerified) {
        user.emailVerified = true;
        user.verifiedAt = new Date();
      }
      
      await user.save();
    } else {
      // New user - create account
      isNewUser = true;
      user = new User({
        email: email.toLowerCase(),
        firstName: firstName,
        lastName: lastName,
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

    // Handle Brevo contact creation/update
    try {
      if (isNewUser) {
        // Create new contact in Brevo
        console.log(`🆕 Creating new Brevo contact for: ${email}`);
        await createContact(
          email, 
          PLAN_TYPES.FREE, 
          user.firstName || '', 
          user.lastName || '',
          user.highestATSScore || 0
        );
      } else {
        // Update existing contact
        console.log(`🔄 Updating existing Brevo contact for: ${email}`);
        await updateBrevoContact(email, PLAN_TYPES.FREE, {
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          additionalAttributes: {
            USER_ID: user._id.toString(),
            AUTH_METHOD: 'google',
            LAST_LOGIN: new Date().toISOString(),
            EMAIL_VERIFIED: 'true',
            ATS_SCORE: user.highestATSScore || 0
          }
        });
      }
    } catch (brevoError) {
      console.error('❌ Brevo operation failed:', brevoError.message);
      // Continue with signup even if Brevo fails
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
      firstName: user.firstName,
      lastName: user.lastName,
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
        token,
        isNewUser
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