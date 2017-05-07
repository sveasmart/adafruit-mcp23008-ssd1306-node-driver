const adafruit = require("../index")
const display = new adafruit.DisplayDriver()

display.init()
  .then(function() {
    return display.drawString("ABC", 0, 0)
  })
  .then(function() {
    return display.drawString("Row0", 0, 0)
  })
  .then(function() {
    return display.drawString("Row1", 0, 1)
  })
  .then(function() {
    return display.drawString("Row2indent", 1, 2)
  })
  .then(function() {
    return display.drawString("Row3wrap", 12, 3)
  })
  .then(function() {
    return display.display()
  })
  .catch(function(err) {
    console.log("Error", err)
  })