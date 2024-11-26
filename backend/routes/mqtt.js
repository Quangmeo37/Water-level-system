const mqtt = require('mqtt');
const connectDB = require('./db');

// Kết nối tới MQTT Broker
const mqttClient = mqtt.connect('mqtts://quang007:123456789Aa@limesquash-9rmptg.a03.euc1.aws.hivemq.cloud:8883', {
    rejectUnauthorized: false,
});

// Khi kết nối với MQTT Broker
mqttClient.on('connect', () => {
    console.log('Đã kết nối với MQTT Broker');

    // Đăng ký các topic để lắng nghe
    mqttClient.subscribe('device/#', (err) => {
        if (err) {
            console.error('Lỗi khi đăng ký topic device/#:', err);
        } else {
            console.log('Đã đăng ký topic device/#');
        }
    });

    mqttClient.subscribe('waterlevel/#', (err) => {
        if (err) {
            console.error('Lỗi khi đăng ký topic waterlevel/#:', err);
        } else {
            console.log('Đã đăng ký topic waterlevel/#');
        }
    });

    mqttClient.subscribe('control/#', (err) => {
        if (err) {
            console.error('Lỗi khi đăng ký topic control/#:', err);
        } else {
            console.log('Đã đăng ký topic control/#');
        }
    });
});

// Lắng nghe các message từ các topic đã đăng ký
mqttClient.on('message', async (topic, message) => {
    const db = await connectDB();
    const payload = JSON.parse(message.toString());

    // Xử lý các message theo từng topic

    // Topic device: Cập nhật trạng thái thiết bị
    if (topic.startsWith('device/')) {
        const deviceId = topic.split('/')[1];
        await db.collection('devices').updateOne(
            { _id: deviceId },
            { $set: { status: payload.status } }
        );
        console.log(`Cập nhật trạng thái thiết bị ${deviceId}: ${payload.status}`);
    }

    // Topic waterlevel: Cập nhật mực nước của thiết bị
    if (topic.startsWith('waterlevel/')) {
        const deviceId = topic.split('/')[1];
        await db.collection('devices').updateOne(
            { _id: deviceId },
            { $set: { water_level: payload.water_level } }
        );
        console.log(`Cập nhật mực nước cho thiết bị ${deviceId}: ${payload.water_level}`);
    }

    // Topic control: Điều khiển thiết bị (bật/tắt)
    if (topic.startsWith('control/')) {
        const deviceId = topic.split('/')[1];
        const command = payload.command;

        // Thực hiện điều khiển thiết bị
        publish(`device/${deviceId}/control`, { command });
        console.log(`Gửi lệnh ${command} đến thiết bị ${deviceId}`);
    }
});

// Hàm publish MQTT để gửi thông điệp
function publish(topic, message) {
    mqttClient.publish(topic, JSON.stringify(message));
}

module.exports = { mqttClient, publish };

