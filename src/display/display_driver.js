const qr = require('node-qr-image')
const toArray = require('stream-to-array')
const Jimp = require('jimp')
const path = require('path')

const fs = require("fs")

class DisplayDriver {
  /**
   * 
   * @param busNumber default 1
   * @param address default 0x3C
   * @param width default 128
   * @param height default 64
   */
  constructor(busNumber, address, width, height) {
    this.i2c = require('i2c-bus')
    this.oledBus = require('oled-i2c-bus');
    this.font = require('oled-font-5x7');

    this.busNumber = busNumber ? busNumber : 1
    this.address = address ? address : 0x3C
    this.width = width ? width : 128
    this.height = height ? height : 64
  }

  text(message) {
    var oled = this.getOled()
    oled.fillRect(0, 0, this.width, this.height, 0);
    oled.setCursor(1,1)
    oled.writeString(this.font, 1, message, 1, true)
    oled.update()
  }

  clear() {
    var oled = this.getOled()
    oled.fillRect(0, 0, this.width, this.height, 0);
    oled.update()
  }

  getOled() {
    const bus = this.i2c.openSync(this.busNumber)
    return new this.oledBus(bus, {
      width: this.width,
      height: this.height,
      address: this.address
    });
  }

  qrCode(text, whiteOnBlack) {
    var png = qr.image(text, {
      type: 'png',
      size: '64'
    });

    const oled = this.getOled()


    toArray(png)
      .then(function (parts) {
        const buffers = parts.map(part => Buffer.from(part));
        const buffer = Buffer.concat(buffers);

        cropImage(buffer, whiteOnBlack, function(err, croppedBuffer) {
          // check err...
          if (err) {
            console.log(err)
            return
          }

          const fileName = "qrcode-cropped.png"
          fs.writeFileSync(fileName, croppedBuffer)


          var pngtolcd = require('png-to-lcd');
          pngtolcd(fileName, false, function(err, bitmap) {
            if (err) {
              console.log("Error while generating QR code!", err)
              return
            }
            oled.buffer = bitmap;
            oled.update();
            fs.unlinkSync(fileName)
          });
        })

      })
      .catch(function(err) {
        console.log("error", err)
      })


  }
}



/**
 * Crops the given buffer and sends a new buffer to the given callback
 */
function cropImage(sourceBuffer, whiteOnBlack, callback) {
  const emptyImageFile = path.resolve(__dirname, 'empty-128x64-image.png')
  console.log("file", emptyImageFile)

  Jimp.read(emptyImageFile).then(function (image) {
    Jimp.read(sourceBuffer).then(function (image2) {
      //add a .invert() to invert it.
      image = image.composite(image2, 0, 0)
      if (whiteOnBlack) {
        image = image.invert()
      }
      image.getBuffer(Jimp.MIME_PNG, callback)
    })
  }).catch(function (err) {
    console.log(err)
    callback(err)
  });
}

module.exports = DisplayDriver