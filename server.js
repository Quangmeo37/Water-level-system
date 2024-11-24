const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const mqtt = require('mqtt');

// Khởi tạo ứng dụng
const app = express();

// Kết nối MQTT broker
const mqttClient = mqtt.connect('mqtts://quang007:123456789Aa@limesquash-9rmptg.a03.euc1.aws.hivemq.cloud:8883', {
  rejectUnauthorized: false,
});

// Kết nối MongoDB
mongoose.connect('mongodb://localhost:27017/water_level_system', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.once('open', () => console.log('Connected to MongoDB'));

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Định nghĩa các route
const waterController = require('./controllers/waterController');
const deviceController = require('./controllers/deviceController');

app.use('/api/water', waterController);
app.use('/api/devices', deviceController);

// Lắng nghe cổng
const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Export MQTT client để dùng trong các file khác
module.exports = { mqttClient };
