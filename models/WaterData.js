const mongoose = require('mongoose');

const waterSchema = new mongoose.Schema({
  distance: Number,
  pumpStatus: String,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('WaterData', waterSchema);
