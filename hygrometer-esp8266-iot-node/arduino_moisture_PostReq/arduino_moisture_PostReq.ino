#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include "HttpClient.h"

// NOTE: Change these values to the WiFi values for your personal WiFi
const char SSID[] =  "Hageman1"; // Your current WiFi network SSID (can be hidden)
const char PASS[] =  "cheesepizza"; // Your current WiFi network password
const char SERVER[] = "192.168.86.82"; // Your IP address on the WiFi network

// Main loop process:
//   1) Wake from sleep
//   2) Read from the sensor NUM_READS times, READ_DELAY_APART second apart
//   3) Average readings for a value and POST back to the server
//   4) Sleep for WAIT_DELAY
const int NUM_READS = 10;
const int READ_DELAY_MS = 1000;
const int WAIT_DELAY_MS = 10000;

WiFiClient client;
void setup()
{
  // Turn on serial communication for logging
  // TODO: when in production mode we will want to disable serial output to save energy
  Serial.begin(9600);
  delay(10);

  Serial.println("Connecting to ");
  Serial.println(SSID);

  int status = WL_IDLE_STATUS;
  WiFi.begin(SSID, PASS);

  // Connect to WiFi, checking status every 5 seconds
  // TODO: This can be improved to be more asynchronous
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");
  // Setup the A0 pin to read the sensor analog value using ADC
  pinMode(A0, INPUT);
  Serial.print("ESP Board MAC Address:  ");
  Serial.println(WiFi.macAddress());
}


void loop()
{  
  // Read 10 values from the sensor, 1 second apart 
  int totSum = 0;
  for (int k = 0; k < NUM_READS; k++){
    int num = analogRead(A0);
    totSum += num;
    Serial.println(num);
    // TODO: Should we go to deeper sleep here?
    delay(READ_DELAY_MS);
  }
  // This smooths out the sensor readings ten times with one second intervals
  // TODO: Let's review the reasoning behind this smoothing, not sure I understand 
  //   what we are doing here (or why). At a minimum we should get rid of the magic
  //   numbers so we can change the number of reads
  int moisture = ((totSum / NUM_READS) / 900) * 100; 
  Serial.println("Average: " + String(totSum / NUM_READS));
  
  // Open a basic HTTP connection to the server
  if (client.connect(SERVER, 3000))
  {
    Serial.println("Connected to server");
    // Create our POST request message Body content
    String postStr = "sensorVal=";
    postStr += String(totSum / NUM_READS);
    String postStr2 = "macAddress=";
    postStr2 += String(WiFi.macAddress());
    String toArray = postStr+"&"+postStr2;

    // Send our POST request
    client.print("POST /saturation HTTP/1.1\n");
    client.print("Host: 192.168.86.82\n");
    client.print("Connection: close\n");
    client.print("Content-Type: application/x-www-form-urlencoded\n");
    client.print("Content-Length: ");
    client.print(toArray.length());
    client.print("\n\n");
    client.print(toArray);
  }
  // Close our HTTP connection
  client.stop();

  Serial.println("Hooray! The request was sucessfully processed!");
  
  // Wait for an additional 50 seconds before repeating them easurement 
  // NOTE: disable this delay to enable the module to send sensor values every 10 seconds
  // TODO: We will want to ensure we can get the device into its deepest level of sleep
  //   which will shut off WiFi. We will need to review the implications of this and 
  //   how to best handle it to ensure power usage maximization.
  // https://randomnerdtutorials.com/esp8266-deep-sleep-with-arduino-ide/
  delay(WAIT_DELAY_MS);
}
