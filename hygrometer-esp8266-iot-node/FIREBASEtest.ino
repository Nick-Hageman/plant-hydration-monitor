#include <FirebaseArduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>
#include <SoftwareSerial.h>

#define FIREBASE_HOST "bioneos-default-rtdb.firebaseio.com"
#define FIREBASE_AUTH "MbJUFxKgi3Z8a1AIw0gbvGU6LgG5oTDLw3EaxNcq"
#define WIFI_SSID "Hageman1" // Your current WiFi network SSID (can be hidden)
#define WIFI_PASSWORD "cheesepizza" // Your current WiFi network password

String myString;
int vr = A0; //resistor connected
int sdata = 0; // value stored in database

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  pinMode(vr, INPUT);
  pinMode(D0, OUTPUT);
  //Connect WIFI
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("connecting");

  // Connect to WiFi, checking status every 5 seconds
  // TODO: This can be improved to be more asynchronous
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println(WiFi.localIP());

  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
}

void loop() {
  // put your main code here, to run repeatedly:
  sdata = analogRead(vr);
  Serial.println(sdata);
  myString = String(sdata);
  Firebase.setString("Variable Resistor/Value",myString);

  if (Firebase.failed()) {
    Serial.println("Setting /Value failed :");
    Serial.println(Firebase.error());
    delay(500);
    return;
  }

  Serial.println("Setting Successful");
  Serial.println();
  delay(4000);

}
