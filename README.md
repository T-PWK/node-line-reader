[![Build Status](https://travis-ci.org/T-PWK/node-line-reader.svg)](https://travis-ci.org/T-PWK/node-line-reader) [![npm version](https://badge.fury.io/js/node-line-reader.svg)](http://badge.fury.io/js/node-line-reader) [![Code Climate](https://codeclimate.com/github/T-PWK/node-line-reader/badges/gpa.svg)](https://codeclimate.com/github/T-PWK/node-line-reader) [![Test Coverage](https://codeclimate.com/github/T-PWK/node-line-reader/badges/coverage.svg)](https://codeclimate.com/github/T-PWK/node-line-reader)

## Node Line Reader

Node Line Reader is a [Node.js](http://nodejs.org/) module that helps you reading lines of text from files.

Features:
- Reads lines of text from Readable streams e.g. files
- Reads lines that match one or more patterns
- Skips lines that match one or more patterns e.g. empty lines
- Reads part of files

Installation:
```
npm install node-line-reader
```

### Usage:
##### Using `LineReader`

```javascript
var path = require('path');
var reader = new LineReader(path.join('/home/user', 'some-file.txt'));
reader.nextLine(function (err, line) {
    if (!err) {
        console.log('file line: ', line);
    }
});
```

##### Using `LineTransform`

```javascript
var stream = getSomeReadableStream(); // Create read stream
var LineTransform = require('node-line-reader').LineTransform;  // LineTransform constructor
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
`LineTransform` is a duplex stream converting input text into lines of text. `LineTransform` instance can be piped into antoher [Writable](http://nodejs.org/api/stream.html#stream_class_stream_writable) instance.

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
