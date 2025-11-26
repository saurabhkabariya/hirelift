import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import ReferralRequest from '@/models/ReferralRequest';

const JWT_SECRET = process.env.JWT_SECRET;

// Verify JWT token and get user (optional for leaderboard)
async function verifyToken(request, required = true) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    if (required) {
      throw new Error('No token provided');
    }
    return null;
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded.userId;
  } catch (error) {
    if (required) {
      throw new Error('Invalid token');
    }
    return null;
  }
}

// GET - Get user's point balance and history
export async function GET(request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'balance' or 'history' or 'leaderboard'
    
    if (type === 'leaderboard') {
      // Leaderboard is public - no authentication required
      const topUsers = await User.find({
        referralPoints: { $gt: 0 }
      })
      .select('firstName lastName referralPoints totalPointsEarned referralStats.successfulReferrals referralStats.averageRating')
      .sort({ totalPointsEarned: -1 })
      .limit(20);
      
      return NextResponse.json({
        success: true,
        leaderboard: topUsers.map((user, index) => ({
          rank: index + 1,
          name: `${user.firstName} ${user.lastName}`,
          points: user.referralPoints,
          totalEarned: user.totalPointsEarned,
          successfulReferrals: user.referralStats?.successfulReferrals || 0,
          averageRating: user.referralStats?.averageRating || 0
        }))
      });
    }
    
    // For other types, authentication is required
    const currentUserId = await verifyToken(request, true);
    
    // Get user details
    const user = await User.findById(currentUserId)
      .select('referralPoints totalPointsEarned totalPointsSpent referralStats');
    
    if (!user) {
      return NextResponse.json({
        error: 'User not found'
      }, { status: 404 });
    }
    
    if (type === 'history') {
      // Get point transaction history from referral requests
      const sentRequests = await ReferralRequest.find({
        requester: currentUserId,
        pointsOffered: { $gt: 0 }
      })
      .select('pointsOffered pointsPaid status createdAt jobTitle company')
      .sort({ createdAt: -1 })
      .limit(50);
      
      const receivedRequests = await ReferralRequest.find({
        candidate: currentUserId,
        pointsPaid: { $gt: 0 }
      })
      .select('pointsOffered pointsPaid status createdAt jobTitle company')
      .populate('requester', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(50);
      
      // Format transaction history
      const transactions = [];
      
      // Add spent points (requests sent)
      sentRequests.forEach(req => {
        transactions.push({
          type: 'spent',
          amount: -req.pointsOffered,
          description: `Referral request for ${req.jobTitle} at ${req.company}`,
          date: req.createdAt,
          status: req.status,
          requestId: req._id
        });
      });
      
      // Add earned points (requests received)
      receivedRequests.forEach(req => {
        transactions.push({
          type: 'earned',
          amount: req.pointsPaid,
          description: `Referral payment for ${req.jobTitle} at ${req.company}`,
          date: req.createdAt,
          status: req.status,
          requester: `${req.requester.firstName} ${req.requester.lastName}`,
          requestId: req._id
        });
      });
      
      // Sort by date
      transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      return NextResponse.json({
        success: true,
        balance: {
          current: user.referralPoints,
          totalEarned: user.totalPointsEarned,
          totalSpent: user.totalPointsSpent
        },
        transactions
      });
    }
    
    // Default: return balance only
    return NextResponse.json({
      success: true,
      balance: {
        current: user.referralPoints,
        totalEarned: user.totalPointsEarned,
        totalSpent: user.totalPointsSpent,
        stats: user.referralStats
      }
    });
    
  } catch (error) {
    console.error('Error fetching points:', error);
    return NextResponse.json(
      { error: 'Failed to fetch points data' },
      { status: 500 }
    );
  }
}

// POST - Add points to user (admin function or rewards)
export async function POST(request) {
  try {
    await dbConnect();
    
    const currentUserId = await verifyToken(request);
    const { amount, reason = 'manual_addition', targetUserId } = await request.json();
    
    if (!amount || amount <= 0) {
      return NextResponse.json({
        error: 'Invalid point amount'
      }, { status: 400 });
    }
    
    // For now, only allow users to add points to themselves
    // In future, can add admin role checking
    const userId = targetUserId || currentUserId;
    
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({
        error: 'User not found'
      }, { status: 404 });
    }
    
    // Add points
    await user.addPoints(amount, reason);
    
    return NextResponse.json({
      success: true,
      message: `Added ${amount} points`,
      newBalance: user.referralPoints
    });
    
  } catch (error) {
    console.error('Error adding points:', error);
    return NextResponse.json(
      { error: 'Failed to add points' },
      { status: 500 }
    );
  }
}

