const adafruit = require("../index")
const display = new adafruit.DisplayDriver()
const buttonDriver = new adafruit.ButtonDriver()


console.log("Testing...")
display.clearAllTabs()
display.writeText("Press a button", 0, 0, false, "tab0")
display.writeText("B", 0, 0, false, "tab1")
display.setQrCode("http://kniberg.com", false, "tab2")

display.showTab("tab0")

let counter1 = 0


setInterval(function() {
  display.writeText("B" + counter1, 0, 0, false, "tab1")
  ++counter1
}, 1000)

console.log("Press a button")

buttonDriver.watchAllButtons(function(buttonPin) {
  console.log("showing tab" + buttonPin)
  display.showTab("tab" + buttonPin)
})

