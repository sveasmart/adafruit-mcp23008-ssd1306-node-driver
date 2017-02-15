/**
 * A fake version of ButtonDriver.
 * Useful for testing purposes when you don't have the real hardware.
 * Simulate button clicks by typing '0', '1', or '2' directly in the console.
 */

class FakeButtonDriver {
  constructor() {
  }

  watchButton(buttonPin, onClickFunction) {
    this._watch(buttonPin, onClickFunction)
  }

  watchAllButtons(onClickFunction) {
    this._watch(null, onClickFunction)
  }
  
  _watch(onlyThisPin, onClickFunction) {
    console.log("Using FakeButtonDriver. Type 0, 1, or 2 to simulate a button click on the respective pin.")
    var stdin = process.stdin;

    // without this, we would only get streams once enter is pressed
    stdin.setRawMode( true );

    // resume stdin in the parent process (node app won't quit all by itself
    // unless an error or process.exit() happens)
    stdin.resume();

    // i don't want binary, do you?
    stdin.setEncoding( 'utf8' );

    // on any data into stdin
    stdin.on( 'data', function( key ){
      // ctrl-c ( end of text )
      if ( key === '\u0003' ) {
        process.exit();
      }
      if (key == '0' && ((onlyThisPin == null) || (onlyThisPin == 0))) {
        console.log("Simulating a button click on pin 0")
        onClickFunction(0)  
      }
      if (key == '1' && ((onlyThisPin == null) || (onlyThisPin == 1))) {
        console.log("Simulating a button click on pin 1")
        onClickFunction(1)
      }
      if (key == '2' && ((onlyThisPin == null) || (onlyThisPin == 2))) {
        console.log("Simulating a button click on pin 2")
        onClickFunction(2)
      }
    });    
  }

}

module.exports = FakeButtonDriver