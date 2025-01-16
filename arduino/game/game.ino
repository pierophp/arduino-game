#include <Arduino.h>
#include <SoftwareSerial.h>
#include <Servo.h>

Servo servo;
SoftwareSerial bluetooth(10, 11);

char data;

// Led
const int greenPin = 2;
const int redPin = 3;

// Servo
const int servoPin = 5;
const bool servoEnabled = true;
const int servoInitialPos = 20;
const int servoFinalPos = 90;

void setup()
{
  bluetooth.begin(38400);
  Serial.begin(9600);
  Serial.println("Program started");
  pinMode(greenPin, OUTPUT);
  pinMode(redPin, OUTPUT);
  servo.attach(servoPin);
  servo.write(servoInitialPos);
}

void loop()
{
  if (Serial.available())
  {
    data = Serial.read();
    Serial.println(data);
  }

  if (bluetooth.available())
  {
    data = bluetooth.read();
    Serial.println(data);
  }

  if (data == '0')
  {
    digitalWrite(greenPin, LOW);
    digitalWrite(redPin, LOW);
    setServoToInitialPosition();
  }

  if (data == '1')
  {
    digitalWrite(greenPin, HIGH);
  }

  if (data == '2')
  {
    digitalWrite(redPin, HIGH);
    if (servoEnabled)
    {
      servo.write(servoFinalPos);
      delay(1000);
      setServoToInitialPosition();
    }
  }

  delay(100);
}

void setServoToInitialPosition() {
  if (!servoEnabled) return;
  
  for (int pos = servo.read(); pos >= servoInitialPos; pos--) {
    servo.write(pos);
    delay(5);
  }
}