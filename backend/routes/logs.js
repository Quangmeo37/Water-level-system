const express = require('express');
const connectDB = require('../db');

const router = express.Router();

// Lấy lịch sử hoạt động của thiết bị theo deviceId
router.get('/:deviceId', async (req, res) => {
    const db = await connectDB();
    const deviceId = req.params.deviceId;

    // Lấy tất cả log của thiết bị
    const logs = await db.collection('logs').find({ device_id: deviceId }).toArray();
    res.json(logs);
});

// Lưu log hoạt động (bao gồm trạng thái mực nước)
router.post('/', async (req, res) => {
    const db = await connectDB();
    const log = req.body;

    // Thêm thông tin về mực nước vào log
    const logEntry = {
        device_id: log.device_id,
        water_level: log.water_level, // Mực nước
        status: log.status,           // Trạng thái máy bơm
        timestamp: new Date(),        // Thời gian hiện tại
        command: log.command,         // Lệnh (bật/tắt máy bơm)
    };

    // Lưu log vào database
    const result = await db.collection('logs').insertOne(logEntry);
    res.json(result);
});

module.exports = router;

