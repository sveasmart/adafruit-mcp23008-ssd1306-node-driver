const adafruit = require("../index")
const display = new adafruit.DisplayDriver()

//This should be truncated
display.writeText("12345678901234567890", 0,0, false)

//This should be truncated
display.writeText("ABC", 14, 3, false)
