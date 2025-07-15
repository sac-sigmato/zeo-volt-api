const mongoose = require("mongoose");
const referralSchema = new mongoose.Schema({
  referredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: String,
  phone: String,
  email: String,
  status: { type: String, default: "Pending" }, // or 'Converted', 'Rejected'
});
module.exports = mongoose.model("Referral", referralSchema);
