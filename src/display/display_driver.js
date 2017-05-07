const qr = require('node-qr-image')
const streamToArray = require('stream-to-array')
const Jimp = require('jimp')

const fs = require("fs")
const async = require("async")
//const Promise = require('promise')
const util = require("./util")

var sequence = require('promise-sequence')

//GPIO constants
OUT     = 0
IN      = 1
HIGH    = true
LOW     = false

RISING      = 1
FALLING     = 2
BOTH        = 3

PUD_OFF  = 0
PUD_DOWN = 1
PUD_UP   = 2


// Constants
SSD1306_I2C_ADDRESS = 0x3C
SSD1306_SETCONTRAST = 0x81
SSD1306_DISPLAYALLON_RESUME = 0xA4
SSD1306_DISPLAYALLON = 0xA5
SSD1306_NORMALDISPLAY = 0xA6
SSD1306_INVERTDISPLAY = 0xA7
SSD1306_DISPLAYOFF = 0xAE
SSD1306_DISPLAYON = 0xAF
SSD1306_SETDISPLAYOFFSET = 0xD3
SSD1306_SETCOMPINS = 0xDA
SSD1306_SETVCOMDETECT = 0xDB
SSD1306_SETDISPLAYCLOCKDIV = 0xD5
SSD1306_SETPRECHARGE = 0xD9
SSD1306_SETMULTIPLEX = 0xA8
SSD1306_SETLOWCOLUMN = 0x00
SSD1306_SETHIGHCOLUMN = 0x10
SSD1306_SETSTARTLINE = 0x40
SSD1306_MEMORYMODE = 0x20
SSD1306_COLUMNADDR = 0x21
SSD1306_PAGEADDR = 0x22
SSD1306_COMSCANINC = 0xC0
SSD1306_COMSCANDEC = 0xC8
SSD1306_SEGREMAP = 0xA0
SSD1306_CHARGEPUMP = 0x8D
SSD1306_EXTERNALVCC = 0x1
SSD1306_SWITCHCAPVCC = 0x2

// Scrolling constants
SSD1306_ACTIVATE_SCROLL = 0x2F
SSD1306_DEACTIVATE_SCROLL = 0x2E
SSD1306_SET_VERTICAL_SCROLL_AREA = 0xA3
SSD1306_RIGHT_HORIZONTAL_SCROLL = 0x26
SSD1306_LEFT_HORIZONTAL_SCROLL = 0x27
SSD1306_VERTICAL_AND_RIGHT_HORIZONTAL_SCROLL = 0x29
SSD1306_VERTICAL_AND_LEFT_HORIZONTAL_SCROLL = 0x2A

/**
 * All methods that take a callback return a promise,
 * so the callback is optional.
 */
class DisplayDriver {
  /**
   *
   * NOTE: You need to call .init() before doing anything with the object
   *
   * @param busNumber default 1
   * @param address default 0x3C
   * @param width default 128
   * @param height default 64
   */
  constructor(busNumber, address, width, height) {
    this.font = require('oled-font-5x7');

    this.busNumber = busNumber ? busNumber : 1
    this.address = address ? address : 0x3C
    this.width = width ? width : 128
    this.height = height ? height : 64

    this.charactersPerRow = 16
    this.charactersPerColumn = 8


    this._spi = null
    this._i2c = null
    this._pages = Math.floor(this.height / 8)

    this._buffer = new Array(this.width * this._pages)
    this._buffer.fill(0)
    // Setup reset pin.
    var rst = 42
    this._rst = rst

    // Save vcc state.
    this._vccstate = SSD1306_SWITCHCAPVCC
  }

  /**
   * Returns a promise
   */
  init() {

    /*
    var dc = null
    var sclk = null
    var din = null
    var cs = null
    var gpio = null
    var spi = null
    var i2c_bus = null
    var i2c_address = SSD1306_I2C_ADDRESS
    var i2c = null
    */


    //const openI2cBus = Promise.denodeify(this._i2c.open)

    this._i2c = require('i2c-bus').openSync(this.busNumber)

    return this.commands(getInitCommandBytes())
  }


