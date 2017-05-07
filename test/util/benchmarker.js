const Step = require("./step")

exports.sync = function(name, f) {
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

exports.promise = function(name, f) {
  console.time(name)
  f()
    .then(() => {
      console.timeEnd(name)
    })
    .catch((err) => {
      console.log("promise failed", err)
    })
}

exports.asyncSerial = function(name, times, f) {
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

exports.async = function(name, f) {
  //console.log(name + " (async)")
  //let start = Date.now()
  console.time(name)
  f(function(err) {
    if (err) {
      console.log(err)
    } else {
      console.timeEnd(name)
      //console.log(`- Took:  ${Date.now() - start} ms`)
    }
  })


}