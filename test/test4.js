const adafruit = require("../index")
const display = new adafruit.DisplayDriver()


console.log("beginning...")
display.begin()
display.clear()

//display.qrCode("http://vi.i/asdf#asdfgdfsdfg")

//display.textRows(["http://v.ht/DwK2", "ABCDEFGHIJ"])
display.texts(["http://v.ht/DwK2", "ABCDEFGHIJ"], 1, 1)

//display.image(pix)


/*

var pngtolcd = require('png-to-lcd');
pngtolcd("qrtest.png", false, function(err, bitmap) {
  if (err) {
    console.log("Error while generating QR code!", err)
    return
  }

  console.log("bitmap", bitmap.length)
  for (var x = 0; x < bitmap.length; ++x) {
    console.log("bitmap " + x + " = " + bitmap[x])
  }


  //display.image(bitmap);
  //display.display()

});
*/

/*
var pngparse = require("pngparse")

pngparse.parseFile("qrtest.png", function(err, result) {
  if(err) {
    console.log(err)
    throw err
  }

  console.log("result", result)
  var bitmap = result.data
  console.log("bitmap length", bitmap.length)
  for (var x = 0; x < bitmap.length; ++x) {
    //console.log("bitmap " + x + " = " + bitmap[x])
  }
  display.image(bitmap);
  display.display()

})
*/


console.log("done!")