import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

// Update user profile with onboarding data
export async function PUT(req) {
  try {
    // Get token from Authorization header
    // const authHeader = req.headers.get('authorization');
    // if (!authHeader || !authHeader.startsWith('Bearer ')) {
    //   return NextResponse.json({ error: 'Authorization token required' }, { status: 401 });
    // }

    // const token = authHeader.substring(7);
    // let decoded;
    
    // try {
    //   decoded = jwt.verify(token, process.env.JWT_SECRET);
    // } catch (err) {
    //   return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    // }

    await connectDB();
    
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const profileData = await req.json();

    // Update user profile with onboarding data
    const updateFields = {};
    
    // Basic info
    if (profileData.fullName) {
      const nameParts = profileData.fullName.split(' ');
      updateFields.firstName = nameParts[0];
      updateFields.lastName = nameParts.slice(1).join(' ');
    }
    
    if (profileData.phone) updateFields.phone = profileData.phone;
    if (profileData.location) updateFields.location = profileData.location;
    
    // Professional info
    if (profileData.currentRole) updateFields.currentRole = profileData.currentRole;
    if (profileData.company) updateFields.company = profileData.company;
    if (profileData.experience) updateFields.experience = profileData.experience;
    if (profileData.industry) updateFields.industry = profileData.industry;
    
    // Career goals
    if (profileData.targetRole) updateFields.targetRole = profileData.targetRole;
    if (profileData.careerGoal) updateFields.careerGoal = profileData.careerGoal;
    if (profileData.jobSearchStatus) updateFields.jobSearchStatus = profileData.jobSearchStatus;
    
    // Mark onboarding as completed
    updateFields.onboardingCompleted = true;
    updateFields.onboardingCompletedAt = new Date();

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      decoded.userId,
      updateFields,
      { new: true, runValidators: true }
    );

    return NextResponse.json({ 
      success: true, 
      user: updatedUser,
      message: 'Profile updated successfully'
    });

  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Get user profile
export async function GET(req) {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Authorization token required' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    await connectDB();
    
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      user: user
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}