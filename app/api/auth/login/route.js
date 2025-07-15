import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if user has password (not a Google Auth user)
    if (!user.password) {
      return NextResponse.json(
        { error: 'This account was created with Google. Please use Google Sign-In.' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.email,
        auditCount: user.auditCount,
        isPremium: user.isPremium
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
      createdAt: user.createdAt,
    };

    return NextResponse.json(
      { 
        message: 'Login successful',
        user: userResponse,
        token
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 