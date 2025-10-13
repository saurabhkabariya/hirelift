/**
 * Cron Job Scheduler for HireLift
 * Handles automated tasks like expiring Basic plans and downgrading users to free
 */

import cron from 'node-cron';
import { 
  updateBrevoContact, 
  getContactsByPlanType, 
  batchUpdatePlanType, 
  PLAN_TYPES 
} from '../lib/brevoService.js';

/**
 * Initialize all cron jobs
 */
export function initializeCronJobs() {
  console.log('🕐 Initializing cron jobs for HireLift...');
  
  // Daily check for expired Basic plans (runs at 2 AM every day)
  cron.schedule('0 2 * * *', handleExpiredBasicPlans, {
    timezone: 'Asia/Kolkata'
  });
  
  // Weekly cleanup and sync (runs every Sunday at 3 AM)
  cron.schedule('0 3 * * 0', handleWeeklyCleanup, {
    timezone: 'Asia/Kolkata'
  });
  
  // Monthly analytics and reporting (runs on 1st of every month at 4 AM)
  cron.schedule('0 4 1 * *', handleMonthlyReporting, {
    timezone: 'Asia/Kolkata'
  });
  
  console.log('✅ All cron jobs initialized successfully');
}

/**
 * Handle expired Basic plan subscriptions
 * Runs daily to check for users whose Basic plans have expired
 */
export async function handleExpiredBasicPlans() {
  try {
    console.log('🔍 Checking for expired plans...');
    
    // Use our new check-expiry API endpoint
    const { handleCronExpiry } = await import('../app/api/check-expiry/route.js');
    
    const result = await handleCronExpiry({ checkAll: true });
    
    if (result.success) {
      console.log('✅ Expired plans check completed:');
      console.log(`   - Total checked: ${result.summary.totalChecked}`);
      console.log(`   - Expired and downgraded: ${result.summary.expiredCount}`);
      console.log(`   - Errors: ${result.summary.errorCount}`);
    } else {
      console.error('❌ Expired plans check failed:', result.error);
    }

    // Also check with Brevo contacts as backup
    await checkBrevoContactsExpiry();
    
    // Log summary to your monitoring system
    await logCronJobResult('expired_plans_check', {
      totalChecked: result.summary?.totalChecked || 0,
      expiredCount: result.summary?.expiredCount || 0,
      errorCount: result.summary?.errorCount || 0,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Error in handleExpiredBasicPlans:', error);
    
    // Alert your monitoring system
    await alertCronJobError('expired_plans_check', error);
  }
}

/**
 * Backup method: Check Brevo contacts for expired plans
 */
async function checkBrevoContactsExpiry() {
  try {
    // Get all contacts with Basic plan type
    const basicContacts = await getContactsByPlanType(PLAN_TYPES.BASIC);
    
    if (basicContacts.length === 0) {
      console.log('📊 No Basic plan users found in Brevo');
      return;
    }
    
    console.log(`📊 Found ${basicContacts.length} Basic plan users in Brevo to check`);
    
    let expiredCount = 0;
    let errorCount = 0;
    
    for (const contact of basicContacts) {
      try {
        // Check if user's subscription has expired
        const isExpired = await checkIfSubscriptionExpired(contact);
        
        if (isExpired) {
          // Downgrade to free plan
          const result = await updateBrevoContact(contact.email, PLAN_TYPES.FREE, {
            additionalAttributes: {
              DOWNGRADE_DATE: new Date().toISOString(),
              DOWNGRADE_REASON: 'subscription_expired',
              PREVIOUS_PLAN: PLAN_TYPES.BASIC
            }
          });
          
          if (result.success) {
            console.log(`⬇️ Downgraded expired user in Brevo: ${contact.email}`);
            expiredCount++;
            
            // Optional: Send expiration notification email
            await sendExpirationNotification(contact.email);
            
            // Update user in database
            await updateUserPlanInDatabase(contact.email, 'free');
          } else {
            console.error(`❌ Failed to downgrade ${contact.email} in Brevo:`, result.error);
            errorCount++;
          }
        }
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 200));
        
      } catch (error) {
        console.error(`❌ Error processing ${contact.email}:`, error.message);
        errorCount++;
      }
    }
    
    console.log(`📧 Brevo contacts check completed: ${expiredCount} expired, ${errorCount} errors`);
    
  } catch (error) {
    console.error('❌ Error in checkBrevoContactsExpiry:', error);
  }
}

/**
 * Check if a user's subscription has expired
 * @param {object} contact - Brevo contact object
 * @returns {boolean} True if subscription has expired
 */
