# Node driver for Adafruit MCP23008 and SSD1306

This package is designed to let us talk to
[this thing](https://www.hwhardsoft.de/english/projects/display-shield/) using node
on a Rasberry Pi running Raspbian.

That is, we can detect button presses and write stuff to the display.

## How to install

`npm install adafruit-mcp23008-ssd1306-node-driver`

## How to detect button presses

First you need a ButtonDriver with the right config for you system:

```javascript
const adafruit = require("adafruit-mcp23008-ssd1306-node-driver")
const ButtonDriver = adafruit.ButtonDriver

const busNumber = 1
const address = 0x20

const buttonDriver = new ButtonDriver(busNumber, address)
```

Then you can watch all buttons:

```javascript
buttonDriver.watchAllButtons(function(buttonPin) {
  console.log("Clicked button #" + buttonPin)
})
```

Or just watch one button:

```javascript
buttonDriver.watchButton(1, function(buttonPin) {
  console.log("Clicked button #" + buttonPin)
})
```

## How to write stuff on the display

(coming soon)

## How it works internally

The button stuff is a node port of this code:
* https://github.com/adafruit/Adafruit-Raspberry-Pi-Python-Code/blob/legacy/Adafruit_MCP230xx/Adafruit_MCP230xx.py
* https://github.com/HWHardsoft/Display_Shield_RPI/blob/master/standard_test.py

For display stuff is a wrapper around:
* https://www.npmjs.com/package/oled-i2c-bus
