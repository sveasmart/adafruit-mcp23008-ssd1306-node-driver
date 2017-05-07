const adafruit = require("../index")
const display = new adafruit.DisplayDriver()


console.time("qr")
display.init()
  .then(function() {
    return display.qrCode("http://www.kniberg.com", false)
  })
  .then(function() {
    console.timeEnd("qr")
  })
  .catch(function(err) {
    console.log("Error", err)
  })

