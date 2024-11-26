const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  deviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Device', required: true },
  action: { type: String, required: true, enum: ['on', 'off', 'thresholdExceeded', 'manualOverride'] },
  status: { type: String, required: true, enum: ['success', 'failure'] },
  timestamp: { type: Date, default: Date.now },
  description: { type: String },
});

const Log = mongoose.model('Log', logSchema);

module.exports = Log;
