const fs = require('fs')

exports.ButtonDriver = require("./src/button/button_driver")
exports.FakeButtonDriver = require("./src/button/fake_button_driver")

exports.DisplayDriver = require("./src/display/display_driver")
exports.FakeDisplayDriver = require("./src/display/fake_display_driver")

exports.demo = require("./src/demo/demo")

exports.hasDriver = function() {
  try {
    require('i2c-bus')
  } catch (err) {
    console.log("I'll assume i2c isn't available, because I got this error when doing require('i2c-bus'): " + err)
    return false
  }

  if (!fs.existsSync('/dev/i2c-1')) {
    console.log("/dev/i2c-1 doesn't exist, so I'll assume i2c isn't available")
    return false
  }

  return true
}



