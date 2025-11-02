import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  firstName: {
    type: String,
    default: '',
    trim: true,
  },
  lastName: {
    type: String,
    default: '',
    trim: true,
  },
  password: {
    type: String,
    required: false, // Can be null for Google Auth users
  },
  auditCount: {
    type: Number,
    default: 0,
  },
  highestATSScore: {
    type: Number,
    default: 0,
  },
  isPremium: {
    type: Boolean,
    default: false,
  },
  // Free trial fields
  hasClaimedTrial: {
    type: Boolean,
    default: false,
  },
  trialStartDate: {
    type: Date,
    default: null,
  },
  trialEndDate: {
    type: Date,
    default: null,
  },
  isTrialActive: {
    type: Boolean,
    default: false,
  },
  proPlanType: {
    type: String,
    enum: ['subscription', 'onetime', 'basic', 'resume-fix', 'professional', 'premium', 'trial'],
    default: null,
  },
  planDetails: {
    type: {
      type: String,
      enum: ['basic', 'resume-fix', 'professional', 'premium'],
      default: null
    },
    purchaseType: {
      type: String,
      enum: ['subscription', 'onetime'],
      default: null
    }
  },
  purchaseDate: {
    type: Date,
    default: null,
  },
  expiryDate: {
    type: Date,
    default: null,
  },
  paymentDetails: {
    razorpay_payment_id: String,
    razorpay_order_id: String,
    amount: Number,
    currency: String,
    method: String,
    status: String,
    created_at: Date,
  },
  firebaseUid: {
    type: String,
    unique: true,
    sparse: true, // Allows multiple null values
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  verifiedAt: {
    type: Date,
  },
  otp: {
    type: String, // 6-digit OTP for email verification
  },
  otpExpiry: {
    type: Date, // OTP expiration time
  },
  otpAttempts: {
    type: Number,
    default: 0, // Track failed OTP attempts
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Update the updatedAt field on save
userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Virtual method to check if user has active premium access (including trial)
userSchema.virtual('hasActivePremium').get(function() {
  // Check if user has paid premium plan that hasn't expired
  if (this.isPremium && this.expiryDate && new Date() < this.expiryDate) {
    return true;
  }
  
  // Check if user has active trial
  if (this.isTrialActive && this.trialEndDate && new Date() < this.trialEndDate) {
    return true;
  }
  
  return false;
});

// Virtual method to get current plan status
userSchema.virtual('currentPlanStatus').get(function() {
  const now = new Date();
  
  // Check trial first
  if (this.isTrialActive && this.trialEndDate && now < this.trialEndDate) {
    const daysLeft = Math.ceil((this.trialEndDate - now) / (1000 * 60 * 60 * 24));
    return {
      type: 'trial',
      isActive: true,
      daysLeft,
      planType: 'Career Accelerator Trial'
    };
  }
  
  // Check paid plan
  if (this.isPremium && this.expiryDate && now < this.expiryDate) {
    const daysLeft = Math.ceil((this.expiryDate - now) / (1000 * 60 * 60 * 24));
    return {
      type: 'premium',
      isActive: true,
      daysLeft,
      planType: this.planDetails?.type || this.proPlanType
    };
  }
  
  return {
    type: 'free',
    isActive: false,
    daysLeft: 0,
    planType: 'Free'
  };
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;