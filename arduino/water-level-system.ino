#include <ESP8266WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>

// Thông tin kết nối Wi-Fi
const char* ssid = "iPhone101";
const char* password = "123456789";

// Thông tin MQTT broker HiveMQ Cloud
const char* mqtt_server = "limesquash-9rmptg.a03.euc1.aws.hivemq.cloud";
const int mqtt_port = 8883; // Cổng mặc định cho MQTT bảo mật (TLS)
const char* mqtt_user = "quang007";
const char* mqtt_password = "123456789Aa";

const char* water_level = "/waterlevel"; // Topic mực nước
const char* control = "/control"; // Topic điều khiển
const char* deviceId = "device_1"; // Tên thiết bị

bool autoMode = false;  // Chế độ tự động, mặc định là tắt
long lastStatusChange = 0;  // Thời gian thay đổi trạng thái giải thích

WiFiClientSecure espClient;  // Client bảo mật
PubSubClient client(espClient); // MQTT client

// Hàm kết nối Wi-Fi
void setupWiFi() {
  Serial.print("Connecting to WiFi...");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("Connected to WiFi");
}

// Hàm kết nối tới MQTT broker
void reconnectMQTT() {
  while (!client.connected()) {
    Serial.print("Connecting to MQTT...");
    if (client.connect(deviceId, mqtt_user, mqtt_password)) {
      Serial.println("Connected to MQTT broker");
      client.subscribe(control);  // Đăng ký nhận thông báo điều khiển
    } else {
      Serial.print("Failed, rc=");
      Serial.print(client.state());
      Serial.println(" Retrying in 5 seconds");
      delay(5000);
    }
  }
}

// Hàm xử lý các thông báo MQTT
void callback(char* topic, byte* payload, unsigned int length) {
  String payloadStr = "";
  for (unsigned int i = 0; i < length; i++) {
    payloadStr += (char)payload[i];
  }

  if (String(topic) == control) {
    if (payloadStr == "AUTO") {
      autoMode = true;
      Serial.println("Switched to AUTO mode");
    } else if (payloadStr == "MANUAL") {
      autoMode = false;
      Serial.println("Switched to MANUAL mode");
    } else if (payloadStr == "ON") {
      // Thủ công bật thiết bị (máy bơm)
      Serial.println("Pump turned ON manually");
      // Client.publish("/control", "ON"); // Lệnh gửi cho thiết bị
    } else if (payloadStr == "OFF") {
      // Thủ công tắt thiết bị (máy bơm)
      Serial.println("Pump turned OFF manually");
      // Client.publish("/control", "OFF"); // Lệnh gửi cho thiết bị
    }
  }
}

// Hàm gửi thông tin mực nước lên MQTT
void sendWaterLevel(int level) {
  char payload[10];
  snprintf(payload, sizeof(payload), "%d", level);
  client.publish(water_level, payload);
}

void setup() {
  Serial.begin(115200);
  setupWiFi();
  
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
}

void loop() {
  if (!client.connected()) {
    reconnectMQTT();
  }
  client.loop();

  // Giả lập mực nước
  int waterLevel = random(0, 100);  // Mực nước ngẫu nhiên
  sendWaterLevel(waterLevel);  // Gửi dữ liệu mực nước

  // Kiểm tra trạng thái tự động
  if (autoMode) {
    long now = millis();
    if (now - lastStatusChange > 5000) {
      // Kiểm tra và điều khiển thiết bị tự động sau mỗi 5 giây
      if (waterLevel < 30) {
        // Giả sử điều khiển một thiết bị khi mực nước thấp
        Serial.println("Water level low, turning on the pump");
        // Client.publish("/control", "ON"); // Ví dụ gửi lệnh bật máy bơm
      } else {
        // Nếu mực nước đủ, có thể tắt máy bơm
        Serial.println("Water level OK, turning off the pump");
        // Client.publish("/control", "OFF"); // Ví dụ gửi lệnh tắt máy bơm
      }
      lastStatusChange = now;
    }
  }
  
  delay(1000);  // Tạm dừng một giây để tránh quá tải CPU
}

  long duration = pulseIn(echoPin, HIGH);
  long distance = duration * 0.034 / 2; // Tính khoảng cách (cm)
  return distance;
}
