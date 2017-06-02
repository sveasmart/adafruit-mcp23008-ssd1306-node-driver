const qrCodeTerminal = require('qrcode-terminal')

/**
 * Fake version of DisplayDriver.
 * Mirrors the methods of DisplayDriver, but all display output is sent to the console instead.
 * Useful for testing purposes when you don't have the real hardware.
 */
class FakeDisplayDriver {
  constructor() {
  }

  showTab() {
    log("showTab", arguments)
  }

  stop() {
    log("stop", arguments)
  }

  clearAllTabs() {
    log("clearAllTabs", arguments)
  }

  clear() {
    log("clear", arguments)
  }

  clearRow() {
    log("clearRow", arguments)
  }

  setQrCode(text) {
    log("setQrCode", arguments)
    qrCodeTerminal.generate(text)
  }

  setImage() {
    log("setImage", arguments)
  }

  setTexts(lines, tab) {
    console.log("[FakeDisplay] setTexts" +
      "([" + lines.join(",") + "], " + tab + ")")
  }

  writeText() {
    log("writeText", arguments)
  }

}

function log(methodName, args) {
  argumentsArray = [].slice.apply(args)
  console.log("[FakeDisplay] " + methodName + "(" + argumentsArray.join(", ") + ")")
}

module.exports = FakeDisplayDriver