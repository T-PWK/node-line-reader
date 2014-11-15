
================
[![Build Status](https://travis-ci.org/T-PWK/node-line-reader.svg)](https://travis-ci.org/T-PWK/node-line-reader) [![Code Climate](https://codeclimate.com/github/T-PWK/node-line-reader/badges/gpa.svg)](https://codeclimate.com/github/T-PWK/node-line-reader) [![Test Coverage](https://codeclimate.com/github/T-PWK/node-line-reader/badges/coverage.svg)](https://codeclimate.com/github/T-PWK/node-line-reader)

## Node Line Reader

Node Line Reader is a [Node.js](http://nodejs.org/) module that helps you reading lines of text from files.

Installation:
```
npm install TBD?
```

### Usage:
Using LineTransform

```javascript
var fs = require('fs');
var join = require('path').join;

var stream = fs.createReadStream(join(__dirname, 'input.txt')); // Create read stream
var LineTransform = require('???').LineTransform;
var transform = new LineTransform();

stream.pipe(transform); // Pipe input from a file stream over to line transform

transform.on('data', function(line) {
    // line - single line of text from input file
});

transform.on('end', function(line) {
});
```

### API:

#### Class: LineTransform

##### Event: 'readable'
When a line of text can be read from the transform, it will emit a 'readable' event.

##### Event: 'data'
- `line` Buffer | String The line of text.

##### Event: 'end'
This event fires when there will be no more test to read.

##### Event: 'close'
As [Stream 'close' event](http://nodejs.org/api/stream.html#stream_event_close): Emitted when the underlying resource (for example, the backing file descriptor) has been closed. Not all streams will emit this.

##### Event: 'error'
As [Stream 'close' event](http://nodejs.org/api/stream.html#stream_event_error): Emitted if there was an error receiving data.

### License:

The MIT License (MIT)

Copyright © 2014 Tom Pawlak
