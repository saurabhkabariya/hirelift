import { NextResponse } from 'next/server';
import User from '@/models/User';
import connectDB from '@/lib/mongodb';
import { updateBrevoContact, PLAN_TYPES } from '@/lib/brevoService';

/**
 * GET /api/cron/expire-payments
 * Background job to handle expired one-time payments
 * This should be called by a cron service (Vercel Cron, GitHub Actions, etc.)
 */
export async function GET(request) {
  try {
    // Verify cron authorization
    const authHeader = request.headers.get('authorization');
    const expectedAuth = `Bearer ${process.env.CRON_SECRET}`;
    
    if (!process.env.CRON_SECRET || authHeader !== expectedAuth) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    console.log('🕐 Running one-time payment expiry job...');

    // Find users with expired payments (any plan type with expiry date)
    const now = new Date();
    const expiredUsers = await User.find({
      isPremium: true,
      expiryDate: { $exists: true, $lte: now }
    });

    console.log(`📋 Found ${expiredUsers.length} users with expired payments`);

    const results = {
      processed: 0,
      success: 0,
      errors: 0,
      details: []
    };

    for (const user of expiredUsers) {
      results.processed++;
      
      try {
        console.log(`⏰ Processing expired payment for user: ${user.email} (Plan: ${user.proPlanType})`);

        // Store previous plan type for Brevo
        const previousPlan = user.planDetails?.type || user.proPlanType || 'unknown';

        // Update user to free plan
        await User.findByIdAndUpdate(user._id, {
          isPremium: false,
          proPlanType: null,
          planDetails: null,
          expiryDate: null,
          updatedAt: new Date()
        });

        // Update Brevo contact to free plan
        try {
          await updateBrevoContact(user.email, PLAN_TYPES.FREE, {
            additionalAttributes: {
              PAYMENT_EXPIRED_DATE: now.toISOString(),
              PREVIOUS_PLAN: previousPlan,
              EXPIRY_REASON: 'payment_expired',
              DOWNGRADED_BY: 'system_cron'
            }
          });

          console.log(`✅ Successfully downgraded expired user: ${user.email}`);
          results.success++;
          results.details.push({
            email: user.email,
            status: 'success',
            expiryDate: user.expiryDate
          });

        } catch (brevoError) {
          console.error(`❌ Brevo update failed for expired user ${user.email}:`, brevoError);
          // Still count as success since user was downgraded in database
          results.success++;
          results.details.push({
            email: user.email,
            status: 'success_with_brevo_error',
            expiryDate: user.expiryDate,
            brevoError: brevoError.message
          });
        }

      } catch (error) {
        console.error(`❌ Failed to process expired user ${user.email}:`, error);
        results.errors++;
        results.details.push({
          email: user.email,
          status: 'error',
          expiryDate: user.expiryDate,
          error: error.message
        });
      }
    }

    console.log(`🎯 Expiry job completed: ${results.success} successful, ${results.errors} errors`);

    return NextResponse.json({
      success: true,
      message: 'One-time payment expiry job completed',
      timestamp: now.toISOString(),
      results: results
    });

  } catch (error) {
    console.error('❌ Cron job error:', error);
    
    return NextResponse.json({
      error: 'Cron job failed',
      message: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}