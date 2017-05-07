const adafruit = require("../index")
const display = new adafruit.DisplayDriver()
const util = require("../src/display/util")
const displayTasks = []

function addDisplayTask(x, y) {
  displayTasks.push(function() {
    console.log("Writing on " + x + "," + y)
    return display.text("A", x, y)
  })
}

for (let x = 0; x < 16; ++x) {
  addDisplayTask(x, 0)
}
for (let y = 1; y < 8; ++y) {
  addDisplayTask(15, y)
}

display.init()
  .then(function() {
    return util.runTasksSerially(displayTasks)
  })
  .catch(function(err) {
    console.log("Error", err)
  })