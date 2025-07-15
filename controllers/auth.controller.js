const client = require("../utils/twilioClient"); // Adjust path as needed
const User = require("../models/user.model");
// Generate OTP via Twilio
exports.generateOTP = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ error: "Phone number is required" });
    }

    // Send OTP using Twilio Verify Service
    const verification = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verifications.create({ to: phone, channel: "sms" });

    res.json({
      message: "OTP sent successfully",
      status: verification.status,
    });
  } catch (error) {
    console.error("Twilio OTP generation error:", error);
    res.status(500).json({ error: "Failed to send OTP" });
  }
};

// Verify OTP via Twilio
exports.verifyOTP = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) {
      return res.status(400).json({ error: "Phone and OTP are required" });
    }

    // Bypass option for dev
    if (otp === "1234") {
      let user = await User.findOne({ phone });
      if (!user) {
        user = new User({ phone });
        await user.save();
      }

      return res.json({
        message: "OTP verified (bypass mode)",
        userId: user._id,
      });
    }

    // Verify OTP using Twilio
    const verificationCheck = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verificationChecks.create({ to: phone, code: otp });

    if (verificationCheck.status !== "approved") {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    // Create or fetch user
    let user = await User.findOne({ phone });
    if (!user) {
      user = new User({ phone });
      await user.save();
    }

    res.json({
      message: "OTP verified successfully",
      userId: user._id,
    });
  } catch (error) {
    console.error("Twilio OTP verification error:", error);
    res.status(500).json({ error: "Failed to verify OTP" });
  }
};

exports.updateUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update user fields if provided
    if (name) user.name = name;
    if (email) user.email = email;
    user.isVerified = true;

    await user.save();

    res.json({
      message: "User details updated successfully",
      user: {
        _id: user._id,
        phone: user.phone,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ error: "Failed to update user details" });
  }
};
const Project = require("../models/project.model");

exports.getUserProjects = async (req, res) => {
  try {
    const { userId } = req.params;
    const projects = await Project.find({ user: userId });
    res.json({ projects });
  } catch (error) {
    console.error("Get projects error:", error);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
};
const Document = require("../models/document.model");

exports.getUserDocuments = async (req, res) => {
  try {
    const { userId } = req.params;
    const documents = await Document.find({ user: userId });
    res.json({ documents });
  } catch (error) {
    console.error("Get documents error:", error);
    res.status(500).json({ error: "Failed to fetch documents" });
  }
};
const Loyalty = require("../models/loyalty.model");

exports.getLoyaltyPoints = async (req, res) => {
  try {
    const { userId } = req.params;
    const points = await Loyalty.findOne({ user: userId });
    res.json({ points });
  } catch (error) {
    console.error("Get loyalty error:", error);
    res.status(500).json({ error: "Failed to fetch loyalty points" });
  }
};
const Referral = require("../models/referral.model");

exports.submitReferral = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, phone, email } = req.body;

    const referral = new Referral({
      referredBy: userId,
      name,
      phone,
      email,
      status: "Pending",
    });

    await referral.save();
    res.json({ message: "Referral submitted successfully", referral });
  } catch (error) {
    console.error("Submit referral error:", error);
    res.status(500).json({ error: "Failed to submit referral" });
  }
};
exports.getReferrals = async (req, res) => {
  try {
    const { userId } = req.params;
    const referrals = await Referral.find({ referredBy: userId });
    res.json({ referrals });
  } catch (error) {
    console.error("Get referrals error:", error);
    res.status(500).json({ error: "Failed to fetch referrals" });
  }
};
