const adafruit = require("../index")
const displayDriver = new adafruit.DisplayDriver()


displayDriver.clear()

setTimeout(function() {
  displayDriver.qrCode("http://www.kniberg.com", true)

}, 1000)



