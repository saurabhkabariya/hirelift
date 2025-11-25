import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import ReferralRequest from '@/models/ReferralRequest';

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

export async function GET(request) {
  try {
    await dbConnect();
    
    const currentUserId = await verifyToken(request);
    
    // Get user details
    const user = await User.findById(currentUserId)
      .select('referralStats totalPointsEarned totalPointsSpent');
    
    if (!user) {
      return NextResponse.json({
        error: 'User not found'
      }, { status: 404 });
    }

    // Get request counts
    const requestsSent = await ReferralRequest.countDocuments({
      requester: currentUserId
    });
    
    const requestsReceived = await ReferralRequest.countDocuments({
      candidate: currentUserId
    });
    
    const successfulReferrals = await ReferralRequest.countDocuments({
      $or: [
        { requester: currentUserId, status: 'completed' },
        { candidate: currentUserId, status: 'completed' }
      ]
    });

    // Get this month's earnings
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const thisMonthEarned = await ReferralRequest.aggregate([
      {
        $match: {
          candidate: currentUserId,
          status: 'completed',
          updatedAt: { $gte: startOfMonth }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$pointsPaid' }
        }
      }
    ]);

    // Calculate average rating
    const ratedRequests = await ReferralRequest.find({
      $or: [
        { requester: currentUserId, rating: { $exists: true, $ne: null } },
        { candidate: currentUserId, candidateRating: { $exists: true, $ne: null } }
      ]
    }).select('rating candidateRating');
    
    let totalRating = 0;
    let ratingCount = 0;
    
    ratedRequests.forEach(req => {
      if (req.rating && req.rating > 0) {
        totalRating += req.rating;
        ratingCount++;
      }
      if (req.candidateRating && req.candidateRating > 0) {
        totalRating += req.candidateRating;
        ratingCount++;
      }
    });
    
    const averageRating = ratingCount > 0 ? totalRating / ratingCount : 0;
    
    const stats = {
      requestsSent,
      requestsReceived,
      successfulReferrals,
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
      totalEarnings: user.totalPointsEarned || 0,
      thisMonthEarnings: thisMonthEarned.length > 0 ? thisMonthEarned[0].total : 0,
      totalSpent: user.totalPointsSpent || 0,
      responseRate: requestsReceived > 0 ? Math.round((successfulReferrals / requestsReceived) * 100) : 0,
      completionRate: requestsSent > 0 ? Math.round((successfulReferrals / requestsSent) * 100) : 0
    };
    
    return NextResponse.json({
      success: true,
      stats
    });
    
  } catch (error) {
    console.error('Error fetching referral stats:', error);
    
    if (error.message === 'No token provided' || error.message === 'Invalid token') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch referral stats' },
      { status: 500 }
    );
  }
}