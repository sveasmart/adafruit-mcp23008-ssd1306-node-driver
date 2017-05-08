const adafruit = require("../index")
const display = new adafruit.DisplayDriver()

display.writeText("ABC", 0, 0)
display.writeText("Row0", 0, 0)
display.writeText("Row1", 0, 1)
display.writeText("Row2indent", 1, 2)
display.writeText("Row3wrap", 12, 3)
