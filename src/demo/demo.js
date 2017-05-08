const ButtonDriver = require("../button/button_driver")
const DisplayDriver = require("../display/display_driver")

function demo() {
  const busNumber = 1

  const displayAddress = 0x3c
  const displayDriver = new DisplayDriver(busNumber, displayAddress)

  const buttonsAddress = 0x20
  const buttonDriver = new ButtonDriver(busNumber, buttonsAddress)

  buttonDriver.watchAllButtons(function(buttonPin) {
    if (buttonPin == 2) {
      displayDriver.clear()
      displayDriver.setQrCode("http://google.com")
    } else {
      displayDriver.clear()
      displayDriver.writeText("Clicked #" + buttonPin)
    }
  })

  displayDriver.writeText("Click me!")
  console.log("Check the display...")
}

module.exports = demo