export async function checkIfSubscriptionExpired(contact) {
  try {
    // Method 1: Check expiry date in Brevo attributes
    if (contact.attributes && contact.attributes.EXPIRY_DATE) {
      const expiryDate = new Date(contact.attributes.EXPIRY_DATE);
      const now = new Date();
      return now > expiryDate;
    }
    
    // Method 2: Check subscription status in your database
    const user = await getUserFromDatabase(contact.email);
    if (user) {
      // Check subscription status
      if (user.subscriptionStatus !== 'active') {
        return true;
      }
      
      // Check expiry date
      if (user.expiryDate && new Date(user.expiryDate) < new Date()) {
        return true;
      }
      
      // Check if subscription was cancelled or failed renewal
      if (user.lastPaymentStatus === 'failed' || user.subscriptionCancelled) {
        return true;
      }
    }
    
    // Method 3: Check with Razorpay subscription status
    const subscriptionId = contact.attributes?.SUBSCRIPTION_ID;
    if (subscriptionId) {
      const isActive = await checkRazorpaySubscriptionStatus(subscriptionId);
      return !isActive;
    }
    
    // Default: Assume not expired if we can't determine status
    return false;
    
  } catch (error) {
    console.error(`❌ Error checking expiry for ${contact.email}:`, error);
    return false; // Don't downgrade on error
  }
}

/**
 * Check Razorpay subscription status
 * @param {string} subscriptionId - Razorpay subscription ID
 * @returns {boolean} True if subscription is active
 */
async function checkRazorpaySubscriptionStatus(subscriptionId) {
  try {
    // Your Razorpay API call here
    // const Razorpay = require('razorpay');
    // const razorpay = new Razorpay({...});
    // const subscription = await razorpay.subscriptions.fetch(subscriptionId);
    // return subscription.status === 'active';
    
    // Placeholder - implement based on your Razorpay setup
    console.log(`🔍 Checking Razorpay subscription: ${subscriptionId}`);
    return true; // Replace with actual check
    
  } catch (error) {
    console.error(`❌ Error checking Razorpay subscription ${subscriptionId}:`, error);
    return false;
  }
}

/**
 * Send expiration notification email
 * @param {string} email - User email
 */
async function sendExpirationNotification(email) {
  try {
    // Your email sending logic here
    console.log(`📧 Sending expiration notification to: ${email}`);
    
    // Example using your existing email service
    // await sendEmail({
    //   to: email,
    //   subject: 'Your HireLift subscription has expired',
    //   template: 'subscription_expired',
    //   data: {
    //     renewalLink: 'https://hirelift.com/pricing'
    //   }
    // });
    
  } catch (error) {
    console.error(`❌ Failed to send expiration notification to ${email}:`, error);
  }
}

/**
 * Update user plan in your database
 * @param {string} email - User email
 * @param {string} planType - New plan type
 */
async function updateUserPlanInDatabase(email, planType) {
  try {
    console.log(`💾 Updating database: ${email} -> ${planType}`);
    
    // Import User model dynamically
    const { default: User } = await import('../models/User.js');
    const { default: connectDB } = await import('../lib/mongodb.js');
    
    await connectDB();
    
    // Find user and update plan
    const user = await User.findOne({ email });
    if (!user) {
      console.error(`❌ User not found in database: ${email}`);
      return;
    }

    // Store previous plan info before updating
    const previousPlan = {
      isPremium: user.isPremium,
      proPlanType: user.proPlanType,
      planDetails: user.planDetails,
      expiryDate: user.expiryDate
    };

    const now = new Date();
    let updateData = {
      updatedAt: now
    };

    if (planType === 'free') {
      // Downgrade to free plan
      updateData = {
        ...updateData,
        isPremium: false,
        proPlanType: null,
        planDetails: null,
        expiryDate: null,
        lastPremiumPlan: previousPlan, // Store for reference
        planDowngradedAt: now
      };
    } else {
      // Upgrade to premium plan
      updateData = {
        ...updateData,
        isPremium: true,
        proPlanType: planType
      };
    }

    const updatedUser = await User.findOneAndUpdate(
      { email },
      updateData,
      { new: true }
    );

    if (updatedUser) {
      console.log(`✅ Database updated successfully for ${email}:`);
      console.log(`   - isPremium: ${updatedUser.isPremium}`);
      console.log(`   - proPlanType: ${updatedUser.proPlanType}`);
      console.log(`   - expiryDate: ${updatedUser.expiryDate}`);
    } else {
      console.error(`❌ Failed to update user in database: ${email}`);
    }
    
  } catch (error) {
    console.error(`❌ Failed to update database for ${email}:`, error);
  }
}

