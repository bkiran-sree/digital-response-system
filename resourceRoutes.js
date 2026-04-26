// 🟢 Add a new resource
const express = require('express');
const router = express.Router();
const Resource = require('../models/Resource'); // make sure this import is correct

router.post('/add', async (req, res) => {
  try {
    const { resourceName, resourceType, quantity, location, contact, severity, status } = req.body;

    if (!resourceName || !resourceType || !quantity || !location || !contact) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newResource = new Resource({
      resourceName,
      resourceType,
      quantity,
      location,
      contact,
      severity: severity || "Low",
      status: status || "Available",
    });

    await newResource.save();
    res.status(201).json({ message: "Resource added successfully!", resource: newResource });
  } catch (error) {
    console.error("Error adding resource:", error);
    res.status(500).json({ message: "Server error while adding resource", error: error.message });
  }
});

module.exports = router; // ✅ export the router
