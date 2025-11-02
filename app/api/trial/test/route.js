import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    console.log('🧪 Trial test endpoint called');
    
    // Check environment variables
    const hasJwtSecret = !!process.env.JWT_SECRET;
    const hasMongoUri = !!process.env.MONGODB_URI;
    
    console.log('Environment check:', { hasJwtSecret, hasMongoUri });
    
    return NextResponse.json({
      success: true,
      message: 'Trial test endpoint working',
      environment: {
        hasJwtSecret,
        hasMongoUri,
        nodeEnv: process.env.NODE_ENV
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Test endpoint error:', error);
    return NextResponse.json(
      { error: 'Test endpoint failed', details: error.message },
      { status: 500 }
    );
  }
}