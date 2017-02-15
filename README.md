# Node driver for Adafruit MCP23008 and SSD1306

This package is designed to let us talk to
[this thing](https://www.hwhardsoft.de/english/projects/display-shield/) using node
on a Rasberry Pi running Raspbian.

That is, we can detect button presses and write stuff to the display.

## How to install

`npm install adafruit-mcp23008-ssd1306-node-driver`

## How to use it

Try this to run a quick test. It echos button presses to the display.
```javascript
const adafruit = require("adafruit-mcp23008-ssd1306-node-driver ")
adafruit.test()
```


Here's how to do it yourself:

```javascript
const adafruit = require("adafruit-mcp23008-ssd1306-node-driver ")
const ButtonDriver = adafruit.ButtonDriver
const DisplayDriver = adafruit.DisplayDriver

const busNumber = 1

const displayAddress = 0x3c
const displayDriver = new DisplayDriver(busNumber, displayAddress)

const buttonsAddress = 0x20
const buttonDriver = new ButtonDriver(busNumber, buttonsAddress)

buttonDriver.watchAllButtons(function(buttonPin) {
  displayDriver.text("Clicked button #" + buttonPin)
})

displayDriver.text("OK, click some buttons")
console.log("Check the display...")
```

You can also watch just one button:

```javascript
buttonDriver.watchButton(1, function(buttonPin) {
  console.log("Clicked button #" + buttonPin)
})
```

For access to the full [oled api](https://www.npmjs.com/package/oled-i2c-bus)
use ```displayDriver.oled```.
For example:
```javascript
displayDriver.oled.invertDisplay(true)
```


## How it works internally

The button stuff is a node port of this code:
* https://github.com/adafruit/Adafruit-Raspberry-Pi-Python-Code/blob/legacy/Adafruit_MCP230xx/Adafruit_MCP230xx.py
* https://github.com/HWHardsoft/Display_Shield_RPI/blob/master/standard_test.py

For display stuff is a wrapper around:
* https://www.npmjs.com/package/oled-i2c-bus
