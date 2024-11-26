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

// Các topic MQTT
const char* water_level_topic = "sensor/water_level";
const char* pump_control_topic = "sensor/pump_control";

// Chân kết nối cho cảm biến và relay
#define trigPin D3
#define echoPin D5
#define relayPin D6

WiFiClientSecure espClient; // Sử dụng WiFiClientSecure để kết nối bảo mật
PubSubClient client(espClient);

void setup() {
  Serial.begin(115200);
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(relayPin, OUTPUT);
  digitalWrite(relayPin, LOW); // Bật máy bơm ban đầu

  setup_wifi();
  
  // Thiết lập máy chủ MQTT và thông tin bảo mật
  espClient.setInsecure(); // Bỏ qua chứng chỉ SSL (dùng thử nghiệm, không khuyến nghị cho sản xuất)
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  long distance = measureDistance();
  char msg[50];
  snprintf(msg, 50, "%ld", distance);
  client.publish(water_level_topic, msg); // Gửi mức nước lên topic "sensor/water_level"

  delay(500); // Gửi dữ liệu mỗi 10 giây

}

void setup_wifi() {
  delay(10);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("WiFi connected");
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    
    // Kết nối MQTT với tài khoản và mật khẩu
    if (client.connect("ESP8266Client", mqtt_user, mqtt_password)) {
      Serial.println("connected");
      client.subscribe(pump_control_topic); // Đăng ký nhận điều khiển bơm từ "sensor/pump_control"
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

void callback(char* topic, byte* payload, unsigned int length) {
  String message;
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];
  }
  Serial.print("Message received: ");
  Serial.println(message);
  if (String(topic) == pump_control_topic) {
    if (message == "OFF") {
      digitalWrite(relayPin, LOW); // Tắt máy bơm
    } else if (message == "ON") {
      digitalWrite(relayPin, HIGH); // Bật máy bơm
    }
  }
}

long measureDistance() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  long duration = pulseIn(echoPin, HIGH);
  long distance = duration * 0.034 / 2; // Tính khoảng cách (cm)
  return distance;
}
