import mongoose from 'mongoose';

const referralRequestSchema = new mongoose.Schema({
  // Core Entities
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  candidateProfile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ReferralProfile',
    required: true
  },
  
  // Job Information
  jobTitle: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  jobDescription: {
    type: String,
    required: true,
    maxlength: 2000
  },
  jobLocation: {
    type: String,
    trim: true
  },
  jobType: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship', 'freelance'],
    required: true
  },
  salaryRange: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'INR'
    }
  },
  
  // Request Details
  message: {
    type: String,
    required: true,
    maxlength: 1000
  },
  urgency: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  
  // Status Management
  status: {
    type: String,
    enum: [
      'pending',           // Initial request sent
      'viewed',           // Candidate has viewed the request
      'accepted',         // Candidate accepted the referral
      'declined',         // Candidate declined the referral
      'referred',         // Requester has made the referral
      'interview-scheduled', // Interview scheduled (legacy)
      'interviewed',      // Candidate will be interviewed
      'hired',            // Candidate was hired
      'dismissed',        // Request dismissed/not proceeding
      'rejected',         // Candidate was rejected by company
      'expired'           // Request expired
    ],
    default: 'pending'
  },
  
  // Point System
  pointsOffered: {
    type: Number,
    required: true,
    min: 10,
    max: 1000
  },
  pointsPaid: {
    type: Number,
    default: 0
  },
  bonusPoints: {
    type: Number,
    default: 0
  },
  
  // Timeline
  acceptedAt: Date,
  declinedAt: Date,
  referredAt: Date,
  interviewScheduledAt: Date,
  hiredAt: Date,
  rejectedAt: Date,
  expiryDate: {
    type: Date,
    required: true
  },
  
  // Communication
  messages: [{
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    message: {
      type: String,
      required: true,
      maxlength: 500
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Feedback
  requesterFeedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      maxlength: 500
    },
    submittedAt: Date
  },
  candidateFeedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      maxlength: 500
    },
    submittedAt: Date
  },
  
  // Metadata
  viewedAt: Date,
  lastActivityAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
referralRequestSchema.index({ requester: 1, status: 1 });
referralRequestSchema.index({ candidate: 1, status: 1 });
referralRequestSchema.index({ status: 1, expiryDate: 1 });
referralRequestSchema.index({ createdAt: -1 });
referralRequestSchema.index({ lastActivityAt: -1 });

// Virtual for request age
referralRequestSchema.virtual('age').get(function() {
  return Date.now() - this.createdAt.getTime();
});

// Virtual for days until expiry
referralRequestSchema.virtual('daysUntilExpiry').get(function() {
  const now = new Date();
  const expiry = new Date(this.expiryDate);
  const diffTime = expiry - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for total points (base + bonus)
referralRequestSchema.virtual('totalPoints').get(function() {
  return this.pointsOffered + (this.bonusPoints || 0);
});

// Method to check if request is expired
referralRequestSchema.methods.isExpired = function() {
  return new Date() > this.expiryDate;
};

// Method to accept request
referralRequestSchema.methods.accept = function() {
  if (this.status !== 'pending' && this.status !== 'viewed') {
    throw new Error('Cannot accept request in current status');
  }
  
  this.status = 'accepted';
  this.acceptedAt = new Date();
  this.lastActivityAt = new Date();
  return this.save();
};

// Method to decline request
referralRequestSchema.methods.decline = function() {
  if (this.status !== 'pending' && this.status !== 'viewed') {
    throw new Error('Cannot decline request in current status');
  }
  
  this.status = 'declined';
  this.declinedAt = new Date();
  this.lastActivityAt = new Date();
  return this.save();
};

// Method to mark as viewed
referralRequestSchema.methods.markAsViewed = function() {
  if (this.status === 'pending') {
    this.status = 'viewed';
    this.viewedAt = new Date();
    this.lastActivityAt = new Date();
    return this.save();
  }
  return Promise.resolve(this);
};

// Method to mark as referred
referralRequestSchema.methods.markAsReferred = function() {
  if (this.status !== 'accepted') {
    throw new Error('Cannot mark as referred - request not accepted');
  }
  
  this.status = 'referred';
  this.referredAt = new Date();
  this.lastActivityAt = new Date();
  return this.save();
};

// Method to add message
referralRequestSchema.methods.addMessage = function(senderId, messageText) {
  this.messages.push({
    sender: senderId,
    message: messageText,
    timestamp: new Date()
  });
  this.lastActivityAt = new Date();
  return this.save();
};

// Method to calculate point payout based on outcome
referralRequestSchema.methods.calculatePayout = function() {
  let payout = 0;
  
  switch (this.status) {
    case 'referred':
      payout = Math.round(this.pointsOffered * 0.3); // 30% for making referral
      break;
    case 'interview-scheduled':
      payout = Math.round(this.pointsOffered * 0.6); // 60% for interview
      break;
    case 'hired':
      payout = this.pointsOffered + (this.bonusPoints || 0); // Full amount + bonus
      break;
    default:
      payout = 0;
  }
  
  return payout;
};

// Pre-save middleware to set expiry date
referralRequestSchema.pre('save', function(next) {
  if (this.isNew && !this.expiryDate) {
    // Set expiry to 30 days from creation
    this.expiryDate = new Date(Date.now() + (30 * 24 * 60 * 60 * 1000));
  }
  next();
});

const ReferralRequest = mongoose.models.ReferralRequest || mongoose.model('ReferralRequest', referralRequestSchema);

export default ReferralRequest;