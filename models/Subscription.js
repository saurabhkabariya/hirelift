import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },  razorpaySubscriptionId: {
    type: String,
    required: true,
    unique: true
  },
  razorpayCustomerId: {
    type: String,
    required: true,
    index: true
  },
  razorpayPlanId: {
    type: String,
    required: true
  },  status: {
    type: String,
    enum: ['active', 'pending', 'canceled', 'paused', 'completed', 'expired', 'created'],
    default: 'pending',
    index: true
  },
  startAt: {
    type: Date,
    required: true
  },
  endAt: {
    type: Date,
    required: true
  },
  // Additional subscription details
  planDetails: {
    name: String,
    amount: Number,
    currency: {
      type: String,
      default: 'INR'
    },
    period: String, // monthly, yearly, etc.
    interval: Number
  },
  // Payment tracking
  totalCount: {
    type: Number,
    default: 0
  },
  paidCount: {
    type: Number,
    default: 0
  },
  remainingCount: {
    type: Number,
    default: 0
  },
  // Webhook events tracking
  lastWebhookEvent: {
    eventId: String,
    eventType: String,
    eventTime: Date
  },
  // Cancellation details
  cancelledAt: Date,
  cancelReason: String,
  // Metadata for additional info
  metadata: {
    type: Map,
    of: String
  }
}, {
  timestamps: true
});

// Indexes for better query performance
subscriptionSchema.index({ userId: 1, status: 1 });
subscriptionSchema.index({ razorpaySubscriptionId: 1 });
subscriptionSchema.index({ status: 1, endAt: 1 });

// Instance methods
subscriptionSchema.methods.isActive = function() {
  return this.status === 'active' && this.endAt > new Date();
};

subscriptionSchema.methods.isExpired = function() {
  return this.endAt < new Date();
};

subscriptionSchema.methods.updateFromWebhook = function(webhookData) {
  if (webhookData.subscription) {
    const sub = webhookData.subscription;
    this.status = sub.status;
    this.totalCount = sub.total_count || this.totalCount;
    this.paidCount = sub.paid_count || this.paidCount;
    this.remainingCount = sub.remain_count || this.remainingCount;
    
    if (sub.start_at) {
      this.startAt = new Date(sub.start_at * 1000);
    }
    if (sub.end_at) {
      this.endAt = new Date(sub.end_at * 1000);
    }
    if (sub.cancelled_at) {
      this.cancelledAt = new Date(sub.cancelled_at * 1000);
    }
  }
  
  // Update webhook tracking
  this.lastWebhookEvent = {
    eventId: webhookData.event_id,
    eventType: webhookData.event,
    eventTime: new Date(webhookData.created_at * 1000)
  };
  
  return this.save();
};

// Static methods
subscriptionSchema.statics.findActiveByUserId = function(userId) {
  return this.findOne({
    userId,
    status: 'active',
    endAt: { $gt: new Date() }
  });
};

subscriptionSchema.statics.findByRazorpayId = function(razorpaySubscriptionId) {
  return this.findOne({ razorpaySubscriptionId });
};

// Pre-save middleware
subscriptionSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Subscription = mongoose.models.Subscription || mongoose.model('Subscription', subscriptionSchema);

export default Subscription;
