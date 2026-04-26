const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  location: {
    type: String,
    required: true,
  },
  skills: {
    type: [String],
    default: [],
  },
  availability: {
    type: String,
    enum: ['Available', 'Busy', 'Offline'],
    default: 'Available',
  },
  assignedTask: {
    type: String,
    default: 'None',
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Volunteer', volunteerSchema);
