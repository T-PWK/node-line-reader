


var LineTransform = require('./lib/transformer');
var fs = require('fs');

var stream = fs.createReadStream('.\\test\\input.txt');
var transform = new LineTransform();

stream.pipe(transform);

transform.on('data', function(chunk) {
  console.log('got %d bytes of data', chunk.length, chunk);
  transform.pause();
  console.log('there will be no more data for 1 second');
  setTimeout(function() {
    console.log('now data will start flowing again');
    transform.resume();
  }, 100);
})