  /**
   * Writes the given command byte on the bus and returns a promise
   */
  _writeByte(command, byte) {
    return new Promise((fulfill, reject) => {
      this._i2c.writeByte(this.address, command, byte, function(err) {
        if (err) {
          reject()
        } else {
          fulfill()
        }
      })
    })
  }

  /**
   * Returns a promise.
   * @param commandByte
   * @param callback
   * @returns {*}
   */
  command(commandByte) {
    const command = 0x00   // Co = 0, DC = 0
    return this._writeByte(command, commandByte)
  }



  /**
   * Executes the given commands in sequence (but non-blocking)
   * Returns a promise.
   */
  commands(commandBytes) {
    const tasks = []

    commandBytes.forEach((commandByte) => {
      tasks.push(() => {
        return this.command(commandByte)
      })
    })

    return util.runTasksSerially(tasks)
  }

  /**
   * Updates the display, by writing the display buffer to the physical display.
   * Returns a promise.
   */
  display() {
    const resetDisplayBytes = []

    //Write display buffer to physical display.
    resetDisplayBytes.push(SSD1306_COLUMNADDR)
    resetDisplayBytes.push(0)              // Column start address. (0 = reset)
    resetDisplayBytes.push(this.width-1)   // Column end address.
    resetDisplayBytes.push(SSD1306_PAGEADDR)
    resetDisplayBytes.push(0)              //Page start address. (0 = reset)
    resetDisplayBytes.push(this._pages-1)  // Page end address.

    return this.commands(resetDisplayBytes)
      .then(() => {
        //OK, we've resetted the display. Now let's write all the bytes. In parallell!
        const writeBytePromises = []

        const command = 0x40
        //Loop through all 1024 bytes in the buffer and
        //trigger writeByte
        for (var j = 0; j < this._buffer.length; ++j) {
          writeBytePromises.push(
            this._writeByte(command, this._buffer[j])
          )
        }

        //Return a promise that resolves when all the writeByte promises have resolved.
        return Promise.all(writeBytePromises)
      })
  }

  /**
   * Clears the display and writes the given image.
   * The image pixels should be in 1 bit mode and equal to the display size (8192 values).
   * Returns a promise
   */
  image(pix) {
    const expectedLength = this.width * this.height
    console.assert(pix.length == expectedLength, `Hey, image(...) expects an array of length ${expectedLength}. This array has length ${pix.length}.`)

    // Iterate through the memory pages
    var index = 0
    for (var page = 0; page < this._pages; ++page) {

      // Iterate through all x axis columns.
      for (var x = 0; x < 128; ++x) {

        // Set the bits for the column of pixels at the current position.
        var bits = 0
        for (var bit = 0; bit < 8; ++bit) {
          bits = bits << 1

          var val
          if (getPixelValue(pix, x, (page * 8) + 7 - bit) == 0) {
            val = 0
          } else {
            val = 1
          }
          bits = bits | val
        }
        // Update buffer byte and increment to next byte.
        this._buffer[index] = bits
        index = index + 1
      }
    }
    return this.display()
  }

  /**
   * Clears the screen and writes the given lines of text.
   * If any line is too long it will be truncated.
   * If there are too many lines they will be truncated too.
   */
  texts(lines) {
    this._buffer.fill(0)

    for (var lineNumber = 0; lineNumber < lines.length; ++lineNumber) {
      if (lineNumber >= this.charactersPerColumn) {
        break
      }
      this.drawString(lines[lineNumber], 0, lineNumber, false)
    }
    return this.display()
  }

