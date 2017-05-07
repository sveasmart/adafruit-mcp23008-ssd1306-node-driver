
/**
 * Executes the given tasks in serial. Each task should be a function that returns a promise.
 * The runTasksSerially function in turn returns a promise that is fulfilled
 * when all tasks are done.
 */
exports.runTasksSerially = function(tasks) {
  var resolve = Promise.resolve();
  return tasks.reduce(function(accumulator, fn) {
    return accumulator = accumulator.then(fn);
  }, resolve);
}