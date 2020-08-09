// defines pins numbers
const int stepPin1 = 5; //CLK+
const int dirPin1 = 3; //CW+
const int enPin1 = 8;//en+

const int stepPin2 = 11; //CLK+
const int dirPin2 = 10; //CW+
const int enPin2 = 11;//en+

String rangeString = "";         // a String to hold incoming data
String xString = "";
String yString = "";
String delayString = "";
bool toRange = false;
bool toX = false;
bool toY = false;
bool runMode = false;
bool toDelay = false;
bool stringComplete = false;  // whether the string is complete
bool abortMotor = false;

int range = 0;
int totalX = 0;
int totalY = 0;
int totalDelay = 1000;

void setup() {
  //Serial Begin
  Serial.begin(9600);
  
  //String space
  rangeString.reserve(200);
  xString.reserve(200);
  yString.reserve(200);
  delayString.reserve(200);
  
  // Sets the two pins as Outputs
  pinMode(stepPin1,OUTPUT); 
  pinMode(dirPin1,OUTPUT);
  pinMode(stepPin2,OUTPUT); 
  pinMode(dirPin2,OUTPUT);

  pinMode(enPin1,OUTPUT);
  pinMode(enPin2,OUTPUT);
  digitalWrite(enPin1,LOW);
  digitalWrite(enPin2,LOW);
}

void loop() {

  if (stringComplete) {
//    Serial.println(rangeString);
//    Serial.println(xString);
//    Serial.println(yString);
    // clear the string:
    range = rangeString.toInt();
    totalDelay = delayString.toInt();
    totalX = xString.toInt();
    totalY = yString.toInt();
    xString = "";
    yString = "";

    stringComplete = false;
  }

  if(runMode) {
    bool right = true;
    for (int i = 0; i < totalY; i++) {
      serialEvent();
      if (abortMotor)
      {
        break;
      }
      
      for (int j = 0; j < totalX; j++) {
        serialEvent();
        if (abortMotor)
        {
          break;
        }

        if (right) {
          rightMotor();
          delay(totalDelay);
          Serial.print('p');
        }
        else
        {
          leftMotor();
          delay(totalDelay);
          Serial.print('p');
        }
      }
      right = !right ;
      downMotor();
      delay(totalDelay);
      Serial.print('p');
    }
    runMode = false;
    abortMotor = false;
    Serial.print('z')
  }
  
}

void upMotor() {
  digitalWrite(dirPin1,LOW);
    for(int x = 0; x < range; x++) {
      digitalWrite(stepPin1,HIGH); 
      delayMicroseconds(1000); 
      digitalWrite(stepPin1,LOW); 
      delayMicroseconds(1000);
    }
}

void downMotor() {
  digitalWrite(dirPin1,HIGH);
    for(int x = 0; x < range; x++) {
      digitalWrite(stepPin1,HIGH); 
      delayMicroseconds(1000); 
      digitalWrite(stepPin1,LOW); 
      delayMicroseconds(1000);
    }
}

void leftMotor() {
  digitalWrite(dirPin2,LOW);
    for(int x = 0; x < range; x++) {
      digitalWrite(stepPin2,HIGH); 
      delayMicroseconds(1000); 
      digitalWrite(stepPin2,LOW); 
      delayMicroseconds(1000);
    }
}

void rightMotor() {
  digitalWrite(dirPin2,HIGH);
    for(int x = 0; x < range; x++) {
      digitalWrite(stepPin2,HIGH); 
      delayMicroseconds(1000); 
      digitalWrite(stepPin2,LOW); 
      delayMicroseconds(1000);
    }
}

void serialEvent() {
  while (Serial.available()) {
    // get the new byte:
    char inChar = (char)Serial.read();
    // add it to the inputString:

    if (inChar == 'j') {
        rangeString = "";
        toRange = true;
        toX = false;
        toDelay = false;
        toY = false;
    }

    else if (inChar == 'x') {
        toX = true;
        toRange = false;
        toDelay = false;
        toY = false;
    }

    else if (inChar == 'y') {
        toY = true;
        toRange = false;
        toX = false;
        toDelay = false;
    }

    else if (inChar == 'n') {
        delayString = "";
        toY = false;
        toRange = false;
        toX = false;
        toDelay = true;
    }

    else if (inChar == 'm') {
        runMode = true;
    }

    else if (inChar == 'u') {
        upMotor();
    }

    else if (inChar == 'd') {
        downMotor();
    }

    else if (inChar == 'l') {
        leftMotor();
    }

    else if (inChar == 'r') {
        rightMotor();
    }

    else if (inChar == 's') {
        abortMotor = true;
    }
    
    else if (toRange) {
        rangeString += inChar;
    }
    
    else if (toX){
        xString += inChar;
    }

    else if (toY){
        yString += inChar;
    }

    else if (toDelay) {
        delayString += inChar;
    }

    // if the incoming character is a newline, set a flag so the main loop can
    // do something about it:
    if (inChar == '\n') {
      stringComplete = true;
    }
  }
}
