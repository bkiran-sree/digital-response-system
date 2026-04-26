// Placeholder for routes/volunteerRoutes.js
const express = require('express');
const router = express.Router();
const Volunteer = require('../models/Volunteer');

// 🟢 Add new volunteer
router.post('/add', async (req, res) => {
  try {
    const newVolunteer = new Volunteer(req.body);
    await newVolunteer.save();
    res.status(201).json({ message: "Volunteer added successfully!", volunteer: newVolunteer });
  } catch (error) {
    res.status(500).json({ message: "Error adding volunteer", error: error.message });
  }
});

// 🟢 Get all volunteers
router.get('/', async (req, res) => {
  try {
    const volunteers = await Volunteer.find().sort({ joinedAt: -1 });
    res.json(volunteers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching volunteers", error: error.message });
  }
});

// 🟡 Update volunteer status or assigned task
router.put('/:id', async (req, res) => {
  try {
    const updated = await Volunteer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Volunteer not found" });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error updating volunteer", error: error.message });
  }
});

// 🔴 Delete volunteer
router.delete('/:id', async (req, res) => {
  try {
    await Volunteer.findByIdAndDelete(req.params.id);
    res.json({ message: "Volunteer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting volunteer", error: error.message });
  }
});

module.exports = router;
