const adafruit = require("../index")
const display = new adafruit.DisplayDriver()

display.init()
  .then(function() {
    return display.text(
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
  })
  .catch(function(err) {
    console.log("Error", err)
  })