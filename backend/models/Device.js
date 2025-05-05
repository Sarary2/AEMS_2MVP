const mongoose = require('mongoose');

// Event schema for each adverse event
const eventSchema = new mongoose.Schema({
  description: { type: String, required: true },        // Device Problem
  patientProblem: { type: String },                     // Patient Problem (optional)
  eventType: { type: String, required: true },
  reportDate: { type: String },
  severity: { type: String, enum: ['Minor', 'Moderate', 'Severe'], required: true }
}, { _id: false });

// Device schema grouping events under each tracked device
const deviceSchema = new mongoose.Schema({
  deviceName: { type: String, required: true },         // Brand Name
  model: { type: String, required: true },              // Product Code (or other identifier)
  manufacturer: { type: String },
  events: [eventSchema]
}, { timestamps: true });

module.exports = mongoose.model('Device', deviceSchema);
