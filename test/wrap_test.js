const adafruit = require("../index")
const display = new adafruit.DisplayDriver()

display.clear()

//This should be wrapped
display.writeText("12345678901234567890")

//This should be wrapped
display.writeText("ABC", 14, 3)
