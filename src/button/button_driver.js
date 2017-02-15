const MCP23017_IODIRA = 0x00
const MCP23008_GPPUA  = 0x06
const MCP23008_GPIOA  = 0x09

const POLL_INTERVAL = 10

const GPIO_IN = 1

class ButtonDriver {
  constructor(busNumber, address) {
    const i2c = require('i2c-bus')
    this.bus = i2c.openSync(busNumber)
    this.address = address
  }

  watchButton(buttonPin, onClickFunction) {
    initButton(this.bus, this.address, buttonPin)
    pollButtonAndRepeat(this.bus, this.address, buttonPin, false, onClickFunction)
  }

  watchAllButtons(onClickFunction) {
    for (var buttonPin = 0; buttonPin <= 2; ++buttonPin) {
      this.watchButton(buttonPin, onClickFunction)
    }
  }

}

function initButton(bus, address, pin) {
  readAndChangePin(bus, address, MCP23017_IODIRA, pin, GPIO_IN)
  readAndChangePin(bus, address, MCP23008_GPPUA, pin, 1)
}

function pollButtonAndRepeat(bus, address, pin, wasPressed, onClickFunction) {
  const isPressed = isButtonPressed(bus, address, pin)
  if (isPressed && !wasPressed) {
    onClickFunction(pin)
  }
  setTimeout(function() {
    pollButtonAndRepeat(bus, address, pin, isPressed, onClickFunction)
  }, POLL_INTERVAL)
}

function readPin(bus, address, pin) {
  const value = bus.readByteSync(address, MCP23008_GPIOA)
  return value & (1 << pin)
}

function isButtonPressed(bus, address, pin) {
  return readPin(bus, address, pin) == 0
}

function readAndChangePin(bus, address, port, pin, value) {
  const currValue = bus.readByteSync(address, port)
  const newValue = changeBit(currValue, pin, value)
  bus.writeByteSync(address, port, newValue)
}

function changeBit(bitmap, bit, value) {
  if (value == 0) {
    return bitmap & ~(1 << bit)
  } else {
    return bitmap | (1 << bit)
  }
}


module.exports = ButtonDriver