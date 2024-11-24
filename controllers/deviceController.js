const express = require('express');
const Device = require('../models/Device');
const mqttClient = require('../server').mqttClient;

const router = express.Router();

// Lấy danh sách thiết bị
router.get('/', async (req, res) => {
  try {
    const devices = await Device.find();
    res.json(devices);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching devices', error });
  }
});

// Thêm thiết bị mới
router.post('/', async (req, res) => {
  try {
    const { name, description } = req.body;
    const newDevice = new Device({ name, description });
    await newDevice.save();
    res.json({ message: 'Device added successfully', device: newDevice });
  } catch (error) {
    res.status(500).json({ message: 'Error adding device', error });
  }
});

// Cập nhật thiết bị
router.put('/:id', async (req, res) => {
  try {
    const { name, description } = req.body;
    const updatedDevice = await Device.findByIdAndUpdate(req.params.id, { name, description }, { new: true });
    res.json({ message: 'Device updated successfully', device: updatedDevice });
  } catch (error) {
    res.status(500).json({ message: 'Error updating device', error });
  }
});

// Xóa thiết bị
router.delete('/:id', async (req, res) => {
  try {
    await Device.findByIdAndDelete(req.params.id);
    res.json({ message: 'Device deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting device', error });
  }
});

// Điều khiển thiết bị
router.post('/:id/control', async (req, res) => {
  try {
    const { status } = req.body;
    if (status !== 'ON' && status !== 'OFF') {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const device = await Device.findByIdAndUpdate(req.params.id, { status }, { new: true });
    mqttClient.publish(`device/${device._id}/control`, status);
    res.json({ message: `Device ${device.name} turned ${status}`, device });
  } catch (error) {
    res.status(500).json({ message: 'Error controlling device', error });
  }
});

module.exports = router;
