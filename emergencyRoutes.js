const express = require('express');
const router = express.Router();
const Emergency = require('../models/Emergency');

// ✅ POST route for submitting a new emergency report
router.post('/', async (req, res) => {
  try {
    const { description, contact, disasterType, severity } = req.body;

    const newReport = new Emergency({
      description,
      contact,
      disasterType: disasterType || 'Unknown',
      severity: severity || 'Moderate',
      timestamp: new Date(),
    });

    const savedReport = await newReport.save();
    res.status(201).json(savedReport);
  } catch (error) {
    console.error('❌ Error saving emergency report:', error);
    res.status(500).json({ message: 'Server error while saving report' });
  }
});

// ✅ GET route for fetching all emergency reports
router.get('/', async (req, res) => {
  try {
    const reports = await Emergency.find().sort({ timestamp: -1 });
    res.status(200).json(reports);
  } catch (error) {
    console.error('❌ Error fetching emergency reports:', error);
    res.status(500).json({ message: 'Server error while fetching reports' });
  }
});

// ✅ TEMPORARY: Fix old reports that are missing fields
router.get("/fixOldReports", async (req, res) => {
  try {
    const result = await Emergency.updateMany(
      {
        $or: [
          { disasterType: { $exists: false } },
          { severity: { $exists: false } }
        ]
      },
      { $set: { disasterType: "Unknown", severity: "Moderate" } }
    );
    res.json({ message: "Old reports updated successfully", result });
  } catch (error) {
    console.error("Error updating old reports:", error);
    res.status(500).json({ message: "Error updating old reports" });
  }
});

module.exports = router;
