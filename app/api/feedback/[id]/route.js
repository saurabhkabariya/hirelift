import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import Feedback from '../../../../models/Feedback';

export async function PATCH(request, { params }) {
  try {
    // Connect to database
    await connectDB();

    const { id } = params;
    const body = await request.json();
    const { status } = body;

    // Validate status
    const validStatuses = ['pending', 'reviewed', 'resolved'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be: pending, reviewed, or resolved' },
        { status: 400 }
      );
    }

    // Update feedback status
    const updatedFeedback = await Feedback.findByIdAndUpdate(
      id,
      { status, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!updatedFeedback) {
      return NextResponse.json(
        { error: 'Feedback not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        message: 'Feedback status updated successfully',
        feedback: updatedFeedback
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Feedback update error:', error);

    // Handle invalid ObjectId
    if (error.name === 'CastError') {
      return NextResponse.json(
        { error: 'Invalid feedback ID' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET(request, { params }) {
  try {
    // Connect to database
    await connectDB();

    const { id } = params;

    // Get specific feedback
    const feedback = await Feedback.findById(id);

    if (!feedback) {
      return NextResponse.json(
        { error: 'Feedback not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        message: 'Feedback retrieved successfully',
        feedback
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Feedback GET error:', error);

    // Handle invalid ObjectId
    if (error.name === 'CastError') {
      return NextResponse.json(
        { error: 'Invalid feedback ID' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