/**
 * Weekly cleanup and sync
 * Runs every Sunday to clean up data and sync between systems
 */
export async function handleWeeklyCleanup() {
  try {
    console.log('🧹 Starting weekly cleanup...');
    
    // 1. Sync user data between database and Brevo
    await syncDatabaseWithBrevo();
    
    // 2. Clean up old temporary data
    await cleanupOldData();
    
    // 3. Generate weekly reports
    await generateWeeklyReport();
    
    console.log('✅ Weekly cleanup completed');
    
  } catch (error) {
    console.error('❌ Error in weekly cleanup:', error);
  }
}

/**
 * Monthly reporting
 * Runs on the first day of each month
 */
export async function handleMonthlyReporting() {
  try {
    console.log('📊 Generating monthly reports...');
    
    // Get plan distribution
    const planDistribution = await getPlanDistribution();
    
    // Calculate revenue metrics
    const revenueMetrics = await calculateMonthlyRevenue();
    
    // Generate churn analysis
    const churnAnalysis = await analyzeChurn();
    
    console.log('📈 Monthly reports generated:', {
      planDistribution,
      revenueMetrics,
      churnAnalysis
    });
    
  } catch (error) {
    console.error('❌ Error in monthly reporting:', error);
  }
}

/**
 * Get distribution of users across plan types
 */
async function getPlanDistribution() {
  try {
    const distribution = {};
    
    for (const planType of Object.values(PLAN_TYPES)) {
      const contacts = await getContactsByPlanType(planType);
      distribution[planType] = contacts.length;
    }
    
    return distribution;
  } catch (error) {
    console.error('❌ Error getting plan distribution:', error);
    return {};
  }
}

/**
 * Sync database with Brevo contacts
 */
async function syncDatabaseWithBrevo() {
  try {
    console.log('🔄 Syncing database with Brevo...');
    
    // Your sync logic here
    // 1. Get all users from database
    // 2. Compare with Brevo contacts
    // 3. Update any discrepancies
    
    console.log('✅ Database sync completed');
  } catch (error) {
    console.error('❌ Database sync error:', error);
  }
}

/**
 * Clean up old temporary data
 */
async function cleanupOldData() {
  try {
    console.log('🗑️ Cleaning up old data...');
    
    // Your cleanup logic here
    // 1. Remove old logs
    // 2. Clean temporary files
    // 3. Archive old records
    
    console.log('✅ Data cleanup completed');
  } catch (error) {
    console.error('❌ Data cleanup error:', error);
  }
}

/**
 * Generate weekly report
 */
async function generateWeeklyReport() {
  try {
    // Your weekly reporting logic here
    console.log('📋 Weekly report generated');
  } catch (error) {
    console.error('❌ Weekly report error:', error);
  }
}

/**
 * Calculate monthly revenue metrics
 */
async function calculateMonthlyRevenue() {
  try {
    // Your revenue calculation logic here
    return {
      totalRevenue: 0,
      newSubscriptions: 0,
      upgrades: 0,
      cancellations: 0
    };
  } catch (error) {
    console.error('❌ Revenue calculation error:', error);
    return {};
  }
}

/**
 * Analyze churn
 */
async function analyzeChurn() {
  try {
    // Your churn analysis logic here
    return {
      churnRate: 0,
      topChurnReasons: []
    };
  } catch (error) {
    console.error('❌ Churn analysis error:', error);
    return {};
  }
}

/**
 * Log cron job results for monitoring
 */
async function logCronJobResult(jobName, result) {
  try {
    // Your logging logic here
    console.log(`📊 Cron job result logged: ${jobName}`, result);
  } catch (error) {
    console.error('❌ Failed to log cron job result:', error);
  }
}

/**
 * Alert about cron job errors
 */
async function alertCronJobError(jobName, error) {
  try {
    // Your alerting logic here (email, Slack, etc.)
    console.error(`🚨 Cron job alert: ${jobName}`, error);
  } catch (alertError) {
    console.error('❌ Failed to send cron job alert:', alertError);
  }
}

/**
 * Placeholder for getUserFromDatabase function
 */
async function getUserFromDatabase(email) {
  // Implement based on your database setup
  // return await User.findOne({ email });
  return null;
}

/**
 * Manual trigger for testing expired plans check
 */
export async function manualCheckExpiredPlans() {
  console.log('🔧 Manual trigger: Checking expired plans...');
  await handleExpiredBasicPlans();
}

/**
 * Manual trigger for testing weekly cleanup
 */
export async function manualWeeklyCleanup() {
  console.log('🔧 Manual trigger: Weekly cleanup...');
  await handleWeeklyCleanup();
}