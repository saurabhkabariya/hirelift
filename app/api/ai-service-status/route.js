import { NextResponse } from 'next/server';
import aiResumeService from '@/services/aiResumeService';
import connectDB from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    await connectDB();
    
    // Get service status and usage statistics
    const serviceStatus = await aiResumeService.getServiceStatus();
    
    return NextResponse.json({
      success: true,
      data: serviceStatus,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error getting AI service status:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to get service status',
        details: error.message 
      }, 
      { status: 500 }
    );
  }
}

// Optional: POST endpoint to manually reset usage (admin only)
export async function POST(req) {
  try {
    // Add admin authentication here if needed
    const { action } = await req.json();
    
    if (action === 'reset-usage') {
      // Implementation for resetting daily usage
      return NextResponse.json({
        success: true,
        message: 'Usage reset functionality can be implemented here'
      });
    }
    
    return NextResponse.json(
      { success: false, error: 'Invalid action' }, 
      { status: 400 }
    );
  } catch (error) {
    console.error('❌ Error processing AI service action:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process action',
        details: error.message 
      }, 
      { status: 500 }
    );
  }
}