const driver = require("./index")
const ButtonDriver = driver.ButtonDriver

const busNumber = 1
const address = 0x20

const buttonDriver = new ButtonDriver(busNumber, address)
buttonDriver.watchAllButtons(function(buttonPin) {
  console.log("Clicked button #" + buttonPin)
})

console.log("OK, click some buttons")