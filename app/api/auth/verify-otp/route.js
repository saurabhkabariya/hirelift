import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import OTPVerification from '@/models/OTPVerification';
import { validateOTPFormat } from '@/lib/otp/otpUtils';

export async function POST(request) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 }
      );
    }

    // Validate OTP format
    if (!validateOTPFormat(otp)) {
      return NextResponse.json(
        { error: 'Invalid OTP format' },
        { status: 400 }
      );
    }    await connectDB();

    // Find OTP verification record
    const otpRecord = await OTPVerification.findOne({ email });
    if (!otpRecord) {
      return NextResponse.json(
        { error: 'No OTP request found for this email. Please request a new OTP.' },
        { status: 404 }
      );
    }

    // Check if user already exists and is verified
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.emailVerified) {
      return NextResponse.json(
        { error: 'Email is already verified' },
        { status: 400 }
      );
    }

    // Check OTP attempts (max 5 attempts)
    if (otpRecord.otpAttempts >= 5) {
      // Delete the OTP record to force new request
      await OTPVerification.deleteOne({ email });
      return NextResponse.json(
        { error: 'Too many failed attempts. Please request a new OTP.' },
        { status: 429 }
      );
    }

    // Check if OTP has expired
    if (!otpRecord.otp || !otpRecord.otpExpiry || new Date() > otpRecord.otpExpiry) {
      // Delete expired OTP record
      await OTPVerification.deleteOne({ email });
      return NextResponse.json(
        { error: 'OTP has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // Verify OTP
    if (otpRecord.otp !== otp) {
      // Increment attempt counter
      otpRecord.otpAttempts = (otpRecord.otpAttempts || 0) + 1;
      await otpRecord.save();
      
      const remainingAttempts = 5 - otpRecord.otpAttempts;
      return NextResponse.json(
        { 
          error: `Invalid OTP. ${remainingAttempts} attempts remaining.` 
        },
        { status: 400 }
      );
    }

    // OTP is valid - delete the OTP record and mark verification as successful
    await OTPVerification.deleteOne({ email });

    return NextResponse.json(
      { 
        message: 'OTP verified successfully',
        email: email,
        verified: true
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
