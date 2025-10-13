import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth';
import User from '@/models/User';
import connectDB from '@/lib/mongodb';
import { updateBrevoContact, PLAN_TYPES } from '@/lib/brevoService';

/**
 * POST /api/check-expiry
 * Check and handle expired user plans
 * Can be called by cron jobs or manually
 */
async function checkExpiryHandler(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { userEmail, checkAll = false } = body;

    console.log('🔍 Checking plan expiry...');

    let expiredCount = 0;
    let errorCount = 0;

    if (checkAll) {
      // Check all users with premium plans
      const premiumUsers = await User.find({
        isPremium: true,
        expiryDate: { $exists: true, $ne: null }
      });

      console.log(`📊 Found ${premiumUsers.length} premium users to check`);

      for (const user of premiumUsers) {
        try {
          const result = await processUserExpiry(user);
          if (result.expired) {
            expiredCount++;
          }
        } catch (error) {
          console.error(`❌ Error processing user ${user.email}:`, error);
          errorCount++;
        }
      }
    } else if (userEmail) {
      // Check specific user
      const user = await User.findOne({ email: userEmail });
      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      const result = await processUserExpiry(user);
      if (result.expired) {
        expiredCount = 1;
      }
    } else {
      return NextResponse.json(
        { error: 'Either userEmail or checkAll=true must be provided' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Expiry check completed',
      summary: {
        totalChecked: checkAll ? (await User.countDocuments({ isPremium: true })) : 1,
        expiredCount,
        errorCount
      }
    });

  } catch (error) {
    console.error('❌ Check expiry error:', error);
    
    return NextResponse.json(
      { 
        error: 'Expiry check failed',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

/**
 * Process individual user expiry
 * @param {Object} user - User document from database
 * @returns {Object} Result object with expiry status
 */
async function processUserExpiry(user) {
  try {
    const now = new Date();
    const expiryDate = user.expiryDate ? new Date(user.expiryDate) : null;
    
    // Check if plan has expired
    const isExpired = expiryDate && now >= expiryDate;
    
    if (!isExpired) {
      console.log(`✅ User ${user.email} plan still active until ${expiryDate?.toISOString()}`);
      return { expired: false, user: user.email };
    }

    console.log(`⏰ Plan expired for user: ${user.email} (expired on ${expiryDate.toISOString()})`);

    // Store previous plan info for reference
    const previousPlan = {
      proPlanType: user.proPlanType,
      planDetails: user.planDetails,
      purchaseDate: user.purchaseDate,
      expiryDate: user.expiryDate
    };

    // Update user to free plan
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        isPremium: false,
        proPlanType: null,
        planDetails: null,
        expiryDate: null,
        // Keep payment history for reference
        lastPremiumPlan: previousPlan,
        planDowngradedAt: now,
        updatedAt: now
      },
      { new: true }
    );

    console.log(`✅ User ${user.email} downgraded from ${previousPlan.proPlanType} to free plan`);

    // Update Brevo contact
    try {
      const brevoResult = await updateBrevoContact(user.email, PLAN_TYPES.FREE, {
        additionalAttributes: {
          DOWNGRADE_DATE: now.toISOString(),
          DOWNGRADE_REASON: 'plan_expired',
          PREVIOUS_PLAN: previousPlan.proPlanType || 'unknown',
          EXPIRY_DATE: null, // Clear expiry date
          PLAN_STATUS: 'free'
        }
      });
      
      if (brevoResult.success) {
        console.log(`📧 Updated Brevo contact for ${user.email}`);
      } else {
        console.error(`❌ Brevo update failed for ${user.email}:`, brevoResult.error);
      }
    } catch (brevoError) {
      console.error(`❌ Brevo integration error for ${user.email}:`, brevoError);
    }

    return { 
      expired: true, 
      user: user.email, 
      previousPlan: previousPlan.proPlanType,
      expiredOn: expiryDate.toISOString()
    };

  } catch (error) {
    console.error(`❌ Error processing expiry for user ${user.email}:`, error);
    throw error;
  }
}

// Export with authentication for manual calls
export const POST = withAuth(checkExpiryHandler);

// Export without authentication for cron job calls
export async function handleCronExpiry(requestData) {
  try {
    await connectDB();
    
    const mockRequest = {
      json: async () => requestData
    };
    
    return await checkExpiryHandler(mockRequest);
  } catch (error) {
    console.error('❌ Cron expiry check failed:', error);
    throw error;
  }
}