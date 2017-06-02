const adafruit = require("../index")
const FakeDisplayDriver = adafruit.FakeDisplayDriver
const fakeDisplayDriver = new FakeDisplayDriver()

fakeDisplayDriver.setTexts(["line1", "line2"])

fakeDisplayDriver.writeText("Here is a QR code...")

setTimeout(function() {
  fakeDisplayDriver.setQrCode("http://www.google.com")
}, 500)