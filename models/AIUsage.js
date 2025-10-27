import mongoose from 'mongoose';

const aiUsageSchema = new mongoose.Schema({
  date: {
    type: String, // Format: YYYY-MM-DD
    required: true,
    unique: true
  },
  totalCalls: {
    type: Number,
    default: 0,
    max: 250 // Daily limit
  },
  lastCallTimestamp: {
    type: Date,
    default: Date.now
  },
  recentCalls: [{
    timestamp: Date,
    success: Boolean,
    model: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient date queries
aiUsageSchema.index({ date: 1 });

// Auto-update timestamp on save
aiUsageSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const AIUsage = mongoose.models.AIUsage || mongoose.model('AIUsage', aiUsageSchema);

export default AIUsage;