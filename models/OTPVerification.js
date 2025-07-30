import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  otp: {
    type: String,
    required: true,
  },
  otpExpiry: {
    type: Date,
    required: true,
  },
  otpAttempts: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600, // Document expires after 10 minutes (600 seconds)
  },
}, {
  timestamps: true,
});

// Create index for automatic cleanup
otpSchema.index({ otpExpiry: 1 }, { expireAfterSeconds: 0 });

const OTPVerification = mongoose.models.OTPVerification || mongoose.model('OTPVerification', otpSchema);

export default OTPVerification;
