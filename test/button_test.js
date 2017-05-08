const adafruit = require("../index")
const display = new adafruit.DisplayDriver()

var counters = []
counters[0] = 0
counters[1] = 0
counters[2] = 0


const busNumber = 1
const address = 0x20
const buttonDriver = new adafruit.ButtonDriver(busNumber, address)


console.log("Press a button")
display.writeText("Press a button")

buttonDriver.watchAllButtons(function(buttonPin) {
  counters[buttonPin] = counters[buttonPin] + 1
  console.log("Button " + buttonPin + " pressed")
  display.setTexts([
    "Button presses",
    "--------------",
    counters[0],
    counters[1],
    counters[2]
  ])
})