  /**
   * Clears the display, writes the given text and updates the display.
   * If the text goes beyond the end of a row, it will be wrapped (if wrap == true)
   * or truncated (if wrap == false).
   * If the text runs flows beyound than the bottom row, it will be truncated.
   * 
   * Returns a promise.
   * @param string the test to write.
   * @param column optional, default is 0. Must be in the range 0-15.
   * @param row optional, default is 0. Must be in the range 0-8.
   * @param wrap default true. If true, text longer than the row is wrapped. Otherwise it is truncated.
   */
  text(string, column, row, wrap) {
    this._buffer.fill(0)
    if (!column) {
      column = 0
    }
    if (!row) {
      row = 0
    }

    this.drawString(string, column, row, wrap)
    return this.display()
    /*
    //var fontFile = path.join(__dirname, "PixelOperator.ttf")
    Jimp.loadFont( Jimp.FONT_SANS_16_WHITE).then( (font) => { // load font from .fnt file
      var image = new Jimp(128, 64, 255);
      console.log("Printing " + message)
      image = image.print(font, 10, 10, message);        // print a message on an image
      image.write("text.png")
      this.image(getJimpPixels(image))
      this.display()
    }).catch(function (err) {
      console.error(err);
    });
    */
  }

  /**
   * Same as text(...), but doesn't clear or redraw the display.
   * Doesn't return anything.
   */
  drawString(string, column, row, wrap) {
    string = String(string)

    if (wrap == undefined || wrap == null) {
      wrap = true
    }

    if (!column) {
      column = 0
    }
    if (!row) {
      row = 0
    }

    assertInt("column", column, 0, this.charactersPerRow - 1)
    assertInt("row", row, 0, this.charactersPerColumn - 1)


    for (var i = 0; i < string.length; ++i) {
      if (column + i >= this.charactersPerRow) {
        //Row overflow!
        if (wrap) {
          //Wrap to next row.
          row = row + 1
          column = column - this.charactersPerRow
        } else {
          //Truncate the row.
          break
        }
      }
      if (row >= this.charactersPerColumn) {
        //We are beneath the bottom of the display. Truncate.
        break
      }

      this.drawChar(string[i], column + i, row)
    }
  }

  drawChar(char, charX, charY) {
    console.assert(char, "No char was given")
    assertInt("charX", charX, 0, this.charactersPerRow - 1)
    assertInt("charY", charY, 0, this.charactersPerColumn - 1)


    const buf = this.findCharBuf(this.font, char)
    for (var i = 0; i < buf.length; ++i) {
      var x = charX * 8
      var y = charY
      var bufferPos = x + (y * 128)
      this._buffer[bufferPos + i] = buf[i]
    }
  }


// find where the character exists within the font object
  findCharBuf(font, c) {
    // use the lookup array as a ref to find where the current char bytes start
    var cBufPos = font.lookup.indexOf(c) * font.width;
    // slice just the current char's bytes out of the fontData array and return
    var cBuf = font.fontData.slice(cBufPos, cBufPos + font.width);
    return cBuf;
  }

  textRows(rows) {
    Jimp.loadFont( Jimp.FONT_SANS_16_WHITE).then( (font) => { // load font from .fnt file
      var image = new Jimp(128, 64, 255);


      const rowHeight = 18
      for (var rowNumber = 0; rowNumber < rows.length; ++rowNumber) {
        var rowText = rows[rowNumber]
        image = image.print(font, 0, rowNumber * rowHeight, rowText);        // print a message on an image
      }
      image.write("text.png")
      return this.image(getJimpPixels(image))
    }).catch(function (err) {
      console.error(err);
    });

  }

  clear() {
    this._buffer.fill(0)
    this.display()
  }

  /**
   * Clears the display and writes the given QR code.
   * Default is black on white.
   * Returns a promise.
   * @param text the content of the QR code
   * @param whiteOnBlack if true, draws white on black instead of black on white
   */
  qrCode(text, whiteOnBlack) {
    var pngStream = qr.image(text, {
      type: 'png',
      size: '64'
    });

    return streamToArray(pngStream)
      .then( (parts) => {
        const buffers = parts.map(part => Buffer.from(part));
        const buffer = Buffer.concat(buffers);

        return cropImage(buffer, whiteOnBlack)
      }).then( (bitmap) => {
        return this.image(bitmap);
      })
  }
}

