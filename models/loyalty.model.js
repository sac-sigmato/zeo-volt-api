const mongoose = require("mongoose");
const loyaltySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  total: Number,
  used: Number,
  monthlyCredits: [
    {
      month: String,
      points: Number,
    },
  ],
});
module.exports = mongoose.model("Loyalty", loyaltySchema);
