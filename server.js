/**
 * HireLift Brevo Integration Setup
 * Main entry point for integrating Brevo email marketing with your Express backend
 */

require('dotenv').config();
const express = require('express');
const { initializeBrevo } = require('./lib/brevoService');
const { initializeCronJobs } = require('./jobs/scheduler');

// Import controllers
const authController = require('./controllers/authController');
const paymentController = require('./controllers/paymentController');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Initialize Brevo service on server startup
 */
async function initializeServices() {
  try {
    // Initialize Brevo API
    initializeBrevo();
    
    // Initialize cron jobs
    initializeCronJobs();
    
    console.log('✅ All services initialized successfully');
  } catch (error) {
    console.error('❌ Service initialization failed:', error);
    process.exit(1);
  }
}

// Authentication Routes
app.post('/api/auth/google', authController.handleFirebaseGoogleAuth);
app.post('/api/auth/signup', authController.handleEmailPasswordSignup);
app.post('/api/auth/verify-email', authController.handleEmailVerification);
app.put('/api/auth/profile', authController.handleProfileUpdate);

// Payment Routes
app.post('/api/payment/success', paymentController.handlePaymentSuccess);
app.post('/api/payment/subscription/basic', paymentController.handleBasicSubscriptionPayment);
app.post('/api/payment/onetime', paymentController.handleOneTimePayment);
app.post('/api/payment/cancel', paymentController.handleSubscriptionCancellation);
app.post('/api/payment/refund', paymentController.handleRefund);
app.post('/api/payment/webhook', paymentController.handleRazorpayWebhook);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    services: {
      brevo: !!process.env.BREVO_API_KEY,
      razorpay: !!process.env.RAZORPAY_KEY_ID
    }
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('❌ Unhandled error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`🚀 HireLift server running on port ${PORT}`);
  await initializeServices();
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('📴 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('📴 SIGINT received, shutting down gracefully');
  process.exit(0);
});

module.exports = app;