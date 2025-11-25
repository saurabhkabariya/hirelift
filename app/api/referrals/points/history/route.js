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
      .select('referralPoints totalPointsEarned totalPointsSpent');
    
    if (!user) {
      return NextResponse.json({
        error: 'User not found'
      }, { status: 404 });
    }

    // Get point transaction history from referral requests where points were actually earned
    // Only show requests where points were paid (earned by referrer)
    const earnedFromReferrals = await ReferralRequest.find({
      requester: currentUserId,
      pointsPaid: { $gt: 0 },
      status: { $in: ['interviewed', 'hired'] }
    })
    .select('pointsOffered pointsPaid status createdAt jobTitle company updatedAt')
    .populate('candidate', 'firstName lastName')
    .sort({ updatedAt: -1 })
    .limit(100);
    
    // Format transaction history
    const transactions = [];
    
    // Add earned points from successful referrals
    earnedFromReferrals.forEach(req => {
      let description = '';
      let statusText = '';
      
      if (req.status === 'interviewed') {
        description = `Interview acknowledged for ${req.jobTitle} at ${req.company}`;
        statusText = 'Interview';
      } else if (req.status === 'hired') {
        description = `Hire acknowledged for ${req.jobTitle} at ${req.company}`;
        statusText = 'Hire';
      }
      
      transactions.push({
        id: `earned_${req._id}_${req.status}`,
        type: 'earned',
        amount: req.pointsPaid,
        description: description,
        date: req.updatedAt || req.createdAt,
        status: req.status,
        reference: req._id.toString(),
        metadata: {
          jobTitle: req.jobTitle,
          company: req.company,
          candidate: req.candidate ? `${req.candidate.firstName} ${req.candidate.lastName}` : 'Unknown',
          milestone: statusText,
          requestType: 'referral_reward'
        }
      });
    });

    // No sample/dummy transactions - only show real transaction history
    
    // Sort by date (newest first)
    transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    return NextResponse.json({
      success: true,
      transactions: transactions.slice(0, 50), // Limit to 50 most recent
      balance: {
        current: user.referralPoints || 0,
        totalEarned: user.totalPointsEarned || 0,
        totalSpent: user.totalPointsSpent || 0
      },
      meta: {
        totalTransactions: transactions.length,
        showing: Math.min(50, transactions.length)
      }
    });
    
  } catch (error) {
    console.error('Error fetching transaction history:', error);
    
    if (error.message === 'No token provided' || error.message === 'Invalid token') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch transaction history' },
      { status: 500 }
    );
  }
}