const express = require("express");
const router = express.Router();
const Assessment = require("../models/Assessment");
const auth = require("../middleware/auth");

// CREATE new assessment
router.post("/", auth, async (req, res) => {
  try {
    const { material, energy, water, co2, recycledPercent } = req.body;
    const circularityScore = (parseFloat(recycledPercent) || 0) * 0.1;
    const assessment = await Assessment.create({
      userId: req.user.id,
      material,
      energy,
      water,
      co2,
      recycledPercent,
      circularityScore,
    });
    res.status(201).json(assessment);
  } catch (err) {
    console.error("Error creating assessment:", err.message);
    res.status(500).json({ error: "Server error while creating assessment" });
  }
});

// READ all assessments for logged-in user
router.get("/", auth, async (req, res) => {
  try {
    const assessments = await Assessment.find({ userId: req.user.id });
    res.json(assessments);
  } catch (err) {
    console.error("Error fetching assessments:", err.message);
    res.status(500).json({ error: "Server error while fetching assessments" });
  }
});

// UPDATE an assessment by ID
router.put("/:id", auth, async (req, res) => {
  try {
    const updated = await Assessment.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    console.error("Error updating assessment:", err.message);
    res.status(500).json({ error: "Server error while updating assessment" });
  }
});

// DELETE an assessment by ID
router.delete("/:id", auth, async (req, res) => {
  try {
    await Assessment.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ msg: "Assessment deleted successfully" });
  } catch (err) {
    console.error("Error deleting assessment:", err.message);
    res.status(500).json({ error: "Server error while deleting assessment" });
  }
});

module.exports = router;