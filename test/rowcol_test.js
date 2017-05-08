const adafruit = require("../index")
const display = new adafruit.DisplayDriver()

for (let x = 0; x < 16; ++x) {
  display.writeText("A", x, 0)
}
for (let y = 1; y < 8; ++y) {
  display.writeText("B", 15, y)
}

