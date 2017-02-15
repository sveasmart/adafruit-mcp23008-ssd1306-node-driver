const i2c = require('i2c-bus')
const oledBus = require('oled-i2c-bus');

const font = require('oled-font-5x7');

class DisplayDriver {
  constructor(busNumber, address, width, height) {
    this.busNumber = busNumber ? busNumber : 1
    this.address = address ? address : 0x3C
    this.width = width ? width : 128
    this.height = height ? height : 64
  }

  text(message) {
    const bus = i2c.openSync(this.busNumber)

    var opts = {
      width: this.width,
      height: this.height,
      address: this.address
    };

    const oled = new oledBus(bus, opts);
    oled.fillRect(0, 0, this.width, this.height, 0);
    oled.setCursor(1,1)
    oled.writeString(font, 1, message, 1, true)
    oled.update()
  }
}

module.exports = DisplayDriver