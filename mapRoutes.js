// routes/mapRoutes.js
const express = require("express");
const router = express.Router();

// Import your Mongoose models
const Emergency = require("../models/Emergency");
const Resource = require("../models/Resource");
const Volunteer = require("../models/Volunteer");

// ✅ Fetch all emergencies, resources, and volunteers for map display
router.get("/mapdata", async (req, res) => {
  try {
    const emergencies = await Emergency.find();
    const resources = await Resource.find();
    const volunteers = await Volunteer.find();

    res.json({
      emergencies,
      resources,
      volunteers,
    });
  } catch (err) {
    console.error("Error fetching map data:", err);
    res.status(500).json({ message: "Failed to load map data" });
  }
});

module.exports = router;
