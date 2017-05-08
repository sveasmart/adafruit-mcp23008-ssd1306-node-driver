const adafruit = require("../index")
const display = new adafruit.DisplayDriver()

display.writeText("A")
display.writeText("B")
display.writeText("C")

setTimeout(function() {
  display.writeText("D")
  display.writeText("E", 1, 0)
  display.writeText("F", 0, 1)
}, 2000)
