import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { createContact, updateBrevoContact, PLAN_TYPES } from '@/lib/brevoService';

export async function POST(request) {
  try {
    const { email, password, skipEmailVerification = false, firstName = '', lastName = '' } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // If we're not skipping email verification, user must verify email first
    if (!skipEmailVerification) {
      return NextResponse.json(
        { error: 'Please verify your email address first' },
        { status: 400 }
      );
    }

    // Check if user already exists (for skipEmailVerification=true case)
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser && existingUser.emailVerified) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    let user;
    let isNewUser = false;
    
    if (existingUser && !existingUser.emailVerified) {
      // Update existing unverified user (from OTP process)
      existingUser.password = hashedPassword;
      existingUser.firstName = firstName.trim();
      existingUser.lastName = lastName.trim();
      existingUser.emailVerified = true;
      existingUser.verifiedAt = new Date();
      await existingUser.save();
      user = existingUser;
      // This is actually completion of an existing signup, so treat as new
      isNewUser = true;
    } else {
      // Create new user (skipEmailVerification=true)
      isNewUser = true;
      user = new User({
        email: email.toLowerCase(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        password: hashedPassword,
        auditCount: 0,
        isPremium: false,
        emailVerified: true, // Always true when skipEmailVerification=true
        verifiedAt: new Date(),
      });

      await user.save();
    }

    // Add user to Brevo email marketing
    try {
      if (isNewUser) {
        // Create new contact in Brevo
        console.log(`🆕 Creating new Brevo contact for: ${user.email}`);
        await createContact(
          user.email, 
          PLAN_TYPES.FREE, 
          user.firstName || '', 
          user.lastName || '',
          user.highestATSScore || 0
        );
        console.log(`✅ Brevo contact created for ${user.email} (${PLAN_TYPES.FREE})`);
      } else {
        // This shouldn't happen in current logic, but keeping for safety
        console.log(`🔄 Updating existing Brevo contact for: ${user.email}`);
        await updateBrevoContact(user.email, PLAN_TYPES.FREE, {
          additionalAttributes: {
            AUTH_METHOD: 'email_password',
            SIGNUP_DATE: user.createdAt.toISOString(),
            SOURCE: 'hirelift_email_signup',
            EMAIL_VERIFIED: user.emailVerified,
            USER_ID: user._id.toString()
          }
        });
      }
    } catch (brevoError) {
      console.error(`❌ Brevo integration error for ${user.email}:`, brevoError);
      // Don't fail the signup process, just log the error
    }

    // Return success response (without password)
    const userResponse = {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      auditCount: user.auditCount,
      isPremium: user.isPremium,
      emailVerified: user.emailVerified,
      verifiedAt: user.verifiedAt,
      createdAt: user.createdAt,
    };

    return NextResponse.json(
      { 
        message: 'User registered successfully',
        user: userResponse,
        isNewUser: true
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 