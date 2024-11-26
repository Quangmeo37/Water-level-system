const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  type: { type: String, required: true, enum: ['pump', 'sensor'] },
  status: { type: String, default: 'off', enum: ['on', 'off'] },
  threshold: {
    low: { type: Number, required: true },
    high: { type: Number, required: true },
  },
  lastStatusChange: { type: Date, default: Date.now },
});

const Device = mongoose.model('Device', deviceSchema);

module.exports = Device;
