import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import ReferralProfile from '@/models/ReferralProfile';

const JWT_SECRET = process.env.JWT_SECRET;

// Verify JWT token and get user
async function verifyToken(request) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    const error = new Error('Authentication required');
    error.code = 'NO_TOKEN';
    error.statusCode = 401;
    throw error;
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded.userId) {
      const error = new Error('Invalid token format');
      error.code = 'INVALID_TOKEN_FORMAT';
      error.statusCode = 401;
      throw error;
    }
    return decoded.userId;
  } catch (jwtError) {
    const error = new Error('Authentication failed');
    if (jwtError.name === 'TokenExpiredError') {
      error.code = 'TOKEN_EXPIRED';
      error.message = 'Your session has expired. Please login again.';
    } else if (jwtError.name === 'JsonWebTokenError') {
      error.code = 'INVALID_TOKEN';
      error.message = 'Invalid authentication token.';
    } else {
      error.code = 'AUTH_ERROR';
      error.message = 'Authentication verification failed.';
    }
    error.statusCode = 401;
    throw error;
  }
}

// GET - Get user's referral profile or all profiles with filters
export async function GET(request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const skills = searchParams.get('skills');
    const location = searchParams.get('location');
    const experience = searchParams.get('experience');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 12;
    const sortBy = searchParams.get('sortBy') || 'lastListedAt';
    
    // If userId provided, get specific user's profile
    if (userId && userId !== 'undefined' && userId !== 'null' && userId.trim() !== '') {
      // Validate ObjectId format
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return NextResponse.json({ 
          error: 'Invalid user ID format',
          received: userId 
        }, { status: 400 });
      }
      
      const profile = await ReferralProfile.findOne({ userId })
        .populate('userId', 'firstName lastName email');
      
      if (!profile) {
        return NextResponse.json({ 
          success: false,
          error: 'Profile not found',
          message: 'No referral profile exists for this user yet. Create one to get started.',
          userId 
        }, { status: 404 });
      }
      
      console.log('GET - Found profile:', profile.toObject());
      console.log('GET - Skills in profile:', profile.skills);
      console.log('GET - Desired roles in profile:', profile.desiredRoles);
      
      return NextResponse.json({
        success: true,
        profile
      });
    }
    
    // Build search query
    let query = { isActive: true };
    
    if (skills) {
      const skillsArray = skills.split(',').map(skill => skill.trim());
      query.skills = { $in: skillsArray };
    }
    
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    
    if (experience) {
      const expRange = experience.split('-');
      if (expRange.length === 2) {
        query.yearsOfExperience = {
          $gte: parseInt(expRange[0]),
          $lte: parseInt(expRange[1])
        };
      }
    }
    
    // Get profiles with pagination
    const skip = (page - 1) * limit;
    const profiles = await ReferralProfile.find(query)
      .populate('userId', 'firstName lastName')
      .sort({ [sortBy]: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await ReferralProfile.countDocuments(query);
    
    return NextResponse.json({
      success: true,
      profiles,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
    
  } catch (error) {
    console.error('Error fetching profiles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profiles' },
      { status: 500 }
    );
  }
}

// POST - Create new referral profile
export async function POST(request) {
  try {
    await dbConnect();
    
    const currentUserId = await verifyToken(request);
    const profileData = await request.json();
    
    console.log('POST - Received profile data:', profileData);
    console.log('POST - Skills data:', profileData.skills);
    console.log('POST - Desired roles data:', profileData.desiredRoles);
    
    // Get user to check permissions
    const user = await User.findById(currentUserId);
    if (!user) {
      return NextResponse.json({ 
        error: 'User not found',
        errorType: 'USER_NOT_FOUND',
        message: 'Your account could not be found. Please try logging in again.'
      }, { status: 404 });
    }
    
    // Check if user can create profile based on plan
    if (!user.canCreateReferralProfile()) {
      const now = new Date();
      const lastListed = user.lastProfileListedAt;
      const nextAllowed = user.hasActivePremium 
        ? new Date(lastListed.getTime() + (7 * 24 * 60 * 60 * 1000))
        : new Date(lastListed.getTime() + (30 * 24 * 60 * 60 * 1000));
      
      const daysUntilNext = Math.ceil((nextAllowed - now) / (1000 * 60 * 60 * 24));
      const timePeriod = user.hasActivePremium ? '7 days' : '30 days';
      const lastListedFormatted = lastListed.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      return NextResponse.json({
        error: 'Profile creation limit reached',
        errorType: 'RATE_LIMIT_EXCEEDED',
        message: `You can only create or update your profile once every ${timePeriod}.`,
        details: {
          lastProfileCreated: lastListedFormatted,
          nextAllowedDate: nextAllowed.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          daysRemaining: daysUntilNext,
          currentPlan: user.hasActivePremium ? 'Premium' : 'Free',
          limitation: user.hasActivePremium 
            ? 'Premium users can update profiles weekly'
            : 'Free users can update profiles monthly'
        },
        upgrade: user.hasActivePremium ? null : {
          suggestion: 'Upgrade to Premium for more frequent profile updates',
          benefits: [
            'Update your profile weekly (instead of monthly)',
            'Higher visibility in search results',
            'Priority support',
            'Advanced analytics'
          ],
          action: 'Upgrade to Premium'
        }
      }, { status: 429 });
    }
    
    // Check if profile already exists
    const existingProfile = await ReferralProfile.findOne({ userId: currentUserId });
    if (existingProfile) {
      return NextResponse.json({
        error: 'Profile already exists',
        errorType: 'PROFILE_EXISTS',
        message: 'You already have a profile. You can edit your existing profile instead of creating a new one.',
        details: {
          profileId: existingProfile._id,
          createdAt: existingProfile.createdAt.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          lastUpdated: existingProfile.updatedAt?.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }) || 'Never updated'
        },
        action: 'Use the Edit Profile button to update your existing profile'
      }, { status: 409 });
    }
    
    // Validate required fields
    const requiredFields = ['fullName', 'headline', 'summary', 'location'];
    const missingFields = requiredFields.filter(field => !profileData[field] || profileData[field].trim() === '');
    
    if (missingFields.length > 0) {
      return NextResponse.json({
        error: 'Missing required information',
        errorType: 'VALIDATION_ERROR',
        message: 'Please fill in all required fields to create your profile.',
        missingFields: missingFields.map(field => ({
          field,
          displayName: {
            fullName: 'Full Name',
            headline: 'Professional Headline',
            summary: 'Professional Summary',
            location: 'Location'
          }[field]
        })),
        action: 'Complete all required fields and try again'
      }, { status: 400 });
    }
    
    // Validate data quality
    const validationErrors = [];
    
    if (profileData.fullName && profileData.fullName.length < 2) {
      validationErrors.push({
        field: 'fullName',
        message: 'Full name must be at least 2 characters long'
      });
    }
    
    if (profileData.headline && profileData.headline.length < 10) {
      validationErrors.push({
        field: 'headline',
        message: 'Professional headline should be at least 10 characters long for better visibility'
      });
    }
    
    if (profileData.summary && profileData.summary.length < 50) {
      validationErrors.push({
        field: 'summary',
        message: 'Professional summary should be at least 50 characters long to attract more referrers'
      });
    }
    
    if (profileData.skills && profileData.skills.length === 0) {
      validationErrors.push({
        field: 'skills',
        message: 'Add at least one skill to help referrers find you'
      });
    }
    
    if (profileData.yearsOfExperience !== undefined && profileData.yearsOfExperience < 0) {
      validationErrors.push({
        field: 'yearsOfExperience',
        message: 'Years of experience cannot be negative'
      });
    }
    
    if (validationErrors.length > 0) {
      return NextResponse.json({
        error: 'Profile validation failed',
        errorType: 'VALIDATION_ERROR',
        message: 'Your profile needs some improvements to be more attractive to referrers.',
        validationErrors,
        tips: [
          'Complete profiles get 5x more referral opportunities',
          'Detailed summaries help referrers understand your background',
          'Adding skills makes you discoverable in searches',
          'Professional headlines create strong first impressions'
        ]
      }, { status: 400 });
    }

    // Create new profile
    const profile = new ReferralProfile({
      ...profileData,
      userId: currentUserId,
      email: user.email // Ensure email matches user
    });

    console.log('POST - Profile before save:', profile.toObject());
    console.log('POST - Skills before save:', profile.skills);
    console.log('POST - Desired roles before save:', profile.desiredRoles);
    
    await profile.save();
    
    console.log('POST - Profile after save:', profile.toObject());
    console.log('POST - Skills after save:', profile.skills);
    console.log('POST - Desired roles after save:', profile.desiredRoles);
    
    // Update user listing history
    await user.updateProfileListing();
    
    return NextResponse.json({
      success: true,
      message: 'Profile created successfully',
      profile
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating profile:', error);
    
    // Handle authentication errors
    if (error.statusCode === 401) {
      return NextResponse.json({
        error: 'Authentication required',
        errorType: error.code || 'AUTH_ERROR',
        message: error.message || 'You must be logged in to create a profile.',
        action: 'Please login and try again'
      }, { status: 401 });
    }
    
    // Handle specific MongoDB validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.keys(error.errors).map(key => ({
        field: key,
        message: error.errors[key].message
      }));
      
      return NextResponse.json({
        error: 'Profile validation failed',
        errorType: 'MONGODB_VALIDATION_ERROR',
        message: 'Some information in your profile is invalid or incomplete.',
        validationErrors,
        action: 'Please correct the highlighted issues and try again'
      }, { status: 400 });
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return NextResponse.json({
        error: 'Duplicate information detected',
        errorType: 'DUPLICATE_ERROR',
        message: `This ${field} is already in use by another profile.`,
        field,
        action: 'Please use a different value and try again'
      }, { status: 409 });
    }
    
    // Handle network/database connection errors
    if (error.name === 'MongoNetworkError' || error.name === 'MongoTimeoutError') {
      return NextResponse.json({
        error: 'Database connection issue',
        errorType: 'DATABASE_ERROR',
        message: 'We are experiencing technical difficulties. Please try again in a moment.',
        action: 'If the problem persists, please contact support'
      }, { status: 503 });
    }
    
    return NextResponse.json({
      error: 'Failed to create profile',
      errorType: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred while creating your profile.',
      action: 'Please try again. If the problem continues, contact our support team.',
      supportInfo: {
        error_id: Date.now().toString(36),
        timestamp: new Date().toISOString()
      }
    }, { status: 500 });
  }
}

