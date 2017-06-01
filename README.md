# Node driver for Adafruit MCP23008 and SSD1306

This package is designed to let us talk to
[this thing](https://www.hwhardsoft.de/english/projects/display-shield/) using node
on a Rasberry Pi running Raspbian.

That is, we can detect button presses and write stuff to the display.

## How to install

`npm install adafruit-mcp23008-ssd1306-node-driver`

## How to use it

Try this to run a quick demo. It echos button presses to the display.
```javascript
const adafruit = require("adafruit-mcp23008-ssd1306-node-driver")
adafruit.demo()
```


Here's how to do it yourself:

```javascript
const adafruit = require("adafruit-mcp23008-ssd1306-node-driver")
const ButtonDriver = adafruit.ButtonDriver
const DisplayDriver = adafruit.DisplayDriver

const busNumber = 1

const displayAddress = 0x3c
const displayDriver = new DisplayDriver(busNumber, displayAddress)

const buttonsAddress = 0x20
const buttonDriver = new ButtonDriver(busNumber, buttonsAddress)

buttonDriver.watchAllButtons(function(buttonPin) {
  displayDriver.writeText("Clicked button #" + buttonPin)
})

displayDriver.writeText("OK, click some buttons")
console.log("Check the display...")
```

You can also watch just one button:

```javascript
buttonDriver.watchButton(1, function(buttonPin) {
  console.log("Clicked button #" + buttonPin)
})
```


You can also display QR codes:

```javascript
displayDriver.setQrCode("http://www.google.com")
```

Note that the display driver runs a background loop to keep the display refreshed.
So your process won't exit until you call:

```javascript
displayDriver.stop()
```

## Using tabs
This driver has a "tab" mechanism, using the metaphor of tabs in a web browser.
Send the tab name as the last parameter of any method. If you don't specify a tab, it will use "default".
Switch the current using displayDriver.showTab(...).

Example:

```javascript
displayDriver.writeText("First tab", 0, 0, false, "tab1")
displayDriver.writeText("Second tab", 0, 0, false, "tab2")
displayDriver.showTab("tab2")
```

If you write stuff on a tab that isn't the current tab, then nothing changes on the display until you
show that tab. Just like with real tabs.


## Testing

If you are in a development environment with no access to the actual screen,
you can use the fakes.

```javascript
const adafruit = require("adafruit-mcp23008-ssd1306-node-driver")

console.log("Has driver: ", adafruit.hasDriver())
const fakeDisplayDriver = new adafruit.FakeDisplayDriver()
const fakeButtonDriver = new adafruit.FakeButtonDriver()
```

* FakeDisplayDriver: has all the same methods as DisplayDriver,
  but displays on the terminal instead of the SSD1306 display.
* FakeButtonDriver: has all the same methods as ButtonDriver,
  but you simulate button presses using your keyboard (press 0, 1, or 2).


## How it works internally

The button stuff is a node port of this code:
* https://github.com/adafruit/Adafruit-Raspberry-Pi-Python-Code/blob/legacy/Adafruit_MCP230xx/Adafruit_MCP230xx.py
* https://github.com/HWHardsoft/Display_Shield_RPI/blob/master/standard_test.py

For display stuff is a wrapper around:
* https://www.npmjs.com/package/oled-i2c-bus
