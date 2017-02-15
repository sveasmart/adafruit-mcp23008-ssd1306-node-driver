const adafruit = require("../index")
const FakeDisplayDriver = adafruit.FakeDisplayDriver
const fakeDisplayDriver = new FakeDisplayDriver()

fakeDisplayDriver.text("Here is a QR code...")

setTimeout(function() {
  fakeDisplayDriver.qrCode("http://www.google.com")
}, 500)