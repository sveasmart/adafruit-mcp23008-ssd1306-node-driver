/**
 * Fake version of DisplayDriver.
 * Useful for testing purposes when you don't have the real hardware.
 * All display output is sent to the console instead.
 */
class FakeDisplayDriver {
  constructor() {
  }

  text(message) {
    console.log("[FakeDisplay] " + message)
  }
}

module.exports = FakeDisplayDriver