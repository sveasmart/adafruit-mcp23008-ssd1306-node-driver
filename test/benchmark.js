var Step = require("./step")


function bm(name, f) {
  console.log(name)
  let start = Date.now()
  f()
  console.log(`- First time took:  ${Date.now() - start} ms`)
  start = Date.now()
  f()
  console.log(`- Second time took: ${Date.now() - start} ms`)
  start = Date.now()
  f()
  console.log(`- Third time took:  ${Date.now() - start} ms`)
  
}

function bmAsync(name, times, f) {
  console.log(`${name} (async ${times} times in sequence)`)
  
  let currentTime = 1
  let start = Date.now()

  let functions = []

  for (let i = 0; i < times; ++i) {
    functions.push(function() {
      f(this)
    })
  }

  functions.push(function(err, callback) {
    console.log("Done!", err, callback)
  })

  Step(functions)
}

const adafruit = require("../index")
const display = new adafruit.DisplayDriver()

/*

bmAsync("writeByte", 10, function(callback) {
  display._i2c.writeByte(0x3C, 0x00, 0, callback)
})
*/

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
