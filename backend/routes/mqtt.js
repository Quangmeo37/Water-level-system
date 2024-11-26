const mqtt = require('mqtt');
const connectDB = require('./db');

const mqttClient = mqtt.connect('mqtts://quang007:123456789Aa@limesquash-9rmptg.a03.euc1.aws.hivemq.cloud:8883', {
    rejectUnauthorized: false,
  });
  

// Khi kết nối MQTT
mqttClient.on('connect', () => {
    console.log('Đã kết nối với MQTT Broker');
});

// Lắng nghe các topic
mqttClient.on('message', async (topic, message) => {
    const db = await connectDB();
    const payload = JSON.parse(message.toString());

    // Xử lý cập nhật trạng thái mực nước
    if (topic.startsWith('device/')) {
        const deviceId = topic.split('/')[1];
        await db.collection('devices').updateOne(
            { _id: deviceId },
            { $set: { water_level: payload.water_level } }
        );
        console.log(`Cập nhật mực nước cho thiết bị ${deviceId}`);
    }
});

// Hàm publish MQTT
function publish(topic, message) {
    mqttClient.publish(topic, JSON.stringify(message));
}

module.exports = { mqttClient, publish };
