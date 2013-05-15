
/* Emil, Kaare og JCs Quizshow

Ret jeres Gruppenummer i integeren groupnumber.
Knappe i pins 2, 3 og 4.
*/

int groupnumber = 0;
long lastpress = 0;
int inByte = 0;         // incoming serial byte
char answer = '0';

void setup()
{
  // start serial port at 9600 bps:
  Serial.begin(9600);
  pinMode(2, INPUT);   // digital sensore
  pinMode(3, INPUT);   
  pinMode(4, INPUT);   

  digitalWrite(2, INPUT);
  digitalWrite(3, INPUT);
  digitalWrite(4, INPUT);
  
  
  establishContact();  // send a byte to establish contact until Processing responds 
}

void loop()
{
  // if we get a valid byte, read analog ins:
  if (Serial.available() > 0) {
    // get incoming byte:
    inByte = Serial.read();
   
   }
   if(millis()-lastpress>200){
   if(digitalRead(4) == LOW){
     answer = 'C';
    Serial.write(groupnumber);
    Serial.write(answer);
    lastpress = millis();    
   }
   else if(digitalRead(3) == LOW){
     answer = 'B';
     Serial.write(groupnumber);
    Serial.write(answer);      
    lastpress = millis();
 }
   else if(digitalRead(2) == LOW){
     answer = 'A';
     Serial.write(groupnumber);
    Serial.write(answer);      
    lastpress = millis();
 }
   }           
  }


void establishContact() {
 while (Serial.available() <= 0) {
      Serial.write('A');   // send a capital A
      delay(300);
  }
}

