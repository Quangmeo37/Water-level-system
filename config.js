// config.js

const config = {
  // Cấu hình MongoDB
  mongoURI: 'mongodb://localhost:27017/water_level_system',

  // Cấu hình MQTT
  mqttBrokerUrl: 'mqtts://quang007:123456789Aa@limesquash-9rmptg.a03.euc1.aws.hivemq.cloud:8883',
  waterLevelTopic: 'sensor/water_level', // Topic nhận dữ liệu mực nước
  pumpControlTopic: 'sensor/pump_control', // Topic gửi tín hiệu điều khiển máy bơm
  deviceControlTopic: 'sensor/device_control', // Topic gửi tín hiệu điều khiển thiết bị khác

  // Cấu hình cổng server
  serverPort: 4000,
};

module.exports = config;
