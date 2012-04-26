import processing.serial.*;
import processing.net.*;
Client webrequest;

int port = 0;
PFont fontA;
Serial myPort;                       // The serial port
int[] serialInArray = new int[3];    // Where we'll put what we receive
int serialCount = 0;                 // A count of how many bytes we receive
int groupnumber;		             // Starting position of the ball
boolean firstContact = false;        // Whether we've heard from the microcontroller
char answer = '0';
String connectedcheck = "no";

void setup() {
  size(385, 205);  // Stage size
  noStroke();      // No border on the next thing drawn
  fontA = loadFont("TrajanPro-Bold-32.vlw");
  println(Serial.list());
  String portName = Serial.list()[port];
  myPort = new Serial(this, portName, 9600);
  textFont(fontA, 32);
  webrequest = new Client(this, "kodekode.dk", 8080);
}

void draw() {
  background(102);
 
 fill(204);
  String groupstring = "Group: " + groupnumber;
  text(groupstring, 30, 60);
  fill(204);
  String serialstring = "Serialport: " + port;
  text(serialstring, 30, 95);
  String connectedstring = "Connected: " + connectedcheck;
  text(connectedstring, 30, 130);
  fill(230);
  String answerstring = "Answer: " + answer;
  text(answerstring, 30, 165);
  
}

void serialEvent(Serial myPort) {
  // read a byte from the serial port:
  int inByte = myPort.read();
  // if this is the first byte received, and it's an A,
  // clear the serial buffer and note that you've
  // had first contact from the microcontroller. 
  // Otherwise, add the incoming byte to the array:
  if (firstContact == false) {
    connectedcheck = "yeah!";
    if (inByte == 'A') { 
      myPort.clear();          // clear the serial port buffer
      firstContact = true;     // you've had first contact from the microcontroller
      myPort.write('A');       // ask for more
    } 
  } 
  else {
    // Add the latest byte from the serial port to array:
    serialInArray[serialCount] = inByte;
    serialCount++;

    // If we have 3 bytes:
    if (serialCount > 1 ) {
      groupnumber = serialInArray[0];
      answer = char(serialInArray[1]);

     webrequest.write("GET /" + groupnumber + "/" + answer + " HTTP/1.1\n\n");

      // Send a capital A to request new sensor readings:
      myPort.write('A');
      // Reset serialCount:
      serialCount = 0;
    }
  }
}