// PUT - Update existing referral profile
export async function PUT(request) {
  try {
    await dbConnect();
    
    const currentUserId = await verifyToken(request);
    const updates = await request.json();
    
    console.log('PUT - Received updates:', updates);
    console.log('PUT - Skills data:', updates.skills);
    console.log('PUT - Desired roles data:', updates.desiredRoles);
    
    // Find and update profile
    const profile = await ReferralProfile.findOne({ userId: currentUserId });
    if (!profile) {
      return NextResponse.json({ 
        error: 'Profile not found',
        errorType: 'PROFILE_NOT_FOUND',
        message: 'No profile found for your account. Please create a profile first.',
        action: 'Create a new profile to get started with referrals',
        suggestion: {
          text: 'Create your first profile',
          benefits: [
            'Get discovered by referrers',
            'Receive targeted job opportunities',
            'Build your professional network'
          ]
        }
      }, { status: 404 });
    }
    
    // Validate required fields if they're being updated
    const requiredFields = ['fullName', 'headline', 'summary', 'location'];
    const missingFields = requiredFields.filter(field => {
      const value = updates[field] !== undefined ? updates[field] : profile[field];
      return !value || value.toString().trim() === '';
    });
    
    if (missingFields.length > 0) {
      return NextResponse.json({
        error: 'Missing required information',
        errorType: 'VALIDATION_ERROR',
        message: 'Some required fields are missing or empty.',
        missingFields: missingFields.map(field => ({
          field,
          displayName: {
            fullName: 'Full Name',
            headline: 'Professional Headline',
            summary: 'Professional Summary',
            location: 'Location'
          }[field]
        })),
        action: 'Please fill in all required fields before saving'
      }, { status: 400 });
    }
    
    // Update fields (excluding protected fields)
    const allowedFields = [
      'fullName', 'headline', 'summary', 'location', 'phone', 'linkedinUrl',
      'githubUrl', 'portfolioUrl', 'skills', 'yearsOfExperience',
      'currentPosition', 'currentCompany', 'desiredRoles', 'salaryExpectation',
      'experience', 'education', 'projects', 'certifications', 'languages',
      'availability', 'visibility'
    ];
    
    allowedFields.forEach(field => {
      if (updates[field] !== undefined) {
        profile[field] = updates[field];
      }
    });

    console.log('PUT - Profile before save:', profile.toObject());
    console.log('PUT - Skills before save:', profile.skills);
    console.log('PUT - Desired roles before save:', profile.desiredRoles);
    
    await profile.save();
    
    console.log('PUT - Profile after save:', profile.toObject());
    console.log('PUT - Skills after save:', profile.skills);
    console.log('PUT - Desired roles after save:', profile.desiredRoles);    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      profile
    });
    
  } catch (error) {
    console.error('Error updating profile:', error);
    
    // Handle authentication errors
    if (error.statusCode === 401) {
      return NextResponse.json({
        error: 'Authentication required',
        errorType: error.code || 'AUTH_ERROR',
        message: error.message || 'You must be logged in to update your profile.',
        action: 'Please login and try again'
      }, { status: 401 });
    }
    
    // Handle specific MongoDB validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.keys(error.errors).map(key => ({
        field: key,
        message: error.errors[key].message
      }));
      
      return NextResponse.json({
        error: 'Profile validation failed',
        errorType: 'MONGODB_VALIDATION_ERROR',
        message: 'Some information in your profile update is invalid.',
        validationErrors,
        action: 'Please correct the highlighted issues and try saving again'
      }, { status: 400 });
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return NextResponse.json({
        error: 'Duplicate information detected',
        errorType: 'DUPLICATE_ERROR',
        message: `This ${field} is already in use by another profile.`,
        field,
        action: 'Please use a different value and try again'
      }, { status: 409 });
    }
    
    // Handle version conflicts (concurrent updates)
    if (error.name === 'VersionError') {
      return NextResponse.json({
        error: 'Profile was updated by another session',
        errorType: 'VERSION_CONFLICT',
        message: 'Your profile was modified in another browser or device. Please refresh and try again.',
        action: 'Refresh the page to get the latest version and reapply your changes'
      }, { status: 409 });
    }
    
    return NextResponse.json({
      error: 'Failed to update profile',
      errorType: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred while updating your profile.',
      action: 'Please try again. If the problem continues, contact support.',
      supportInfo: {
        error_id: Date.now().toString(36),
        timestamp: new Date().toISOString()
      }
    }, { status: 500 });
  }
}

