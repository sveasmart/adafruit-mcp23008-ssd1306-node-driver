const adafruit = require("../index")
const display = new adafruit.DisplayDriver()

display.writeText("Hi", 8, 0)
display.setQrCode("http://www.kniberg.com", false)

setTimeout(function() {
  display.setQrCode("http://www.kniberg.com", true)
}, 3000)

