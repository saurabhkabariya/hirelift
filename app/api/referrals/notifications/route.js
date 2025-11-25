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

// GET - Get notification counts for the user
export async function GET(request) {
  try {
    await connectDB();
    
    const currentUserId = await verifyToken(request);
    
    // Get user's last viewed time for requests
    const user = await User.findById(currentUserId);
    const lastViewedTime = user?.lastRequestsViewedAt || user?.createdAt;
    
    // Count new requests (received by the user since last viewed)
    const newRequestsCount = await ReferralRequest.countDocuments({
      candidate: currentUserId,
      status: 'pending',
      createdAt: { $gt: lastViewedTime }
    });
    
    // Count status changes (requests where user is involved and status changed since last viewed)
    const statusChangesCount = await ReferralRequest.countDocuments({
      $or: [
        { candidate: currentUserId },
        { requester: currentUserId }
      ],
      status: { $in: ['accepted', 'interviewed', 'hired', 'declined', 'dismissed'] },
      lastActivityAt: { $gt: lastViewedTime },
      // Exclude status changes that are just the user's own actions
      $nor: [
        {
          candidate: currentUserId,
          status: { $in: ['accepted', 'declined'] },
          lastActivityAt: { $gt: lastViewedTime }
        }
      ]
    });
    
    return NextResponse.json({
      success: true,
      newRequests: newRequestsCount,
      statusChanges: statusChangesCount,
      lastViewedTime
    });
    
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications', details: error.message },
      { status: 500 }
    );
  }
}