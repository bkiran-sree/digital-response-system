const mongoose = require('mongoose');

const EmergencySchema = new mongoose.Schema({
  description: { type: String, required: true },
  contact: { type: String, required: true },
  disasterType: { type: String, default: 'Unknown' },
  severity: { type: String, default: 'Moderate' },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Emergency', EmergencySchema);
