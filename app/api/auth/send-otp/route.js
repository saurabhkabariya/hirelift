import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import OTPVerification from '@/models/OTPVerification';
import { generateOTP } from '@/lib/otp/otpUtils';
import { sendOTPEmail } from '@/lib/email/emailService';

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }    await connectDB();

    // Check if user already exists with verified email
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.emailVerified) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Check for existing OTP verification record
    const existingOTP = await OTPVerification.findOne({ email });
    
    if (existingOTP) {
      // Check resend rate limiting (allow resend only after 60 seconds)
      const timeSinceLastOTP = Date.now() - existingOTP.createdAt.getTime();
      if (timeSinceLastOTP < 60000) { // 60 seconds
        const waitTime = Math.ceil((60000 - timeSinceLastOTP) / 1000);
        return NextResponse.json(
          { error: `Please wait ${waitTime} seconds before requesting another OTP` },
          { status: 429 }
        );
      }
      
      // Update existing OTP record
      existingOTP.otp = otp;
      existingOTP.otpExpiry = otpExpiry;
      existingOTP.otpAttempts = 0;
      existingOTP.createdAt = new Date();
      await existingOTP.save();
    } else {
      // Create new OTP verification record
      const otpRecord = new OTPVerification({
        email,
        otp,
        otpExpiry,
        otpAttempts: 0,
      });
      await otpRecord.save();
    }

    // Send OTP email
    try {
      await sendOTPEmail(email, otp);
      console.log(`OTP sent to ${email}: ${otp}`); // For development - remove in production
    } catch (emailError) {
      console.error('Failed to send OTP email:', emailError);
      return NextResponse.json(
        { error: 'Failed to send verification email. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        message: 'OTP sent successfully',
        email: email 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
