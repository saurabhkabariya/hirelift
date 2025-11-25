import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/mongodb';
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

// GET - Get comprehensive notification counts for user
export async function GET(request) {
  try {
    await connectDB();
    
    const currentUserId = await verifyToken(request);
    
    const user = await User.findById(currentUserId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get user's last viewed timestamps
    const lastRequestsViewedAt = user.lastRequestsViewedAt || user.createdAt;
    const lastDashboardViewedAt = user.lastDashboardViewedAt || user.createdAt;

    // Count new requests received (someone sent a request to this user)
    const newReceivedRequests = await ReferralRequest.countDocuments({
      candidate: currentUserId,
      status: { $in: ['pending', 'accepted'] },
      createdAt: { $gt: lastRequestsViewedAt }
    });

    // Count status changes on requests this user sent (this user is the requester)
    const statusChangedRequests = await ReferralRequest.countDocuments({
      requester: currentUserId,
      updatedAt: { $gt: lastRequestsViewedAt },
      createdAt: { $lt: lastRequestsViewedAt } // Only count updates, not new requests
    });

    // Count pending actions (requests requiring response from this user)
    const pendingActions = await ReferralRequest.countDocuments({
      candidate: currentUserId,
      status: 'pending'
    });

    // Count requests awaiting updates from candidates (for requesters)
    // These are requests that have been updated since last dashboard view
    // and are in states where the candidate might take further action
    const awaitingUpdates = await ReferralRequest.countDocuments({
      requester: currentUserId,
      status: { $in: ['accepted', 'referred'] },
      updatedAt: { $gt: lastDashboardViewedAt }
    });

    // Count recently completed requests (for awareness)  
    const recentlyCompleted = await ReferralRequest.countDocuments({
      requester: currentUserId,
      status: { $in: ['interviewed', 'hired', 'dismissed', 'declined', 'rejected'] },
      updatedAt: { $gt: lastDashboardViewedAt }
    });

    // Debug information for awaiting updates
    const awaitingUpdatesDetails = await ReferralRequest.find({
      requester: currentUserId,
      status: { $in: ['accepted', 'referred'] },
      updatedAt: { $gt: lastDashboardViewedAt }
    }).select('status updatedAt candidateProfile').populate('candidateProfile', 'fullName');
    
    console.log('🔍 Awaiting Updates Debug:', {
      currentUserId,
      lastDashboardViewedAt,
      awaitingUpdates,
      awaitingUpdatesDetails: awaitingUpdatesDetails.map(r => ({
        status: r.status,
        updatedAt: r.updatedAt,
        candidate: r.candidateProfile?.fullName
      }))
    });

    // Recent activity for dashboard (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    const recentReceivedRequests = await ReferralRequest.countDocuments({
      candidate: currentUserId,
      createdAt: { $gte: sevenDaysAgo }
    });

    const recentSentRequests = await ReferralRequest.countDocuments({
      requester: currentUserId,
      createdAt: { $gte: sevenDaysAgo }
    });

    const recentStatusUpdates = await ReferralRequest.countDocuments({
      $or: [
        { candidate: currentUserId },
        { requester: currentUserId }
      ],
      updatedAt: { $gte: sevenDaysAgo, $gt: lastDashboardViewedAt }
    });

    return NextResponse.json({
      success: true,
      notifications: {
        // Navigation tab indicators
        requests: {
          newReceived: newReceivedRequests,
          statusChanged: statusChangedRequests,
          total: newReceivedRequests + statusChangedRequests
        },
        
        // Dashboard indicators
        dashboard: {
          pendingActions,
          awaitingUpdates,
          recentlyCompleted,
          recentActivity: recentStatusUpdates,
          total: pendingActions + awaitingUpdates + recentlyCompleted + recentStatusUpdates
        },

        // Activity summary
        activity: {
          recentReceived: recentReceivedRequests,
          recentSent: recentSentRequests,
          weeklyTotal: recentReceivedRequests + recentSentRequests
        }
      }
    });
    
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications', details: error.message },
      { status: 500 }
    );
  }
}