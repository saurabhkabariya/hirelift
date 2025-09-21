import { NextResponse } from 'next/server';
import { 
  handleExpiredBasicPlans,
  handleWeeklyCleanup,
  handleMonthlyReporting,
  checkIfSubscriptionExpired
} from '@/jobs/scheduler';
import { getContactsByPlanType, PLAN_TYPES } from '@/lib/brevoService';

/**
 * POST /api/cron/expired-plans
 * Manually trigger expired plan check
 */
export async function POST(request) {
  try {
    const { secret } = await request.json();
    
    // Verify secret key for security
    if (secret !== process.env.CRON_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    console.log('🔧 Manual trigger: Checking expired plans...');
    await handleExpiredBasicPlans();
    
    return NextResponse.json({
      success: true,
      message: 'Expired plans check completed',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Manual expired plans check error:', error);
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
 * GET /api/cron/status
 * Get cron job status and statistics
 */
export async function GET() {
  try {
    // Get plan distribution
    const planStats = {};
    for (const planType of Object.values(PLAN_TYPES)) {
      try {
        const contacts = await getContactsByPlanType(planType);
        planStats[planType] = contacts.length;
      } catch (error) {
        planStats[planType] = 'error';
      }
    }
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      planDistribution: planStats,
      cronJobs: {
        expiredPlansCheck: {
          schedule: '0 2 * * *', // Daily at 2 AM
          description: 'Check for expired Basic plans'
        },
        weeklyCleanup: {
          schedule: '0 3 * * 0', // Sunday at 3 AM
          description: 'Weekly data sync and cleanup'
        },
        monthlyReporting: {
          schedule: '0 4 1 * *', // 1st of month at 4 AM
          description: 'Monthly analytics and reporting'
        }
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        brevoConfigured: !!process.env.BREVO_API_KEY,
        cronSecretConfigured: !!process.env.CRON_SECRET
      }
    });
    
  } catch (error) {
    console.error('❌ Cron status error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message 
      },
      { status: 500 }
    );
  }
}