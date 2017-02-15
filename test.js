const adafruit = require("./index")
const ButtonDriver = adafruit.ButtonDriver
const DisplayDriver = adafruit.DisplayDriver

const busNumber = 1

const displayAddress = 0x3c
const displayDriver = new DisplayDriver(busNumber, displayAddress)

const buttonsAddress = 0x20
const buttonDriver = new ButtonDriver(busNumber, buttonsAddress)

buttonDriver.watchAllButtons(function(buttonPin) {
  displayDriver.text("Clicked button #" + buttonPin)
})

displayDriver.text("OK, click some buttons")
console.log("Check the display...")
