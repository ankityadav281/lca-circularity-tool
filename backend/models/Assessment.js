const mongoose = require("mongoose");

const AssessmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  material: String,
  energy: String,
  water: String,
  co2: String,
  recycledPercent: String,
  circularityScore: Number,
}, { timestamps: true });

module.exports = mongoose.model("Assessment", AssessmentSchema);
