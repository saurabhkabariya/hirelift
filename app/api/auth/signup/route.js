import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { updateBrevoContact, PLAN_TYPES } from '@/lib/brevoService';

export async function POST(request) {
  try {
    const { email, password, skipEmailVerification = false } = await request.json();

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
    if (existingUser && !existingUser.emailVerified) {
      // Update existing unverified user (from OTP process)
      existingUser.password = hashedPassword;
      existingUser.emailVerified = true;
      existingUser.verifiedAt = new Date();
      await existingUser.save();
      user = existingUser;
    } else {
      // Create new user (skipEmailVerification=true)
      user = new User({
        email: email.toLowerCase(),
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
      const brevoResult = await updateBrevoContact(user.email, PLAN_TYPES.FREE, {
        additionalAttributes: {
          AUTH_METHOD: 'email_password',
          SIGNUP_DATE: user.createdAt.toISOString(),
          SOURCE: 'hirelift_email_signup',
          EMAIL_VERIFIED: user.emailVerified,
          USER_ID: user._id.toString()
        }
      });
      
      if (brevoResult.success) {
        console.log(`📧 Brevo contact ${brevoResult.action}: ${user.email} (${PLAN_TYPES.FREE})`);
      } else {
        console.error(`❌ Brevo contact failed for ${user.email}:`, brevoResult.error);
      }
    } catch (brevoError) {
      console.error(`❌ Brevo integration error for ${user.email}:`, brevoError);
      // Don't fail the signup process, just log the error
    }

    // Return success response (without password)
    const userResponse = {
      id: user._id,
      email: user.email,
      auditCount: user.auditCount,
      isPremium: user.isPremium,
      emailVerified: user.emailVerified,
      verifiedAt: user.verifiedAt,
      createdAt: user.createdAt,
    };

    return NextResponse.json(
      { 
        message: 'User registered successfully',
        user: userResponse
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