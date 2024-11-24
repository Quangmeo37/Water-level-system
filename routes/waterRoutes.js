const express = require('express');
const router = express.Router();
const waterController = require('../controllers/waterController');

// Route để lấy lịch sử dữ liệu mức nước
router.get('/history', waterController.getWaterHistory);

module.exports = router;
