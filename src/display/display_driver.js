const qr = require('node-qr-image')
const toArray = require('stream-to-array')
const lwip = require('lwip')
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

  qrCode(text) {
    var png = qr.image(text, {
      type: 'png',
      size: '64'
    });

    const oled = this.getOled()

    var pngtolcd = require('png-to-lcd');

    toArray(png)
      .then(function (parts) {
        const buffers = parts.map(part => Buffer.from(part));
        const buffer = Buffer.concat(buffers);

        lwip.open(buffer, "png", function(err, image){

          // check err...
          if (err) {
            console.log(err)
            return
          }

          // check err...
          // manipulate image:
          image.crop(128+64, 64, function(err, image){
            // check err...
            if (err) {
              console.log(err)
              return
            }

            // encode to png and get a buffer object:
            image.toBuffer('png', function(err, croppedBuffer){

              // check err...
              if (err) {
                console.log(err)
                return
              }

              const fileName = "qrcode-cropped.png"
              fs.writeFileSync(fileName, croppedBuffer)


              pngtolcd(fileName, false, function(err, bitmap) {
                if (err) {
                  console.log("Error while generating QR code!", err)
                  return
                }
                oled.buffer = bitmap;
                oled.update();
                fs.unlinkSync(fileName)
              });

            });

          });

        });

      })
      .catch(function(err) {
        console.log("error", err)
      })


  }
}

module.exports = DisplayDriver