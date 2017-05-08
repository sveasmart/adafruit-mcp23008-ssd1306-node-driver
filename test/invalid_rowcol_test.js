const adafruit = require("../index")
const display = new adafruit.DisplayDriver()

//This should throw an error, and not update the display.
console.log("An AssertionError should be thrown now:")
display.writeText("x", 16, 0, false)
