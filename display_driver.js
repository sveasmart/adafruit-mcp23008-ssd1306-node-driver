const i2c = require('i2c-bus')
const oled = require('oled-i2c-bus');

const font = require('oled-font-5x7');

class DisplayDriver {
  constructor(busNumber, address, width, height) {
    const bus = i2c.openSync(busNumber ? busNumber : 1)

    var opts = {
      width: width ? width : 128,
      height: height ? height : 64,
      address: address ? address : 0x3C
    };

    this.width = opts.width
    this.height = opts.height

    this.oled = new oled(bus, opts);
  }

  text(message) {
    this.oled.fillRect(0, 0, this.width, this.height, 0);
    this.oled.setCursor(1,1)
    this.oled.writeString(font, 1, message, 1, true)
    this.oled.update()
  }
}

module.exports = DisplayDriver