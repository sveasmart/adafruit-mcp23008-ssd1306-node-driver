const adafruit = require("../index")
const displayDriver = new adafruit.DisplayDriver()

displayDriver.qrCode("http://www.kniberg.com")
setTimeout(function() {
  console.log("Clearing...")
  displayDriver.clear()
  
  setTimeout(function() {
    displayDriver.text("Works!")
    
  }, 1000)
  
}, 2000)