// PUT - Handle point rewards for specific actions
export async function PUT(request) {
  try {
    await dbConnect();
    
    const currentUserId = await verifyToken(request);
    const requestBody = await request.json();
    console.log('📦 Points API request body:', requestBody);
    
    // Handle both old format (action, metadata) and new format (points, action, requestId)
    const { action, metadata, points: requestedPoints, requestId } = requestBody;
    
    // Determine who should receive the points
    let targetUserId = currentUserId;
    
    // For referral-related actions, award points to the REFERRER, not the candidate
    // The referrer is the one who should get rewarded when candidate acknowledges milestones
    if ((action === 'interview' || action === 'interviewed' || action === 'hire' || action === 'hired') && requestId) {
      console.log('🔍 Looking up referral request to determine referrer (who should get points):', requestId);
      
      try {
        const referralRequest = await ReferralRequest.findById(requestId);
        if (referralRequest) {
          // FIXED: Points should go to the REFERRER (requester), not the candidate
          // The referrer is rewarded when the candidate acknowledges referral milestones
          targetUserId = referralRequest.requester.toString();
          console.log('🎯 Points will be awarded to REFERRER:', targetUserId, 'when candidate', currentUserId, 'acknowledges action');
        }
      } catch (err) {
        console.warn('⚠️ Could not find referral request, defaulting to current user');
      }
    }
    
    const user = await User.findById(targetUserId);
    if (!user) {
      return NextResponse.json({
        error: 'User not found'
      }, { status: 404 });
    }
    
    let pointsAwarded = 0;
    let description = '';
    
    console.log('🎯 Processing points action:', action, 'requested points:', requestedPoints, 'for user:', targetUserId);
    
    switch (action) {
      case 'profile_completion':
        // Award points for completing profile sections
        pointsAwarded = 50;
        description = 'Profile completion bonus';
        break;
        
      case 'weekly_activity':
        // Weekly activity bonus
        pointsAwarded = 25;
        description = 'Weekly activity bonus';
        break;
        
      case 'high_rating':
        // Bonus for maintaining high rating
        if (user.referralStats?.averageRating >= 4.5 && user.referralStats?.totalRatings >= 5) {
          pointsAwarded = 75;
          description = 'High rating bonus';
        }
        break;
        
      case 'referral_milestone':
        // Milestone bonuses
        const milestones = [5, 10, 25, 50, 100];
        const currentReferrals = user.referralStats?.successfulReferrals || 0;
        
        if (milestones.includes(currentReferrals)) {
          pointsAwarded = currentReferrals * 10; // 50, 100, 250, 500, 1000
          description = `${currentReferrals} referrals milestone bonus`;
        }
        break;
        
      case 'interview':
      case 'interviewed':
        // Points for moving candidate to interview stage
        pointsAwarded = requestedPoints || 50;
        description = 'Referral interview acknowledgment';
        
        // 📊 Update referrals made count for REFERRER (first milestone reached)
        console.log('📈 Incrementing referrals made count for referrer:', targetUserId);
        await user.updateReferralStats('referralsMade', 1);
        break;
        
      case 'hire':
      case 'hired':
        // Points for successful hire acknowledgment by candidate
        pointsAwarded = requestedPoints || 200;
        description = 'Referral hire acknowledgment';
        
        // 🎯 Update successful referrals count for REFERRER
        console.log('📈 Incrementing successful referrals count for referrer:', targetUserId);
        await user.updateReferralStats('successfulReferrals', 1);
        break;
        
      case 'dismiss':
      case 'dismissed':
        // No points for dismissal, but we handle it gracefully
        pointsAwarded = requestedPoints || 0;
        description = 'Referral dismissed';
        break;
        
      default:
        return NextResponse.json({
          error: 'Invalid action'
        }, { status: 400 });
    }
    
    if (pointsAwarded > 0) {
      console.log('💰 Awarding points:', pointsAwarded, 'for action:', action);
      await user.addPoints(pointsAwarded, description);
      
      // 🎉 Check for first successful referral bonus for REFERRER (after stats are updated)
      if ((action === 'hire' || action === 'hired') && user.referralStats?.successfulReferrals === 1) {
        const firstReferralBonus = 100;
        console.log('🎊 Awarding first referral bonus to referrer:', firstReferralBonus, 'points');
        await user.addPoints(firstReferralBonus, 'First successful referral bonus');
        pointsAwarded += firstReferralBonus;
        description += ' + First referral bonus!';
      }
      
      console.log('✅ Points awarded successfully');
      
      return NextResponse.json({
        success: true,
        pointsAwarded,
        description,
        newBalance: user.referralPoints
      });
    }

    console.log('ℹ️ No points awarded for action:', action);
    return NextResponse.json({
      success: true,
      pointsAwarded: 0,
      message: 'No points awarded for this action'
    });  } catch (error) {
    console.error('Error processing reward:', error);
    return NextResponse.json(
      { error: 'Failed to process reward' },
      { status: 500 }
    );
  }
}