// DELETE - Delete referral profile
export async function DELETE(request) {
  try {
    await dbConnect();
    
    const currentUserId = await verifyToken(request);
    
    // Find and delete profile
    const profile = await ReferralProfile.findOneAndDelete({ userId: currentUserId });
    if (!profile) {
      return NextResponse.json({ 
        error: 'Profile not found',
        errorType: 'PROFILE_NOT_FOUND',
        message: 'No profile found to delete. You may have already deleted it or never created one.',
        action: 'No further action needed - your profile data is already cleared'
      }, { status: 404 });
    }
    
    // Check if profile has active referral requests
    const activeRequests = await ReferralProfile.countDocuments({
      userId: currentUserId,
      // Add any active referral conditions here if needed
    });
    
    // Update user status
    await User.findByIdAndUpdate(currentUserId, {
      hasReferralProfile: false
    });
    
    return NextResponse.json({
      success: true,
      message: 'Profile deleted successfully',
      info: {
        deletedAt: new Date().toISOString(),
        note: 'You can create a new profile anytime, but remember the rate limits apply.'
      }
    });
    
  } catch (error) {
    console.error('Error deleting profile:', error);
    
    // Handle authentication errors
    if (error.statusCode === 401) {
      return NextResponse.json({
        error: 'Authentication required',
        errorType: error.code || 'AUTH_ERROR',
        message: error.message || 'You must be logged in to delete your profile.',
        action: 'Please login and try again'
      }, { status: 401 });
    }
    
    // Handle specific database errors
    if (error.name === 'CastError') {
      return NextResponse.json({
        error: 'Invalid profile identifier',
        errorType: 'INVALID_ID',
        message: 'Unable to identify your profile for deletion.',
        action: 'Please try logging out and back in, then try again'
      }, { status: 400 });
    }
    
    return NextResponse.json({
      error: 'Failed to delete profile',
      errorType: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred while deleting your profile.',
      action: 'Please try again. If the problem continues, contact support for manual deletion.',
      supportInfo: {
        error_id: Date.now().toString(36),
        timestamp: new Date().toISOString()
      }
    }, { status: 500 });
  }
}