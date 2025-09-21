/**
 * Auth Controller Integration Examples
 * Shows how to integrate Brevo contact management with Firebase Auth and email/password signup
 */

const { updateBrevoContact, PLAN_TYPES } = require('../lib/brevoService');

/**
 * Example: Firebase Google Auth Handler
 * Called after successful Google OAuth signup/signin
 */
async function handleFirebaseGoogleAuth(req, res) {
  try {
    const { email, displayName, uid } = req.body;
    
    // Your existing Firebase auth logic here...
    
    // Extract first and last name from displayName
    const nameParts = displayName ? displayName.split(' ') : [];
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    // Add/update contact in Brevo with free plan
    const brevoResult = await updateBrevoContact(email, PLAN_TYPES.FREE, {
      firstName,
      lastName,
      additionalAttributes: {
        AUTH_METHOD: 'google',
        FIREBASE_UID: uid,
        SIGNUP_DATE: new Date().toISOString(),
        SOURCE: 'hirelift_website'
      }
    });
    
    if (brevoResult.success) {
      console.log(`📧 Brevo contact ${brevoResult.action}: ${email} (${brevoResult.planType})`);
    } else {
      console.error(`❌ Brevo contact failed for ${email}:`, brevoResult.error);
      // Don't fail the auth process, but log for monitoring
    }
    
    // Continue with your existing auth response
    res.status(200).json({
      success: true,
      message: 'Google authentication successful',
      user: {
        email,
        displayName,
        uid
      },
      brevoStatus: brevoResult.success ? 'synced' : 'failed'
    });
    
  } catch (error) {
    console.error('❌ Firebase Google Auth error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication failed',
      error: error.message
    });
  }
}

/**
 * Example: Custom Email/Password Signup Handler
 * Called after successful email/password registration
 */
async function handleEmailPasswordSignup(req, res) {
  try {
    const { email, password, firstName, lastName } = req.body;
    
    // Your existing email/password signup logic here...
    // (password hashing, user creation in database, etc.)
    
    // Add contact to Brevo with free plan
    const brevoResult = await updateBrevoContact(email, PLAN_TYPES.FREE, {
      firstName: firstName || '',
      lastName: lastName || '',
      additionalAttributes: {
        AUTH_METHOD: 'email_password',
        SIGNUP_DATE: new Date().toISOString(),
        SOURCE: 'hirelift_website',
        EMAIL_VERIFIED: false // Update this when email is verified
      }
    });
    
    if (brevoResult.success) {
      console.log(`📧 Brevo contact ${brevoResult.action}: ${email} (${brevoResult.planType})`);
    } else {
      console.error(`❌ Brevo contact failed for ${email}:`, brevoResult.error);
    }
    
    // Send welcome email (your existing logic)
    // await sendWelcomeEmail(email, firstName);
    
    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      user: {
        email,
        firstName,
        lastName
      },
      brevoStatus: brevoResult.success ? 'synced' : 'failed'
    });
    
  } catch (error) {
    console.error('❌ Email signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Account creation failed',
      error: error.message
    });
  }
}

/**
 * Example: Email Verification Handler
 * Called when user verifies their email address
 */
async function handleEmailVerification(req, res) {
  try {
    const { email, verificationToken } = req.body;
    
    // Your existing email verification logic here...
    
    // Update Brevo contact to mark email as verified
    const brevoResult = await updateBrevoContact(email, PLAN_TYPES.FREE, {
      additionalAttributes: {
        EMAIL_VERIFIED: true,
        EMAIL_VERIFIED_DATE: new Date().toISOString()
      }
    });
    
    if (brevoResult.success) {
      console.log(`📧 Email verified in Brevo: ${email}`);
    }
    
    res.status(200).json({
      success: true,
      message: 'Email verified successfully'
    });
    
  } catch (error) {
    console.error('❌ Email verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Email verification failed',
      error: error.message
    });
  }
}

/**
 * Example: User Profile Update Handler
 * Called when user updates their profile information
 */
async function handleProfileUpdate(req, res) {
  try {
    const { email, firstName, lastName, phone } = req.body;
    
    // Your existing profile update logic here...
    
    // Update Brevo contact with new information
    const currentUser = await getUserFromDatabase(email); // Your DB query
    const currentPlanType = getCurrentUserPlanType(currentUser); // Your logic
    
    const brevoResult = await updateBrevoContact(email, currentPlanType, {
      firstName: firstName || '',
      lastName: lastName || '',
      additionalAttributes: {
        PHONE: phone || '',
        PROFILE_UPDATED_DATE: new Date().toISOString()
      }
    });
    
    if (brevoResult.success) {
      console.log(`📧 Profile updated in Brevo: ${email}`);
    }
    
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully'
    });
    
  } catch (error) {
    console.error('❌ Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Profile update failed',
      error: error.message
    });
  }
}

/**
 * Helper function to determine current user plan type
 * Implement this based on your user data structure
 */
function getCurrentUserPlanType(user) {
  if (!user) return PLAN_TYPES.FREE;
  
  // Example logic - adjust based on your user schema
  if (user.subscriptionStatus === 'active') {
    switch (user.planType) {
      case 'basic': return PLAN_TYPES.BASIC;
      case 'professional': return PLAN_TYPES.PROFESSIONAL;
      case 'premium': return PLAN_TYPES.PREMIUM;
      default: return PLAN_TYPES.FREE;
    }
  }
  
  // Check for one-time purchases
  if (user.oneTimePurchases && user.oneTimePurchases.length > 0) {
    const activePurchases = user.oneTimePurchases.filter(purchase => 
      new Date(purchase.expiryDate) > new Date()
    );
    
    if (activePurchases.some(p => p.type === 'premium')) return PLAN_TYPES.PREMIUM;
    if (activePurchases.some(p => p.type === 'professional')) return PLAN_TYPES.PROFESSIONAL;
    if (activePurchases.some(p => p.type === 'resumeatsfix')) return PLAN_TYPES.RESUME_ATS_FIX;
  }
  
  return PLAN_TYPES.FREE;
}

/**
 * Placeholder for getUserFromDatabase function
 * Implement this based on your database setup
 */
async function getUserFromDatabase(email) {
  // Your database query logic here
  // Example:
  // return await User.findOne({ email });
  throw new Error('getUserFromDatabase not implemented');
}

module.exports = {
  handleFirebaseGoogleAuth,
  handleEmailPasswordSignup,
  handleEmailVerification,
  handleProfileUpdate,
  getCurrentUserPlanType
};