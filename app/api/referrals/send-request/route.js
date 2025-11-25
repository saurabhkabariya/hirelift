import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import ReferralRequest from '@/models/ReferralRequest';
import ReferralProfile from '@/models/ReferralProfile';
import User from '@/models/User';

export async function POST(request) {
  console.log('🚀 Send Request API Called at:', new Date().toISOString());
  
  try {
    // Get and verify JWT token
    const authHeader = request.headers.get('authorization');
    console.log('Auth header present:', !!authHeader);
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No valid authorization header');
      return NextResponse.json(
        { success: false, message: 'Authorization token required' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    let userId;
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.userId;
      console.log('✅ Token verified for user:', userId);
    } catch (jwtError) {
      console.log('❌ JWT verification failed:', jwtError.message);
      return NextResponse.json(
        { success: false, message: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    console.log('Request body keys:', Object.keys(body));
    console.log('Candidate ID:', body.candidateId);
    console.log('Message length:', body.message?.length);
    console.log('Company name:', body.jobDetails?.companyName);
    
    const {
      candidateId,
      message,
      jobDetails,
      urgencyLevel,
      contactInfo,
      additionalNotes
    } = body;

    // Validate required fields
    if (!candidateId) {
      return NextResponse.json(
        { success: false, message: 'Candidate ID is required' },
        { status: 400 }
      );
    }

    if (!message || message.trim().length < 50) {
      return NextResponse.json(
        { success: false, message: 'Message must be at least 50 characters long' },
        { status: 400 }
      );
    }

    if (!jobDetails?.companyName || !jobDetails?.jobTitle || !jobDetails?.jobDescription) {
      return NextResponse.json(
        { success: false, message: 'Company name, job title, and job description are required' },
        { status: 400 }
      );
    }

    if (jobDetails.jobDescription.trim().length < 100) {
      return NextResponse.json(
        { success: false, message: 'Job description must be at least 100 characters long' },
        { status: 400 }
      );
    }

    if (!contactInfo?.email || !/\S+@\S+\.\S+/.test(contactInfo.email)) {
      return NextResponse.json(
        { success: false, message: 'Valid contact email is required' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await connectDB();
    console.log('✅ MongoDB connected successfully');
    
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(candidateId)) {
      console.log('Invalid candidate ID format:', candidateId);
      return NextResponse.json(
        { success: false, message: 'Invalid candidate ID format' },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.log('Invalid user ID format:', userId);
      return NextResponse.json(
        { success: false, message: 'Invalid user ID format' },
        { status: 400 }
      );
    }
    
    // Check if candidate profile exists and get the associated user
    console.log('🔍 Looking for candidate profile with ID:', candidateId);
    const candidateProfile = await ReferralProfile.findById(candidateId);
    
    if (!candidateProfile) {
      console.log('❌ Candidate profile not found');
      return NextResponse.json(
        { success: false, message: 'Candidate profile not found' },
        { status: 404 }
      );
    }
    
    console.log('✅ Candidate profile found:', candidateProfile.fullName);
    
    // Get the candidate user (the profile's associated user)
    const candidateUserId = candidateProfile.userId;
    if (!candidateUserId) {
      return NextResponse.json(
        { success: false, message: 'Candidate user not found' },
        { status: 404 }
      );
    }

    // Check if user is trying to refer themselves
    if (userId === candidateUserId.toString()) {
      console.log('❌ User attempting to refer themselves');
      return NextResponse.json(
        { 
          success: false, 
          message: 'You cannot refer yourself. Please select a different candidate.',
          code: 'SELF_REFERRAL_NOT_ALLOWED',
          userFriendlyMessage: '🚫 Self-referral is not allowed. You can only refer other candidates for job opportunities.'
        },
        { status: 400 }
      );
    }

    // Check if user has already sent a request to this candidate recently (within 7 days)
    // console.log('🔍 Checking for existing request...');
    // const existingRequest = await ReferralRequest.findOne({
    //   requester: new mongoose.Types.ObjectId(userId),
    //   candidate: candidateUserId,
    //   status: { $in: ['pending', 'viewed', 'accepted'] }
    // });

    // if (existingRequest) {
    //   console.log('❌ Active request already exists');
    //   return NextResponse.json(
    //     { success: false, message: 'You already have an active request for this candidate' },
    //     { status: 400 }
    //   );
    // }
    
    console.log('✅ No existing active request found');

    // Create referral request using the Mongoose model
    const now = new Date();
    const expiryDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
    
    // Map urgency level
    const urgencyMap = {
      'low': 'low',
      'medium': 'medium', 
      'high': 'high',
      'urgent': 'high' // Map urgent to high since model only has low/medium/high
    };
    
    // Create salary range object if provided
    let salaryRange = null;
    if (jobDetails.expectedSalaryRange) {
      const salaryText = jobDetails.expectedSalaryRange.trim();
      // Try to parse salary range like "$80,000 - $120,000"
      const salaryMatch = salaryText.match(/[\$]?(\d+(?:,\d+)*)\s*-\s*[\$]?(\d+(?:,\d+)*)/);
      if (salaryMatch) {
        const min = parseInt(salaryMatch[1].replace(/,/g, ''));
        const max = parseInt(salaryMatch[2].replace(/,/g, ''));
        salaryRange = { min, max, currency: 'USD' };
      }
    }

    const referralRequestData = {
      requester: new mongoose.Types.ObjectId(userId),
      candidate: candidateUserId,
      candidateProfile: new mongoose.Types.ObjectId(candidateId),
      
      // Job details mapped to model fields
      jobTitle: jobDetails.jobTitle.trim(),
      company: jobDetails.companyName.trim(),
      jobDescription: jobDetails.jobDescription.trim(),
      jobLocation: jobDetails.workLocation?.trim() || '',
      jobType: 'full-time', // Default to full-time since frontend doesn't specify
      
      // Salary range
      ...(salaryRange && { salaryRange }),
      
      // Request details
      message: message.trim(),
      urgency: urgencyMap[urgencyLevel] || 'medium',
      
      // Required fields
      pointsOffered: 100, // Default points offered (required field)
      expiryDate: expiryDate, // Required expiry date
      
      // Contact info stored in additional notes
      additionalNotes: `Contact: ${contactInfo.email}${contactInfo.phone ? `, ${contactInfo.phone}` : ''}${additionalNotes ? `\n\nAdditional Notes: ${additionalNotes}` : ''}`,
      
      // Status
      status: 'pending',
      
      // Timestamps (handled by schema timestamps: true, but we can set lastActivityAt)
      lastActivityAt: now
    };

    console.log('💾 Creating referral request with Mongoose model...');
    const referralRequest = await ReferralRequest.create(referralRequestData);
    console.log('✅ Referral request created with ID:', referralRequest._id);

    if (!referralRequest) {
      console.log('❌ Failed to create referral request');
      throw new Error('Failed to create referral request');
    }

    // Get requester details for notification (using Mongoose User model)
    console.log('👤 Getting requester details...');
    const requester = await User.findById(userId);
    
    if (!requester) {
      console.log('❌ Requester not found');
      // Continue without notification if user not found
    }

    // Create notification using raw MongoDB (since we don't have a Notification model)
    if (requester) {
      console.log('📢 Creating notification...');
      const db = mongoose.connection.db;
      const notification = {
        userId: candidateUserId,
        type: 'referral_request',
        title: 'New Referral Request',
        message: `${requester.firstName} ${requester.lastName} sent you a referral request for ${jobDetails.jobTitle} at ${jobDetails.companyName}`,
        data: {
          requestId: referralRequest._id,
          requesterName: `${requester.firstName} ${requester.lastName}`,
          companyName: jobDetails.companyName,
          jobTitle: jobDetails.jobTitle,
          urgencyLevel: urgencyLevel
        },
        read: false,
        createdAt: now
      };

      await db.collection('notifications').insertOne(notification);
      console.log('✅ Notification created');

      // Update user stats
      console.log('📊 Updating user stats...');
      await db.collection('userStats').updateOne(
        { userId: new mongoose.Types.ObjectId(userId) },
        { 
          $inc: { 
            'referrals.sentRequests': 1,
            'referrals.totalSent': 1
          },
          $set: { updatedAt: now }
        },
        { upsert: true }
      );
      console.log('✅ User stats updated');

      // Log activity
      console.log('📝 Logging activity...');
      const activity = {
        userId: new mongoose.Types.ObjectId(userId),
        type: 'referral_request_sent',
        description: `Sent referral request to ${candidateProfile.fullName} for ${jobDetails.jobTitle}`,
        metadata: {
          candidateId: candidateId,
          candidateUserId: candidateUserId,
          requestId: referralRequest._id,
          companyName: jobDetails.companyName,
          jobTitle: jobDetails.jobTitle
        },
        createdAt: now
      };

      await db.collection('activities').insertOne(activity);
      console.log('✅ Activity logged');
    }

    console.log('🎉 Request processing completed successfully');
    return NextResponse.json(
      { 
        success: true, 
        message: 'Referral request sent successfully',
        data: {
          requestId: referralRequest._id,
          status: 'pending',
          expiresAt: expiryDate
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error in send-request API:', error);
    
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Validation failed', 
          details: validationErrors,
          fields: Object.keys(error.errors)
        },
        { status: 400 }
      );
    }
    
    // Handle specific MongoDB errors
    if (error.name === 'MongoError' || error.name === 'MongoServerError') {
      return NextResponse.json(
        { success: false, message: 'Database error occurred' },
        { status: 500 }
      );
    }

    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { success: false, message: 'Invalid request data format' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json(
    { success: false, message: 'Method not allowed' },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { success: false, message: 'Method not allowed' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { success: false, message: 'Method not allowed' },
    { status: 405 }
  );
}