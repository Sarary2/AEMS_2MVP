const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  description: String,
  eventType: String,
  reportDate: String,
  severity: String
});

const deviceSchema = new mongoose.Schema({
  deviceName: String,
  model: String,
  events: [eventSchema]
});

module.exports = mongoose.model('Device', deviceSchema);
