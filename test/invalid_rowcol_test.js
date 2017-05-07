const adafruit = require("../index")
const display = new adafruit.DisplayDriver()

display.init()
  .then(function() {
    //This should throw an error, and not update the display.
    return display.text("x", 16,0, false)
  })
  .catch(function(err) {
    console.log("Error", err)
  })