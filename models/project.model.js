const mongoose = require("mongoose");
const projectSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: String,
  status: String,
  description: String,
});
module.exports = mongoose.model("Project", projectSchema);
