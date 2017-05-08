const adafruit = require("../index")
const display = new adafruit.DisplayDriver()

console.log("Watch the display. The last row of nines shouldn't be visible.")
display.writeText(
    "1111111111111111"
  + "2222222222222222"
  + "3333333333333333"
  + "4444444444444444"
  + "5555555555555555"
  + "6666666666666666"
  + "7777777777777777"
  + "8888888888888888"
  + "9999999999999999"
)
