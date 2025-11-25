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

// POST - Mark requests as viewed
export async function POST(request) {
  try {
    await connectDB();
    
    const currentUserId = await verifyToken(request);
    
    // Update user's last viewed time for requests
    await User.findByIdAndUpdate(currentUserId, {
      lastRequestsViewedAt: new Date()
    });
    
    return NextResponse.json({
      success: true,
      message: 'Notifications marked as viewed'
    });
    
  } catch (error) {
    console.error('Error marking notifications as viewed:', error);
    return NextResponse.json(
      { error: 'Failed to mark notifications as viewed', details: error.message },
      { status: 500 }
    );
  }
}