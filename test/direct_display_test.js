const i2c = require('i2c-bus')
const oledBus = require('oled-i2c-bus');
const font = require('oled-font-5x7');

const bus = i2c.openSync(1)
const oled = new oledBus(bus, {
  width: 128,
  height: 64,
  address: 0x3C
});

//oled.turnOnDisplay()
//oled.fillRect(0, 0, 128, 64, 0);
oled.setCursor(1,1)
oled.writeString(font, 1, "TEST", 1, true)