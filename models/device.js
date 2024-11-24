// models/Device.js
const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  status: { type: String, enum: ['ON', 'OFF'], default: 'OFF' },
});

module.exports = mongoose.model('Device', deviceSchema);