function getPixelValue(pixelArray, x, y) {
  var i = (y * 128) + x
  return pixelArray[i]
}

/**
 * Crops the given buffer
 * and returns a promise for the new cropped buffer.
 * Default is black on white, but if you set invertTheImage then
 * we'll do white on black.
 */
function cropImage(sourceBuffer, invertTheImage) {
  var backgroundColor = 0xFFFFFFFF
  var backgroundImage = new Jimp(128, 64, backgroundColor);

  return Jimp.read(sourceBuffer)
    .then(function (originalImage) {
      let combinedImage = backgroundImage.composite(originalImage, 0, 0)
      if (invertTheImage) {
        combinedImage = combinedImage.invert()
      }
      return getJimpPixels(combinedImage)
    })
}

/**
 * Returns an array of pixels in the given image buffer
 */
function getJimpPixels(jimpImage) {
  const pix = new Array(128*64)
  for (var x = 0; x < 128; ++x) {
    for (var y = 0; y < 64; ++y) {
      var color = jimpImage.getPixelColor(x,y)
      var i = (y * 128) + x
      if (color == 255) {
        pix[i] = 0
      } else {
        pix[i] = 1
      }
    }
  }
  return pix
}

/**
 * Returns an array of all the command bytes needed to initialize the display.
 */
function getInitCommandBytes() {
  const commandBytes = []

  // 128x64 pixel specific initialization.
  commandBytes.push(SSD1306_DISPLAYOFF)                    // 0xAE
  commandBytes.push(SSD1306_SETDISPLAYCLOCKDIV)            // 0xD5
  commandBytes.push(0x80)                                  // the suggested ratio 0x80
  commandBytes.push(SSD1306_SETMULTIPLEX)                  // 0xA8
  commandBytes.push(0x3F)
  commandBytes.push(SSD1306_SETDISPLAYOFFSET)              // 0xD3
  commandBytes.push(0x0)                                   // no offset
  commandBytes.push(SSD1306_SETSTARTLINE | 0x0)            // line #0
  commandBytes.push(SSD1306_CHARGEPUMP)                    // 0x8D

  if (this._vccstate == SSD1306_EXTERNALVCC) {
    commandBytes.push(0x10)
  } else {
    commandBytes.push(0x14)
  }

  commandBytes.push(SSD1306_MEMORYMODE)                    // 0x20
  commandBytes.push(0x00)                                  // 0x0 act like ks0108
  commandBytes.push(SSD1306_SEGREMAP | 0x1)
  commandBytes.push(SSD1306_COMSCANDEC)
  commandBytes.push(SSD1306_SETCOMPINS)                    // 0xDA
  commandBytes.push(0x12)
  commandBytes.push(SSD1306_SETCONTRAST)                   // 0x81

  if (this._vccstate == SSD1306_EXTERNALVCC) {
    commandBytes.push(0x9F)
  } else {
    commandBytes.push(0xCF)
  }
  commandBytes.push(SSD1306_SETPRECHARGE)                  // 0xd9

  if (this._vccstate == SSD1306_EXTERNALVCC) {
    commandBytes.push(0x22)
  } else {
    commandBytes.push(0xF1)
  }
  commandBytes.push(SSD1306_SETVCOMDETECT)                 // 0xDB
  commandBytes.push(0x40)
  commandBytes.push(SSD1306_DISPLAYALLON_RESUME)           // 0xA4
  commandBytes.push(SSD1306_NORMALDISPLAY)                 // 0xA6

  //Turn on the display.
  commandBytes.push(SSD1306_DISPLAYON)

  return commandBytes
}

function assertInt(name, value, min, max) {
  console.assert(
    (Number.isInteger(value)) && (value >= 0) && (value <= max),
    `Invalid ${name}: ${value}. Should be ${min} - ${max}.`
  )
}

module.exports = DisplayDriver