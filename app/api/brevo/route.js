import { NextResponse } from 'next/server';
import { updateBrevoContact, getContactsByPlanType, PLAN_TYPES } from '@/lib/brevoService';
import User from '@/models/User';
import connectDB from '@/lib/mongodb';

/**
 * GET /api/brevo/test
 * Test Brevo integration
 */
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const email = url.searchParams.get('email') || 'test@hirelift.com';
    
    // Test creating/updating a contact
    const result = await updateBrevoContact(email, PLAN_TYPES.FREE, {
      firstName: 'Test',
      lastName: 'User',
      additionalAttributes: {
        SOURCE: 'api_test',
        TEST_DATE: new Date().toISOString()
      }
    });
    
    return NextResponse.json({
      success: true,
      message: 'Brevo test completed',
      result
    });
    
  } catch (error) {
    console.error('❌ Brevo test error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message 
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/brevo/sync-users
 * Sync existing users with Brevo
 */
export async function POST(request) {
  try {
    await connectDB();
    
    const { limit = 50 } = await request.json();
    
    // Get users from database
    const users = await User.find({})
      .limit(parseInt(limit))
      .select('email isPremium proPlanType expiryDate createdAt firebaseUid');
    
    let synced = 0;
    let failed = 0;
    const results = [];
    
    for (const user of users) {
      try {
        // Determine plan type
        let planType = PLAN_TYPES.FREE;
        if (user.isPremium) {
          if (user.expiryDate && new Date(user.expiryDate) > new Date()) {
            planType = PLAN_TYPES.PREMIUM; // Active premium
          } else {
            planType = PLAN_TYPES.FREE; // Expired premium
          }
        }
        
        const brevoResult = await updateBrevoContact(user.email, planType, {
          additionalAttributes: {
            USER_ID: user._id.toString(),
            SIGNUP_DATE: user.createdAt.toISOString(),
            AUTH_METHOD: user.firebaseUid ? 'google' : 'email_password',
            SOURCE: 'manual_sync',
            SYNC_DATE: new Date().toISOString()
          }
        });
        
        if (brevoResult.success) {
          synced++;
          results.push({
            email: user.email,
            status: 'success',
            action: brevoResult.action,
            planType
          });
        } else {
          failed++;
          results.push({
            email: user.email,
            status: 'failed',
            error: brevoResult.error
          });
        }
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 200));
        
      } catch (error) {
        failed++;
        results.push({
          email: user.email,
          status: 'error',
          error: error.message
        });
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'User sync completed',
      summary: {
        total: users.length,
        synced,
        failed
      },
      results
    });
    
  } catch (error) {
    console.error('❌ User sync error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message 
      },
      { status: 500 }
    );
  }
}