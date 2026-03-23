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
  jobMatchCount: {
    type: Number,
    default: 0,
  },
  highestJobMatchScore: {
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
    type: Date,
  },
  otpAttempts: {
    type: Number,
    default: 0, // Track failed OTP attempts
  },
  // Referral System Fields
  referralPoints: {
    type: Number,
    default: 0,
  },
  totalPointsEarned: {
    type: Number,
    default: 0,
  },
  totalPointsSpent: {
    type: Number,
    default: 0,
  },
  hasReferralProfile: {
    type: Boolean,
    default: false,
  },
  profileListingCount: {
    type: Number,
    default: 0,
  },
  lastProfileListedAt: {
    type: Date,
  },
  referralStats: {
    requestsSent: {
      type: Number,
      default: 0,
    },
    requestsReceived: {
      type: Number,
      default: 0,
    },
    referralsMade: {
      type: Number,
      default: 0,
    },
    successfulReferrals: {
      type: Number,
      default: 0,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    totalRatings: {
      type: Number,
      default: 0,
    }
  },
  
  // Notification tracking
  lastRequestsViewedAt: {
    type: Date,
    default: Date.now,
  },
  lastDashboardViewedAt: {
    type: Date,
    default: Date.now,
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
// Methods for referral point management
userSchema.methods.addPoints = function(points, source = 'referral') {
  this.referralPoints += points;
  this.totalPointsEarned += points;
  // Log point transaction (could be expanded to track history)
  console.log(`User ${this._id} earned ${points} points from ${source}`);
  return this.save();
};
userSchema.methods.deductPoints = function(points, purpose = 'referral_request') {
  if (this.referralPoints < points) {
    throw new Error('Insufficient points');
  }
  this.referralPoints -= points;
  this.totalPointsSpent += points;
  // Log point transaction
  console.log(`User ${this._id} spent ${points} points for ${purpose}`);
  return this.save();
};
userSchema.methods.canCreateReferralProfile = function() {
  const now = new Date();
  const lastListed = this.lastProfileListedAt;
  if (!lastListed) return true; // First time listing
  // Premium users can list once a week
  if (this.hasActivePremium) {
    const oneWeekAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
    return lastListed < oneWeekAgo;
  }
  // Free users can list once a month
  const oneMonthAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
  return lastListed < oneMonthAgo;
};
userSchema.methods.updateProfileListing = function() {
  this.lastProfileListedAt = new Date();
  this.profileListingCount = (this.profileListingCount || 0) + 1;
  this.hasReferralProfile = true;
  return this.save();
};
userSchema.methods.updateReferralStats = function(statType, increment = 1) {
  if (!this.referralStats) {
    this.referralStats = {
      requestsSent: 0,
      requestsReceived: 0,
      referralsMade: 0,
      successfulReferrals: 0,
      averageRating: 0,
      totalRatings: 0
    };
  }
  if (this.referralStats[statType] !== undefined) {
    this.referralStats[statType] += increment;
  }
  return this.save();
};
userSchema.methods.addRating = function(rating) {
  if (!this.referralStats) {
    this.referralStats = {
      requestsSent: 0,
      requestsReceived: 0,
      referralsMade: 0,
      successfulReferrals: 0,
      averageRating: 0,
      totalRatings: 0
    };
  }
  const currentTotal = this.referralStats.averageRating * this.referralStats.totalRatings;
  this.referralStats.totalRatings += 1;
  this.referralStats.averageRating = (currentTotal + rating) / this.referralStats.totalRatings;
  return this.save();
};
const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
