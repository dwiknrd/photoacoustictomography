#include <PWM.h>

//use pin 11 on the Mega instead, otherwise there is a frequency cap at 31 Hz
//int ledhijau = 9;                // the pin that the LED is attached to
int ledbiru = 13;
int dutycycle = 10;         // how bright the LED is
int brightness;
int32_t frequency = 100;//frequency (in Hz)
int frekduty[2];

void setup() {

  Serial.begin(9600);
  // put your setup code here, to run once:
 //initialize all timers except for 0, to save time keeping functions
  InitTimersSafe(); 

  //sets the frequency for the specified pin
  //SetPinFrequencySafe(ledhijau, frequency);
  //SetPinFrequencySafe(ledbiru, frequency);
  //brightness =(dutycycle*255)/100;
}


void loop() {
  if(Serial.available() >= 2){
     for(int i = 0; i < 2; i++) {
      frekduty[i] = Serial.read();
     }

     frequency = frekduty[0]*1000;
     dutycycle = frekduty[1];
     SetPinFrequencySafe(ledbiru, frequency);
     brightness =(dutycycle*255)/100;
  }
 //Serial.println(frequency);
 //Serial.println(dutycycle); 
 
 // put your main code here, to run repeatedly:
 //analogWrite(ledhijau, brightness);
 analogWrite(ledbiru, brightness);
 
}
