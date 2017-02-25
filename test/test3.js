const adafruit = require("../index")
const display = new adafruit.DisplayDriver()

//const oled = display.getOled()

//display.text("Yeah")

//oled.clearDisplay(); //doesn't automatically update
//oled.update()

//oled.turnOnDisplay()

//oled.clearDisplay(); //doesn't automatically update
//oled.turnOnDisplay()
//oled.update() //Must do update after clear, or subsequent stuff gets wonky


//oled.writeString(display.font, 2, "O", 1, true) //does automatically update!

var counter = 0

setInterval(function() {
  display.text("T" + counter)
  counter = counter + 1
}, 1000)


/*




function yeah() {
  counter = counter + 1
  console.log("QR " + counter)
  //display.qrCode("http://kniberg.com")
  setTimeout(function() {
    console.log("Text " + counter)
    display.text("A " + counter)
    setTimeout(yeah, 2000)
  }, 2000)

}

yeah()

  */

/*
setInterval(function() {
  oled.clearDisplay(); //doesn't automatically update
  oled.update() //Must do update after clear, or subsequent stuff gets wonky
  oled.setCursor(1,1)
  oled.writeString(display.font, 2, "A" + counter, 1, true) //does automatically update!
  counter = counter + 1
  console.log(counter)
}, 200)
*/

//oled.update()

//console.log("Cleared")