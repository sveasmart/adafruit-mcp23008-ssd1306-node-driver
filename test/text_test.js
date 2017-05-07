const adafruit = require("../index")
const display = new adafruit.DisplayDriver()


console.time("text1")
display.init()
  .then(function() {
    return display.text("A")
  })
  .then(function() {
    console.timeEnd("text1")
    console.time("text2")
    return display.text("B")
  })
  .then(function() {
    console.timeEnd("text2")
    console.time("text3")
    return display.text("C")
  })
  .then(function() {
    console.timeEnd("text3")
    return display.text("D")
  })
  .then(function() {
    return display.text("E")
  })
  .catch(function(err) {
    console.log("Error", err)
  })