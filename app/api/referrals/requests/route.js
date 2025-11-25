import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import ReferralRequest from '@/models/ReferralRequest';
import ReferralProfile from '@/models/ReferralProfile';

const JWT_SECRET = process.env.JWT_SECRET;

// Verify JWT token and get user
async function verifyToken(request) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    throw new Error('No token provided');
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded.userId;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

// GET - Get user's referral requests (sent/received)
export async function GET(request) {
  try {
    console.log('🔍 Requests API called at:', new Date().toISOString());
    
    await connectDB();
    console.log('✅ Connected to database');
    
    const currentUserId = await verifyToken(request);
    console.log('👤 Current user ID:', currentUserId);
    
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'sent' or 'received'
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    
    console.log('📋 Query params:', { type, status, page, limit });
    
    let query = {};
    
    if (type === 'sent') {
      query.requester = currentUserId;
    } else if (type === 'received') {
      query.candidate = currentUserId;
    } else {
      // Get both sent and received
      query.$or = [
        { requester: currentUserId },
        { candidate: currentUserId }
      ];
    }
    
    if (status) {
      query.status = status;
    }
    
    console.log('🔍 MongoDB query:', JSON.stringify(query, null, 2));
    
    const skip = (page - 1) * limit;
    
    // Check total count first
    const total = await ReferralRequest.countDocuments(query);
    console.log('📊 Total matching documents:', total);
    
    if (total === 0) {
      console.log('📭 No requests found for this user');
      // Let's check what requests exist in the database
      const allRequests = await ReferralRequest.find({}).select('requester candidate status').limit(5);
      console.log('📋 Sample requests in database:', allRequests);
    }
    
    const requests = await ReferralRequest.find(query)
      .populate('requester', 'firstName lastName email')
      .populate('candidate', 'firstName lastName email')
      .populate('candidateProfile', 'fullName headline currentPosition')
      .sort({ lastActivityAt: -1 })
      .skip(skip)
      .limit(limit);
    
    console.log('📦 Found requests:', requests.length);
    console.log('📦 Populated requests:', requests.map(r => ({
      id: r._id,
      status: r.status,
      requester: r.requester?.email,
      candidate: r.candidate?.email,
      candidateProfile: r.candidateProfile?.fullName
    })));
    
    return NextResponse.json({
      success: true,
      requests,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
    
  } catch (error) {
    console.error('❌ Error fetching requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch requests', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new referral request
export async function POST(request) {
  try {
    await connectDB();
    
    const currentUserId = await verifyToken(request);
    const requestData = await request.json();
    
    const {
      candidateId,
      jobTitle,
      company,
      jobDescription,
      jobLocation,
      jobType,
      salaryRange,
      message,
      pointsOffered,
      urgency = 'medium'
    } = requestData;
    
    // Validate required fields
    if (!candidateId || !jobTitle || !company || !jobDescription || !message || !pointsOffered) {
      return NextResponse.json({
        error: 'Missing required fields'
      }, { status: 400 });
    }
    
    // Get requester and candidate
    const requester = await User.findById(currentUserId);
    const candidate = await User.findById(candidateId);
    
    if (!requester || !candidate) {
      return NextResponse.json({
        error: 'User not found'
      }, { status: 404 });
    }
    
    // Get candidate's profile
    const candidateProfile = await ReferralProfile.findOne({ userId: candidateId });
    if (!candidateProfile) {
      return NextResponse.json({
        error: 'Candidate profile not found'
      }, { status: 404 });
    }
    
    // Check for duplicate active requests
    const existingRequest = await ReferralRequest.findOne({
      requester: currentUserId,
      candidate: candidateId,
      status: { $in: ['pending', 'viewed', 'accepted'] }
    });
    
    if (existingRequest) {
      return NextResponse.json({
        error: 'Active request already exists for this candidate'
      }, { status: 409 });
    }
    
    // Create referral request
    const referralRequest = new ReferralRequest({
      requester: currentUserId,
      candidate: candidateId,
      candidateProfile: candidateProfile._id,
      jobTitle,
      company,
      jobDescription,
      jobLocation,
      jobType,
      salaryRange,
      message,
      pointsOffered,
      urgency
    });
    
    await referralRequest.save();
    
    // Update stats
    await requester.updateReferralStats('requestsSent');
    await candidate.updateReferralStats('requestsReceived');
    
    // Update candidate profile stats
    candidateProfile.referralRequests += 1;
    await candidateProfile.save();
    
    return NextResponse.json({
      success: true,
      message: 'Referral request created successfully',
      request: referralRequest
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating request:', error);
    return NextResponse.json(
      { error: 'Failed to create request' },
      { status: 500 }
    );
  }
}

// PUT - Update referral request status
export async function PUT(request) {
  console.log('🔄 PUT request received at:', new Date().toISOString());
  
  try {
    await connectDB();
    console.log('✅ Connected to database');
    
    const currentUserId = await verifyToken(request);
    console.log('👤 Current user ID:', currentUserId);
    
    const { searchParams } = new URL(request.url);
    const requestId = searchParams.get('id');
    console.log('📋 Request ID:', requestId);
    
    const updateData = await request.json();
    console.log('📦 Update data:', updateData);
    
    if (!requestId) {
      console.log('❌ No request ID provided');
      return NextResponse.json({
        error: 'Request ID required'
      }, { status: 400 });
    }
    
    // Find the request
    console.log('🔍 Finding request with ID:', requestId);
    const referralRequest = await ReferralRequest.findById(requestId);
    console.log('📋 Found request:', !!referralRequest);
    
    if (!referralRequest) {
      console.log('❌ Request not found');
      return NextResponse.json({
        error: 'Request not found'
      }, { status: 404 });
    }
    
    // Check permissions
    const isRequester = referralRequest.requester.toString() === currentUserId;
    const isCandidate = referralRequest.candidate.toString() === currentUserId;
    
    console.log('🔐 Permission check:', {
      requester: referralRequest.requester.toString(),
      candidate: referralRequest.candidate.toString(),
      currentUser: currentUserId,
      isRequester,
      isCandidate
    });
    
    if (!isRequester && !isCandidate) {
      console.log('❌ User not authorized');
      return NextResponse.json({
        error: 'Not authorized to update this request'
      }, { status: 403 });
    }
    
    const { action, feedback, message: newMessage } = updateData;
    console.log('🎬 Processing action:', action);
    console.log('🎬 Current request status:', referralRequest.status);
    console.log('🎬 User permissions:', { isRequester, isCandidate });
    
    // Handle different actions
    switch (action) {
      case 'view':
        if (isCandidate && referralRequest.status === 'pending') {
          referralRequest.status = 'viewed';
          referralRequest.viewedAt = new Date();
          referralRequest.lastActivityAt = new Date();
          await referralRequest.save();
        }
        break;
        
      case 'accept':
        console.log('🎯 Accept action - isCandidate:', isCandidate, 'status:', referralRequest.status);
        if (isCandidate) {
          if (!['pending', 'viewed'].includes(referralRequest.status)) {
            console.log('❌ Cannot accept - wrong status:', referralRequest.status);
            return NextResponse.json({
              error: 'Cannot accept request in current status'
            }, { status: 400 });
          }
          console.log('✅ Accepting request...');
          referralRequest.status = 'accepted';
          referralRequest.acceptedAt = new Date();
          referralRequest.lastActivityAt = new Date();
          await referralRequest.save();
          console.log('✅ Request accepted successfully');
        } else {
          console.log('❌ Not a candidate - isCandidate:', isCandidate);
          return NextResponse.json({
            error: 'Only candidate can accept request'
          }, { status: 403 });
        }
        break;
        
      case 'decline':
        if (isCandidate) {
          if (!['pending', 'viewed'].includes(referralRequest.status)) {
            return NextResponse.json({
              error: 'Cannot decline request in current status'
            }, { status: 400 });
          }
          referralRequest.status = 'declined';
          referralRequest.declinedAt = new Date();
          referralRequest.lastActivityAt = new Date();
          await referralRequest.save();
        } else {
          return NextResponse.json({
            error: 'Only candidate can decline request'
          }, { status: 403 });
        }
        break;
        
      case 'refer':
        if (isRequester && referralRequest.status === 'accepted') {
          referralRequest.status = 'referred';
          referralRequest.referredAt = new Date();
          referralRequest.lastActivityAt = new Date();
          
          // Award partial points (would need points system implementation)
          const partialPoints = Math.round(referralRequest.pointsOffered * 0.3);
          referralRequest.pointsPaid = partialPoints;
          await referralRequest.save();
        } else {
          return NextResponse.json({
            error: 'Cannot mark as referred'
          }, { status: 400 });
        }
        break;
        
      case 'interview':
        console.log('🎯 Interview action - isCandidate:', isCandidate, 'status:', referralRequest.status);
        if (isCandidate) {
          // Allow interview status from pending, viewed, accepted, or referred states
          if (['pending', 'viewed', 'accepted', 'referred'].includes(referralRequest.status)) {
            referralRequest.status = 'interviewed';
            referralRequest.interviewScheduledAt = new Date();
            referralRequest.lastActivityAt = new Date();
            
            // Update pointsPaid for transaction history (interview acknowledgment)
            const interviewPoints = 50;
            referralRequest.pointsPaid = (referralRequest.pointsPaid || 0) + interviewPoints;
            
            await referralRequest.save();
            console.log('✅ Status updated to interviewed, pointsPaid updated for transaction history');
          } else {
            console.log('❌ Cannot schedule interview from current status:', referralRequest.status);
            return NextResponse.json({
              error: `Cannot schedule interview from ${referralRequest.status} status`
            }, { status: 400 });
          }
        } else {
          console.log('❌ Only candidate can update to interview status');
          return NextResponse.json({
            error: 'Only candidate can update interview status'
          }, { status: 403 });
        }
        break;
        
      case 'hire':
        if (isCandidate && ['referred', 'interview-scheduled'].includes(referralRequest.status)) {
          referralRequest.status = 'hired';
          referralRequest.hiredAt = new Date();
          referralRequest.lastActivityAt = new Date();
          
          // Update pointsPaid for transaction history (hire acknowledgment)
          const hirePoints = 200;
          referralRequest.pointsPaid = (referralRequest.pointsPaid || 0) + hirePoints;
          
          // Don't award points here - let the dedicated points API handle it
          // This prevents double-awarding when frontend calls both APIs
          console.log(`✅ Status updated to hired, pointsPaid updated for transaction history`);
          
          await referralRequest.save();
        } else {
          return NextResponse.json({
            error: 'Only candidate can acknowledge hire status'
          }, { status: 403 });
        }
        break;
        
      case 'message':
        if (newMessage) {
          await referralRequest.addMessage(currentUserId, newMessage);
        }
        break;
        
      case 'feedback':
        if (feedback && feedback.rating) {
          if (isRequester && !referralRequest.requesterFeedback.rating) {
            referralRequest.requesterFeedback = {
              rating: feedback.rating,
              comment: feedback.comment,
              submittedAt: new Date()
            };
            await referralRequest.save();
            
            // Update candidate's average rating
            const candidate = await User.findById(referralRequest.candidate);
            await candidate.addRating(feedback.rating);
            
          } else if (isCandidate && !referralRequest.candidateFeedback.rating) {
            referralRequest.candidateFeedback = {
              rating: feedback.rating,
              comment: feedback.comment,
              submittedAt: new Date()
            };
            await referralRequest.save();
          }
        }
        break;
        
      case 'hired':
        console.log('🎯 Hire action - isCandidate:', isCandidate, 'status:', referralRequest.status);
        if (isCandidate) {
          // Allow hire status from pending, viewed, accepted, interviewed, or referred states
          if (['pending', 'viewed', 'accepted', 'interviewed', 'referred'].includes(referralRequest.status)) {
            referralRequest.status = 'hired';
            referralRequest.hiredAt = new Date();
            referralRequest.lastActivityAt = new Date();
            await referralRequest.save();
            console.log('✅ Status updated to hired');
          } else {
            console.log('❌ Cannot hire from current status:', referralRequest.status);
            return NextResponse.json({
              error: `Cannot hire from ${referralRequest.status} status`
            }, { status: 400 });
          }
        } else {
          console.log('❌ Only candidate can update to hired status');
          return NextResponse.json({
            error: 'Only candidate can update hire status'
          }, { status: 403 });
        }
        break;
        
      case 'dismissed':
      case 'dismiss':
        console.log('🎯 Dismiss action - isCandidate:', isCandidate, 'status:', referralRequest.status);
        if (isCandidate) {
          // Allow dismiss from any status except already dismissed
          if (referralRequest.status !== 'dismissed') {
            referralRequest.status = 'dismissed';
            referralRequest.lastActivityAt = new Date();
            await referralRequest.save();
            console.log('✅ Status updated to dismissed');
          } else {
            console.log('❌ Request already dismissed');
            return NextResponse.json({
              error: 'Request is already dismissed'
            }, { status: 400 });
          }
        } else {
          console.log('❌ Only candidate can dismiss request');
          return NextResponse.json({
            error: 'Only candidate can dismiss request'
          }, { status: 403 });
        }
        break;
        
      default:
        return NextResponse.json({
          error: 'Invalid action'
        }, { status: 400 });
    }
    
    // Populate and return updated request
    const updatedRequest = await ReferralRequest.findById(requestId)
      .populate('requester', 'firstName lastName email')
      .populate('candidate', 'firstName lastName email')
      .populate('candidateProfile', 'fullName headline');
    
    return NextResponse.json({
      success: true,
      message: `Request ${action}ed successfully`,
      request: updatedRequest
    });
    
  } catch (error) {
    console.error('❌ Error updating request:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    return NextResponse.json(
      { 
        error: 'Failed to update request',
        details: error.message,
        type: error.name
      },
      { status: 500 }
    );
  }
}