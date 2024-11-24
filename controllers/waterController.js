const express = require('express');
const WaterData = require('../models/WaterData');
const mqttClient = require('../server').mqttClient;

const router = express.Router();

// API lấy lịch sử mực nước
router.get('/history', async (req, res) => {
  try {
    const history = await WaterData.find().sort({ timestamp: -1 }).limit(50);
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching water history', error });
  }
});

// API điều khiển máy bơm
router.post('/pump', (req, res) => {
  const { status } = req.body;
  if (status !== 'ON' && status !== 'OFF') {
    return res.status(400).json({ message: 'Invalid pump status' });
  }

  mqttClient.publish('sensor/pump_control', status);
  res.json({ message: `Pump turned ${status}` });
});

module.exports = router;
