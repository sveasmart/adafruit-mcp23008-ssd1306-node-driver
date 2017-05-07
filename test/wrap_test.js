const adafruit = require("../index")
const display = new adafruit.DisplayDriver()

display.init()
  .then(function() {
    //This should be wrapped
    return display.drawString("12345678901234567890")
  })
  .then(function() {
    //This should be wrapped
    return display.drawString("ABC", 14, 3)
  })
  .then(function() {
    return display.display()
  })
  .catch(function(err) {
    console.log("Error", err)
  })