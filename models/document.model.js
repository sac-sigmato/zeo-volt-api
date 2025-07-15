const mongoose = require("mongoose");
const documentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: String,
  fileUrl: String,
});
module.exports = mongoose.model("Document", documentSchema);
