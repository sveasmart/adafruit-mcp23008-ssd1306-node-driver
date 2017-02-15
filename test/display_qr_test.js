const adafruit = require("../index")
const displayDriver = new adafruit.DisplayDriver()

displayDriver.qrCode("http://www.kniberg.com")
//displayDriver.text("OK")


