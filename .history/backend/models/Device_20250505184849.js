const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  name: String,
  model: String,
  status: { type: String, enum: ['Safe', 'Warning', 'Critical'], default: 'Safe' },
  events: Array
});

module.exports = mongoose.model('Device', deviceSchema);
