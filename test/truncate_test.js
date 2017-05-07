const adafruit = require("../index")
const display = new adafruit.DisplayDriver()

display.init()
  .then(function() {
    //This should be truncated
    return display.drawString("12345678901234567890", 0,0, false)
  })
  .then(function() {
    //This should be truncated
    return display.drawString("ABC", 14, 3, false)
  })
  .then(function() {
    return display.display()
  })
  .catch(function(err) {
    console.log("Error", err)
  })