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
