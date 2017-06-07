const runTasksSerially = require("../src/display/util").runTasksSerially


const task1 = () => {
  return new Promise(function(resolve, reject) {
    console.log("Task 1 starting...")
    setTimeout(function() {
      //console.log("Task 1 will fail now...")
      //reject(new Error("task1 failed!"))
      resolve("task1 done!")
    }, 1000)
  })
}

const task2 = () => {
  return new Promise(function(resolve, reject) {
    console.log("Task 2 starting...")
    setTimeout(function() {
      console.log("Task 2 will fail now...")
      reject(new Error("task2 failed!"))
      //resolve("task2 done!")
    }, 1000)
  })
}


console.log("running....")
runTasksSerially([task1, task2])
  .then(function(result) {
    console.log("Result from runTasksSerially", result)
  })
  .catch(function(err) {
  console.log("Caught error from runTasksSerially", err)
})



/*
runTasksSerially([
  function() {return task1},
  function() {return task2}
  ])

  */