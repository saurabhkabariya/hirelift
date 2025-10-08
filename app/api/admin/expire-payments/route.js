import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth';
import User from '@/models/User';
import connectDB from '@/lib/mongodb';
import { updateBrevoContact, PLAN_TYPES } from '@/lib/brevoService';

/**
 * POST /api/admin/expire-payments
 * Manual trigger to handle expired one-time payments (admin only)
 */
async function expirePaymentsHandler(request) {
  try {
    await connectDB();
    
    const { user } = request.auth;
    
    // Check if user is admin (you should implement proper admin check)
    if (!user.email.includes('admin') && user.email !== 'admin@hirelift.com') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    console.log('🕐 Manually running payment expiry job...');

    // Find users with expired payments (any plan with expiry date)
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

        // Store previous plan for Brevo
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
              DOWNGRADED_BY: 'admin_manual'
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

    console.log(`🎯 Manual expiry job completed: ${results.success} successful, ${results.errors} errors`);

    return NextResponse.json({
      success: true,
      message: 'Manual one-time payment expiry job completed',
      timestamp: now.toISOString(),
      results: results
    });

  } catch (error) {
    console.error('❌ Manual expiry job error:', error);
    
    return NextResponse.json({
      error: 'Manual expiry job failed',
      message: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export const POST = withAuth(expirePaymentsHandler);