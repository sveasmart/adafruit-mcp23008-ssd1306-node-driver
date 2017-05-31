const qrCodeTerminal = require('qrcode-terminal')

/**
 * Fake version of DisplayDriver.
 * Mirrors the methods of DisplayDriver, but all display output is sent to the console instead.
 * Useful for testing purposes when you don't have the real hardware.
 */
class FakeDisplayDriver {
  constructor() {
  }

  stop() {
    console.log("[FakeDisplay stop]")
  }

  clear() {
    console.log("[FakeDisplay clear]")
  }

  clearRow(row) {
    console.log("[FakeDisplay clearRow " + row + "]")
  }


  writeText(message) {
    console.log("[FakeDisplay writeText] " + message)
  }

  setQrCode(text, whiteOnBlack) {
    console.log("[FakeDisplay setQrCode]")
    qrCodeTerminal.generate(text)
  }

  setImage(pix) {
    console.log("[FakeDisplay setImage]")
  }

  setTexts(lines) {
    console.log("[FakeDisplay setTexts]", lines.join("\n"))
  }

  writeText(string, column, row, wrap) {
    console.log("[FakeDisplay writeText col=" + column + ", row=" + row + "]", string)
  }

}

module.exports = FakeDisplayDriver