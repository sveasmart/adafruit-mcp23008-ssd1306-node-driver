const qr = require('node-qr-image')


var qr_svg = qr.image('http://www.kniberg.com', {
  type: 'png',
  size: '64'
});
qr_svg.pipe(require('fs').createWriteStream('qrtest3.png'));