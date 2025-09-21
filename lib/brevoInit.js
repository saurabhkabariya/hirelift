/**
 * HireLift Brevo Integration Initializer
 * Initialize Brevo service and start cron jobs
 */

const { initializeBrevo } = require('./lib/brevoService');

/**
 * Initialize Brevo integration
 */
async function initializeBrevoIntegration() {
  try {
    console.log('🚀 Initializing HireLift Brevo Integration...');
    
    // Check environment variables
    if (!process.env.BREVO_API_KEY) {
      throw new Error('BREVO_API_KEY environment variable is required');
    }
    
    // Initialize Brevo service
    initializeBrevo();
    
    console.log('✅ Brevo integration initialized successfully');
    console.log('📧 Email marketing automation is now active');
    
    return true;
  } catch (error) {
    console.error('❌ Failed to initialize Brevo integration:', error);
    return false;
  }
}

// Auto-initialize when this module is imported
if (typeof window === 'undefined') {
  // Only run on server-side
  initializeBrevoIntegration();
}

module.exports = {
  initializeBrevoIntegration
};