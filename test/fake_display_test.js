const adafruit = require("../index")
const FakeDisplayDriver = adafruit.FakeDisplayDriver
const fakeDisplayDriver = new FakeDisplayDriver()

fakeDisplayDriver.writeText("Here is a QR code...")

setTimeout(function() {
  fakeDisplayDriver.setQrCode("http://www.google.com")
}, 500)