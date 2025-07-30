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
    }    await connectDB();

    // Find OTP verification record
    const otpRecord = await OTPVerification.findOne({ email });
    if (!otpRecord) {
      return NextResponse.json(
        { error: 'No OTP request found for this email. Please start signup again.' },
        { status: 404 }
      );
    }

    // Check if user is already verified
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.emailVerified) {
      return NextResponse.json(
        { error: 'Email is already verified' },
        { status: 400 }
      );
    }

    // Check resend rate limiting (allow resend only after 60 seconds)
    const timeSinceLastOTP = Date.now() - otpRecord.createdAt.getTime();
    if (timeSinceLastOTP < 60000) { // 60 seconds
      const waitTime = Math.ceil((60000 - timeSinceLastOTP) / 1000);
      return NextResponse.json(
        { error: `Please wait ${waitTime} seconds before requesting another OTP` },
        { status: 429 }
      );
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Update OTP record with new OTP and reset attempts
    otpRecord.otp = otp;
    otpRecord.otpExpiry = otpExpiry;
    otpRecord.otpAttempts = 0;
    otpRecord.createdAt = new Date();
    await otpRecord.save();

    // Send OTP email
    try {
      await sendOTPEmail(email, otp);
      console.log(`New OTP sent to ${email}: ${otp}`); // For development - remove in production
    } catch (emailError) {
      console.error('Failed to send OTP email:', emailError);
      return NextResponse.json(
        { error: 'Failed to send verification email. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        message: 'New OTP sent successfully',
        email: email 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Resend OTP error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
