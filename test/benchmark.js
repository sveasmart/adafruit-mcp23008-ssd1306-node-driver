const bm = require("./util/benchmarker")

const adafruit = require("../index")
const display = new adafruit.DisplayDriver()


display._init()
  .then(function() {
    return display.writeText("12345678901234567890")
  })
  .catch(function(err) {
    console.log("Error", err)
  })


/*
console.time("text")
display.init()
  .then(function() {
    return display.text("A")
  })
  .then(function() {
    console.timeEnd("text")
    return display.text("B")
  })
  .then(function() {
    return display.text("C")
  })
  .then(function() {
    return display.text("D")
  })
  .then(function() {
    return display.text("E")
  })
  .catch(function(err) {
    console.log("Error", err)
  })
*/

/*
bm.promise("display init", function() {
  return display.init()
})
*/


/*

bmAsyncMany("writeByte", 10, function(callback) {
  display._i2c.writeByte(0x3C, 0x00, 0, callback)
})
*/

/*
const Step = require("./step")
let start = Date.now()
Step(
  function writeByte() {
    display._i2c.writeByte(0x3C, 0x00, 0, this)
  },
  function writeByte() {
    display._i2c.writeByte(0x3C, 0x00, 0, this)
  },
  function writeByte() {
    display._i2c.writeByte(0x3C, 0x00, 0, this)
  },
  function writeByte() {
    display._i2c.writeByte(0x3C, 0x00, 0, this)
  },
  function writeByte() {
    display._i2c.writeByte(0x3C, 0x00, 0, this)
  },
  function writeByte() {
    display._i2c.writeByte(0x3C, 0x00, 0, this)
  },
  function writeByte() {
    display._i2c.writeByte(0x3C, 0x00, 0, this)
  },
  function writeByte() {
    display._i2c.writeByte(0x3C, 0x00, 0, this)
  },
  function writeByte() {
    display._i2c.writeByte(0x3C, 0x00, 0, this)
  },
  function writeByte() {
    display._i2c.writeByte(0x3C, 0x00, 0, this)
  },
  function done(err, result) {
    console.log("Done!", err, result)
  }
)
console.log(`- Took:  ${Date.now() - start} ms`)
*/

/*
bm("writeByteSync 1000 times", function() {
  for (let i = 1; i <= 1000; ++i) {
    display._i2c.writeByteSync(0x3C, 0x00, 0)
  }
})
*/




/*
const adafruit = require("../index")
bm("constructor", function() {
  new adafruit.DisplayDriver()
})
*/



/*
bm("require", function() {
  require("../index")
})
*/



/*
bm("text", function() {
  display.text("hi")
})
*/
