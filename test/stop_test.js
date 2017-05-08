const adafruit = require("../index")
const display = new adafruit.DisplayDriver()

display.writeText("Stop test")
display.stop()
console.log("The process should exit now.")
