import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import Feedback from '../../../models/Feedback';

export async function POST(request) {
  try {
    // Connect to database
    await connectDB();

    // Parse request body
    const body = await request.json();
    const { email, message, rating, category } = body;

    // Validate required fields  
    if (!email || !message) {
      return NextResponse.json(
        { error: 'Email and message are required' },
        { status: 400 }
      );
    }

    // Get user agent for debugging/analytics
    const userAgent = request.headers.get('user-agent') || '';

    // Create feedback entry
    const feedback = new Feedback({
      email: email.toLowerCase().trim(),
      message: message.trim(),
      rating: rating || null,
      category: category || 'general',
      userAgent
    });

    // Save to database
    await feedback.save();

    return NextResponse.json(
      { 
        message: 'Feedback submitted successfully!',
        id: feedback._id
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Feedback submission error:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }

    // Handle duplicate key errors (if any unique constraints)
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Duplicate entry detected' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    // Connect to database
    await connectDB();

    const { searchParams } = new URL(request.url);
    const isAdmin = searchParams.get('admin') === 'true';

    // For security, you might want to add proper admin authentication here
    // For now, we'll assume this is handled by frontend authentication
    
    if (isAdmin) {
      // Fetch all feedback for admin view
      const feedbacks = await Feedback.find({})
        .sort({ createdAt: -1 })
        .limit(100); // Limit to recent 100 feedbacks

      return NextResponse.json(
        { 
          message: 'Feedback retrieved successfully',
          feedbacks,
          total: feedbacks.length
        },
        { status: 200 }
      );
    }

    // Regular status endpoint
    return NextResponse.json(
      { message: 'Feedback API is running' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Feedback GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
