import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  // External ID for RemoteOK jobs or other external sources
  externalId: {
    type: String,
    sparse: true, // Allow multiple null values but unique non-null values
    index: true
  },
  
  // Source of the job posting
  source: {
    type: String,
    enum: ['manual', 'remoteok'],
    required: true,
    default: 'manual'
  },
  
  // Core job information
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  
  company: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  
  location: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  
  description: {
    type: String,
    required: true,
    maxlength: 10000 // Allow HTML/markdown content
  },
  
  shortDescription: {
    type: String,
    maxlength: 300,
    trim: true
  },
  
  tags: [{
    type: String,
    trim: true,
    maxlength: 50
  }],
  
  salaryRange: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'USD'
    },
    period: {
      type: String,
      enum: ['hourly', 'monthly', 'yearly'],
      default: 'yearly'
    }
  },
  
  jobType: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship', 'freelance'],
    required: true,
    default: 'full-time'
  },
  
  // Application URL
  url: {
    type: String,
    required: true,
    trim: true
  },
  
  // Whether job is remote, hybrid, or onsite
  workMode: {
    type: String,
    enum: ['remote', 'hybrid', 'onsite'],
    default: 'remote'
  },
  
  // Experience level required
  experienceLevel: {
    type: String,
    enum: ['entry', 'mid', 'senior', 'lead', 'executive'],
    default: 'mid'
  },
  
  // Dates
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    index: true
  },
  
  // For manual jobs - track who posted
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  
  // Featured jobs appear at top
  isFeatured: {
    type: Boolean,
    default: false,
    index: true
  },
  
  // Store raw RemoteOK data for debugging/reference
  rawRemote: {
    type: mongoose.Schema.Types.Mixed,
    required: false
  },
  
  // Status for moderation
  status: {
    type: String,
    enum: ['active', 'expired', 'draft', 'rejected'],
    default: 'active',
    index: true
  },
  
  // View count for analytics
  viewCount: {
    type: Number,
    default: 0
  },
  
  // Company logo URL
  companyLogo: {
    type: String,
    trim: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound indexes for efficient queries
jobSchema.index({ source: 1, externalId: 1 }, { unique: true, sparse: true });
jobSchema.index({ status: 1, createdAt: -1 });
jobSchema.index({ tags: 1, status: 1 });
jobSchema.index({ company: 1, status: 1 });
jobSchema.index({ location: 1, status: 1 });
jobSchema.index({ jobType: 1, status: 1 });
jobSchema.index({ workMode: 1, status: 1 });

// Virtual for formatted salary
jobSchema.virtual('formattedSalary').get(function() {
  if (!this.salaryRange || (!this.salaryRange.min && !this.salaryRange.max)) {
    return 'Salary not specified';
  }
  
  const { min, max, currency = 'USD', period = 'yearly' } = this.salaryRange;
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
  
  if (min && max) {
    return `${formatter.format(min)} - ${formatter.format(max)} ${period}`;
  } else if (min) {
    return `From ${formatter.format(min)} ${period}`;
  } else if (max) {
    return `Up to ${formatter.format(max)} ${period}`;
  }
  
  return 'Competitive salary';
});

// Virtual for days since posted
jobSchema.virtual('daysAgo').get(function() {
  const now = new Date();
  const posted = new Date(this.createdAt);
  const diffTime = Math.abs(now - posted);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return '1 day ago';
  return `${diffDays} days ago`;
});

// Static method to find active jobs with filters
jobSchema.statics.findActiveJobs = function(filters = {}) {
  const query = { status: 'active', expiresAt: { $gt: new Date() } };
  
  // Add filters
  if (filters.tags && filters.tags.length > 0) {
    query.tags = { $in: filters.tags };
  }
  
  if (filters.company) {
    query.company = new RegExp(filters.company, 'i');
  }
  
  if (filters.location) {
    query.location = new RegExp(filters.location, 'i');
  }
  
  if (filters.jobType) {
    query.jobType = filters.jobType;
  }
  
  if (filters.workMode) {
    query.workMode = filters.workMode;
  }
  
  if (filters.experienceLevel) {
    query.experienceLevel = filters.experienceLevel;
  }
  
  if (filters.search) {
    query.$or = [
      { title: new RegExp(filters.search, 'i') },
      { description: new RegExp(filters.search, 'i') },
      { company: new RegExp(filters.search, 'i') },
      { tags: { $in: [new RegExp(filters.search, 'i')] } }
    ];
  }
  
  if (filters.featured) {
    query.isFeatured = true;
  }
  
  return this.find(query);
};

// Pre-save middleware to generate short description
jobSchema.pre('save', function(next) {
  if (this.description && !this.shortDescription) {
    // Strip HTML and get first 250 characters
    const stripped = this.description.replace(/<[^>]*>/g, '').trim();
    this.shortDescription = stripped.length > 250 
      ? stripped.substring(0, 250) + '...' 
      : stripped;
  }
  next();
});

export default mongoose.models.Job || mongoose.model('Job', jobSchema);