import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: 'Please enter a valid email address'
    }
  },
  message: {
    type: String,
    required: true,
    trim: true,
    minlength: [10, 'Feedback must be at least 10 characters long'],
    maxlength: [1000, 'Feedback must be less than 1000 characters']
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: null
  },
  category: {
    type: String,
    enum: ['bug', 'feature', 'improvement', 'general', 'support'],
    default: 'general'
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'resolved'],
    default: 'pending'
  },
  userAgent: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
feedbackSchema.index({ email: 1, createdAt: -1 });
feedbackSchema.index({ status: 1 });
feedbackSchema.index({ category: 1 });

const Feedback = mongoose.models.Feedback || mongoose.model('Feedback', feedbackSchema);

export default Feedback;
