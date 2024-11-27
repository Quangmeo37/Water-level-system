const express = require('express');
const connectDB = require('../db');
const { publish } = require('../mqtt'); 

const router = express.Router();

// Lấy danh sách thiết bị
router.get('/', async (req, res) => {
    const db = await connectDB();
    const devices = await db.collection('devices').find().toArray();
    res.json(devices);
});

// Thêm thiết bị
router.post('/', async (req, res) => {
    const db = await connectDB();
    const newDevice = req.body;
    const result = await db.collection('devices').insertOne(newDevice);
    res.json(result);
});

// Cập nhật thiết bị
router.put('/:id', async (req, res) => {
    const db = await connectDB();
    const deviceId = req.params.id;
    const updates = req.body;
    const result = await db.collection('devices').updateOne(
        { _id: deviceId },
        { $set: updates }
    );
    res.json(result);
});

// Xóa thiết bị
router.delete('/:id', async (req, res) => {
    const db = await connectDB();
    const deviceId = req.params.id;
    const result = await db.collection('devices').deleteOne({ _id: deviceId });
    res.json(result);
});

// Điều khiển máy bơm qua MQTT
router.post('/:id/control', async (req, res) => {
    const deviceId = req.params.id;
    const { command } = req.body;
  
    const device = await Device.findById(deviceId);
    if (device) {
      publish(`device/${deviceId}/control`, { command });
      res.json({ message: `Gửi lệnh ${command} đến thiết bị ${deviceId}` });
    } else {
      res.status(404).json({ message: 'Không tìm thấy thiết bị' });
    }
  });
  
  // Điều khiển chế độ tự động và kiểm tra mực nước
  router.put('/:id/autoMode', async (req, res) => {
    const deviceId = req.params.id;
    const { autoMode, waterLevel } = req.body;  // Nhận mực nước từ request
    
    // Tìm thiết bị trong database
    const device = await Device.findById(deviceId);
    if (device) {
      // Cập nhật chế độ tự động
      await device.updateOne({ autoMode, lastStatusChange: new Date() });
  
      // Kiểm tra mực nước và gửi lệnh điều khiển máy bơm
      let command = '';
      if (waterLevel < 20) {
        command = 'off';  // Tắt máy bơm
      } else if (waterLevel > 80) {
        command = 'on';   // Bật máy bơm
      }
  
      // Gửi lệnh điều khiển máy bơm qua MQTT
      if (command) {
        publish(`device/${deviceId}/control`, { command });
      }
  
      res.json({ message: `Cập nhật chế độ tự động và lệnh điều khiển cho thiết bị ${deviceId}` });
    } else {
      res.status(404).json({ message: 'Không tìm thấy thiết bị' });
    }
  });
  
module.exports = router;
