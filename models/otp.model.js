const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: { expires: 300 }, // Automatically delete OTP documents after 5 minutes
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
});

// Create index for phone number and expiry
otpSchema.index({ phone: 1, expiresAt: 1 });

module.exports = mongoose.model("OTP", otpSchema);
