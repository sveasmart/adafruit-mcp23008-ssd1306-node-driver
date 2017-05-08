const qrCodeTerminal = require('qrcode-terminal')

/**
 * Fake version of DisplayDriver.
 * Useful for testing purposes when you don't have the real hardware.
 * All display output is sent to the console instead.
 */
class FakeDisplayDriver {
  constructor() {
  }

  writeText(message) {
    console.log("[FakeDisplay text] " + message)
  }

  setQrCode(text) {
    console.log("[FakeDisplay image]")
    qrCodeTerminal.generate(text)
  }
}

module.exports = FakeDisplayDriver