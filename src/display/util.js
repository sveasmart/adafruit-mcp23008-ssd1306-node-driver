/**
 * Executes the given array of tasks one at a time.
 * If any one task fails, the rest won't be executed.
 * Each task in the array is a function that returns a promise.
 * This function in returns a promise that resolves when the last task
 * has been successfully executed, or throws error if any one tasks throws an error.
 */
exports.runTasksSerially = function(tasks) {

  // Create a new empty promise (don't do that with real people ;)
  var sequence = Promise.resolve();

  // Loop over each task, and add on a promise to the
  // end of the 'sequence' promise.
  tasks.forEach(function(task) {

    // Chain one computation onto the sequence
    sequence = sequence.then(function() {
      return task();
    })

  })

  // This will resolve after the entire chain is resolved
  return sequence;
}