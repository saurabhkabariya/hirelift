import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  technologies: [{
    type: String,
    trim: true
  }],
  link: {
    type: String,
    trim: true
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  isOngoing: {
    type: Boolean,
    default: false
  }
});

const experienceSchema = new mongoose.Schema({
  company: {
    type: String,
    required: true,
    trim: true
  },
  position: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  isCurrentPosition: {
    type: Boolean,
    default: false
  },
  location: {
    type: String,
    trim: true
  }
});

const educationSchema = new mongoose.Schema({
  institution: {
    type: String,
    required: true,
    trim: true
  },
  degree: {
    type: String,
    required: true,
    trim: true
  },
  field: {
    type: String,
    trim: true
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  grade: {
    type: String,
    trim: true
  }
});

const referralProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  
  // Basic Information
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  headline: {
    type: String,
    required: true,
    trim: true,
    maxlength: 150
  },
  summary: {
    type: String,
    required: true,
    maxlength: 1000
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  
  // Contact Information
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  linkedinUrl: {
    type: String,
    trim: true
  },
  githubUrl: {
    type: String,
    trim: true
  },
  portfolioUrl: {
    type: String,
    trim: true
  },
  
  // Professional Information
  skills: [{
    type: String,
    trim: true
  }],
  yearsOfExperience: {
    type: Number,
    required: true,
    min: 0
  },
  currentPosition: {
    type: String,
    trim: true
  },
  currentCompany: {
    type: String,
    trim: true
  },
  desiredRoles: [{
    type: String,
    trim: true
  }],
  salaryExpectation: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'INR'
    }
  },
  
  // Detailed Information
  experience: [experienceSchema],
  education: [educationSchema],
  projects: [projectSchema],
  
  // Certifications
  certifications: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    issuer: {
      type: String,
      required: true,
      trim: true
    },
    dateIssued: Date,
    expiryDate: Date,
    credentialId: String,
    credentialUrl: String
  }],
  
  // Languages
  languages: [{
    language: {
      type: String,
      required: true,
      trim: true
    },
    proficiency: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Native'],
      required: true
    }
  }],
  
  // Availability
  availability: {
    type: String,
    enum: ['immediate', '2weeks', '1month', '2months', 'not-looking'],
    required: true
  },
  
  // Profile Settings
  isActive: {
    type: Boolean,
    default: true
  },
  visibility: {
    type: String,
    enum: ['public', 'premium-only', 'private'],
    default: 'public'
  },
  
  // Listing History
  lastListedAt: {
    type: Date,
    default: Date.now
  },
  listingCount: {
    type: Number,
    default: 1
  },
  
  // Stats
  views: {
    type: Number,
    default: 0
  },
  referralRequests: {
    type: Number,
    default: 0
  },
  successfulReferrals: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes
referralProfileSchema.index({ skills: 1 });
referralProfileSchema.index({ location: 1 });
referralProfileSchema.index({ yearsOfExperience: 1 });
referralProfileSchema.index({ desiredRoles: 1 });
referralProfileSchema.index({ lastListedAt: -1 });
referralProfileSchema.index({ isActive: 1 });

// Virtual for profile completion percentage
referralProfileSchema.virtual('completionPercentage').get(function() {
  let completed = 0;
  const total = 15;
  
  if (this.fullName) completed++;
  if (this.headline) completed++;
  if (this.summary) completed++;
  if (this.location) completed++;
  if (this.email) completed++;
  if (this.skills && this.skills.length > 0) completed++;
  if (this.yearsOfExperience >= 0) completed++;
  if (this.experience && this.experience.length > 0) completed++;
  if (this.education && this.education.length > 0) completed++;
  if (this.projects && this.projects.length > 0) completed++;
  if (this.desiredRoles && this.desiredRoles.length > 0) completed++;
  if (this.availability) completed++;
  if (this.linkedinUrl) completed++;
  if (this.phone) completed++;
  if (this.languages && this.languages.length > 0) completed++;
  
  return Math.round((completed / total) * 100);
});

// Virtual to get user's referral points (populated from User model)
referralProfileSchema.virtual('referralPoints', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
  options: { select: 'referralPoints' }
});

// Method to check if user can list profile (based on plan and frequency)
referralProfileSchema.methods.canCreateNewListing = function(user) {
  const now = new Date();
  const lastListed = this.lastListedAt;
  
  // If user has premium plan, can list once a week
  if (user.isPremium) {
    const oneWeekAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
    return lastListed < oneWeekAgo;
  }
  
  // Free users can list once a month
  const oneMonthAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
  return lastListed < oneMonthAgo;
};

// Method to update listing
referralProfileSchema.methods.updateListing = function() {
  this.lastListedAt = new Date();
  this.listingCount = (this.listingCount || 0) + 1;
  return this.save();
};

const ReferralProfile = mongoose.models.ReferralProfile || mongoose.model('ReferralProfile', referralProfileSchema);

export default ReferralProfile;