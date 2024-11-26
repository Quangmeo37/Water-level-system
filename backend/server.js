const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const connectDB = require('./db');
const mqttClient = require('./mqtt');
const deviceRoutes = require('./routes/devices');
const logRoutes = require('./routes/logs');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// API Routes
app.use('/devices', deviceRoutes);
app.use('/logs', logRoutes);

// Kết nối MongoDB
connectDB().then(() => {
    console.log('MongoDB đã sẵn sàng!');
    // Khởi động server
    const PORT = 4000;
    app.listen(PORT, () => {
        console.log(`Server chạy tại http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error('Lỗi kết nối MongoDB:', err);
});
