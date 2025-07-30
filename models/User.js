import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
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
  isPremium: {
    type: Boolean,
    default: false,
  },  firebaseUid: {
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

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User; 