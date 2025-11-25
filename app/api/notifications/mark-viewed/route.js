import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

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

// POST - Mark specific notification types as viewed
export async function POST(request) {
  try {
    await connectDB();
    
    const currentUserId = await verifyToken(request);
    const { type } = await request.json();
    
    const updateFields = {};
    const currentTime = new Date();
    
    // Update appropriate timestamp based on notification type
    switch (type) {
      case 'requests':
        updateFields.lastRequestsViewedAt = currentTime;
        break;
      case 'dashboard':
        updateFields.lastDashboardViewedAt = currentTime;
        break;
      case 'all':
        updateFields.lastRequestsViewedAt = currentTime;
        updateFields.lastDashboardViewedAt = currentTime;
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid notification type' },
          { status: 400 }
        );
    }
    
    await User.findByIdAndUpdate(currentUserId, updateFields);
    
    return NextResponse.json({
      success: true,
      message: `${type} notifications marked as viewed`,
      timestamp: currentTime
    });
    
  } catch (error) {
    console.error('Error marking notifications as viewed:', error);
    return NextResponse.json(
      { error: 'Failed to mark notifications as viewed', details: error.message },
      { status: 500 }
    );
  }
}