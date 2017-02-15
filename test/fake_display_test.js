const adafruit = require("../index")
const FakeDisplayDriver = adafruit.FakeDisplayDriver
const fakeDisplayDriver = new FakeDisplayDriver()

fakeDisplayDriver.text("Hi there")