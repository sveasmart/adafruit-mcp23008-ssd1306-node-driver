const adafruit = require("../index")
const FakeButtonDriver = adafruit.FakeButtonDriver
const fakeButtonDriver = new FakeButtonDriver()

fakeButtonDriver.watchAllButtons(function(buttonPin) {
  console.log("Detected button press on pin " + buttonPin)
})