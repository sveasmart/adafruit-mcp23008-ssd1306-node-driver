const qr = require('node-qr-image')

const toArray = require('stream-to-array')
const Jimp = require('jimp')
const path = require('path')

const fs = require("fs")

var pngparse = require("pngparse")

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

class DisplayDriver {
  /**
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


    var rst = 42
    var dc = null
    var sclk = null
    var din = null
    var cs = null
    var gpio = null
    var spi = null
    var i2c_bus = null
    var i2c_address = SSD1306_I2C_ADDRESS
    var i2c = null


    this._spi = null
    this._i2c = null
    //this.width = width
    //this.height = height
    this._pages = Math.floor(this.height / 8)

    this._buffer = new Array(this.width * this._pages)
    this._buffer.fill(0)
    // Default to platform GPIO if not provided.
    /*
    this._gpio = gpio
    if (this._gpio == null) {
      this._gpio = GPIO.get_platform_gpio()
    }
    */

    this._gpio = require('rpio')

    // Setup reset pin.
    this._rst = rst
    //this._gpio.setup(this._rst, GPIO.OUT)
    


    this._i2c = require('i2c-bus').openSync(this.busNumber)

  }

  _initialize() {
    // 128x64 pixel specific initialization.
    this.command(SSD1306_DISPLAYOFF)                    // 0xAE
    this.command(SSD1306_SETDISPLAYCLOCKDIV)            // 0xD5
    this.command(0x80)                                  // the suggested ratio 0x80
    this.command(SSD1306_SETMULTIPLEX)                  // 0xA8
    this.command(0x3F)
    this.command(SSD1306_SETDISPLAYOFFSET)              // 0xD3
    this.command(0x0)                                   // no offset
    this.command(SSD1306_SETSTARTLINE | 0x0)            // line #0
    this.command(SSD1306_CHARGEPUMP)                    // 0x8D

    if (this._vccstate == SSD1306_EXTERNALVCC) {
      this.command(0x10)
    } else {
      this.command(0x14)
    }

    this.command(SSD1306_MEMORYMODE)                    // 0x20
    this.command(0x00)                                  // 0x0 act like ks0108
    this.command(SSD1306_SEGREMAP | 0x1)
    this.command(SSD1306_COMSCANDEC)
    this.command(SSD1306_SETCOMPINS)                    // 0xDA
    this.command(0x12)
    this.command(SSD1306_SETCONTRAST)                   // 0x81

    if (this._vccstate == SSD1306_EXTERNALVCC) {
      this.command(0x9F)
    } else {
      this.command(0xCF)
    }
    this.command(SSD1306_SETPRECHARGE)                  // 0xd9

    if (this._vccstate == SSD1306_EXTERNALVCC) {
      this.command(0x22)
    } else {
      this.command(0xF1)
    }
    this.command(SSD1306_SETVCOMDETECT)                 // 0xDB
    this.command(0x40)
    this.command(SSD1306_DISPLAYALLON_RESUME)           // 0xA4
    this.command(SSD1306_NORMALDISPLAY)                 // 0xA6
  }

  command(c) {
    //console.log("c", c)
    var control = 0x00   // Co = 0, DC = 0
    this._i2c.writeByteSync(this.address, control, c)
  }

  begin(vccstate) {
    if (!vccstate) {
      vccstate = SSD1306_SWITCHCAPVCC
    }
    // Save vcc state.
    this._vccstate = vccstate
    // Reset and initialize display.
    this.reset()
    this._initialize()
    //Turn on the display.
    this.command(SSD1306_DISPLAYON)

  }

  reset() {
    /*
    console.log("rst", this._rst)

    this._gpio.open(this._rst, this._gpio.OUTPUT, this._gpio.LOW)


    this._gpio.write(this._rst, this._gpio.HIGH )
    setTimeout(() => {
      this._gpio.write(this._rst, this._gpio.LOW )
      setTimeout(() => {
        this._gpio.write(this._rst, this._gpio.HIGH )
      }, 0.010)
    }, 0.001)
    */
  }



  display() {
    //Write display buffer to physical display.
    this.command(SSD1306_COLUMNADDR)
    this.command(0)              // Column start address. (0 = reset)
    this.command(this.width-1)   // Column end address.
    this.command(SSD1306_PAGEADDR)
    this.command(0)              //Page start address. (0 = reset)
    this.command(this._pages-1)  // Page end address.

    var control = 0x40   // Co = 0, DC = 0

    for (var j = 0; j < this._buffer.length; ++j) {
      //TODO optimize?
      this._i2c.writeByteSync(this.address, control, this._buffer[j])
    }
  }
  
  image(pix) {
    //Set buffer to value of Python Imaging Library image.  The image should be in 1 bit mode and a size equal to the display size.
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
  }

  texts(lines) {
    this._buffer.fill(0)

    for (var lineNumber = 0; lineNumber < lines.length; ++lineNumber) {
      this.drawString(lines[lineNumber], 0, lineNumber)
    }
    this.display()
  }

  text(message, column, row) {
    this._buffer.fill(0)
    if (!column) {
      column = 0
    }
    if (!row) {
      row = 0
    }

    this.drawString(message, column, row)
    this.display()
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

  drawString(string, column, row) {
    for (var i = 0; i < string.length; ++i) {
      this.drawChar(string[i], column + i, row)
    }
    //this.display()
  }

  drawChar(char, charX, charY) {
    const buf = this.findCharBuf(this.font, char)
    for (var i = 0; i < buf.length; ++i) {
      var x = charX * 8
      var y = charY
      var bufferPos = x + (y * 256)
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
      this.image(getJimpPixels(image))
      this.display()
    }).catch(function (err) {
      console.error(err);
    });

  }

  clear() {
    this._buffer.fill(0)
    this.display()
  }

  qrCode(text, whiteOnBlack) {
    var png = qr.image(text, {
      type: 'png',
      size: '64'
    });

    toArray(png)
      .then( (parts) => {
        const buffers = parts.map(part => Buffer.from(part));
        const buffer = Buffer.concat(buffers);

        cropImage(buffer, whiteOnBlack, (err, bitmap) => {
          // check err...
          if (err) {
            throw err
          }
          this.image(bitmap);
          this.display()

        })
      })
      .catch(function(err) {
        console.log("error", err)
      })
  }
}

function getPixelValue(pixelArray, x, y) {
  var i = (y * 128) + x
  return pixelArray[i]
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}


/**
 * Crops the given buffer and sends a new buffer to the given callback
 */
function cropImage(sourceBuffer, whiteOnBlack, callback) {

  var image = new Jimp(128, 64);
  Jimp.read(sourceBuffer).then(function (image2) {
    //add a .invert() to invert it.
    image = image.composite(image2, 0, 0)
    if (whiteOnBlack) {
      image = image.invert()
    }

    const pix = getJimpPixels(image)
    callback(null, pix)
  })
}

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

module.exports = DisplayDriver