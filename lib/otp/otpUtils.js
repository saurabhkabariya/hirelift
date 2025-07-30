// OTP generation and validation utilities
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const isOTPExpired = (createdAt, expiryMinutes = 10) => {
  const now = new Date();
  const otpCreatedTime = new Date(createdAt);
  const diffInMinutes = (now - otpCreatedTime) / (1000 * 60);
  return diffInMinutes > expiryMinutes;
};

export const validateOTPFormat = (otp) => {
  return /^\d{6}$/.test(otp);
};
