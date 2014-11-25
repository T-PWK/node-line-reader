[![Build Status](https://travis-ci.org/T-PWK/node-line-reader.svg)](https://travis-ci.org/T-PWK/node-line-reader) [![npm version](https://badge.fury.io/js/node-line-reader.svg)](http://badge.fury.io/js/node-line-reader) [![Code Climate](https://codeclimate.com/github/T-PWK/node-line-reader/badges/gpa.svg)](https://codeclimate.com/github/T-PWK/node-line-reader) [![Test Coverage](https://codeclimate.com/github/T-PWK/node-line-reader/badges/coverage.svg)](https://codeclimate.com/github/T-PWK/node-line-reader)

Node Line Reader
========================

Node Line Reader is a [Node.js](http://nodejs.org/) module that helps you reading lines of text from a file.

Features:
- Reads lines of text from Readable streams e.g. a file
- Reads lines that match one or more patterns
- Skips lines that match one or more patterns e.g. empty lines
- Reads part of a file

Installation:
```
npm install node-line-reader
```

## Usage:

### Using `LineReader`

```js
var path = require('path');
var LineReader = require('node-line-reader').LineReader;

var reader = new LineReader(path.join('/home/user', 'some-file.txt'));

// Each execution of nextLine will get a following line of text from the input file
reader.nextLine(function (err, line) {
    if (!err) {
        console.log('file line: ', line);
    }
});
```

### Using `LineTransform`

```js
var stream = getSomeReadableStream(); // Create read stream
var LineTransform = require('node-line-reader').LineTransform;  // LineTransform constructor
var transform = new LineTransform();

stream.pipe(transform); // Pipe input from a file stream over to line transform

transform.on('data', function(line) {
    // line - single line of text from input file
});

transform.on('end', function() {
    // no more text lines
});
```

### Using `LineFilter`

```js
var stream = getSomeReadableStream(); // Create read stream
var LineTransform = require('node-line-reader').LineTransform;  // LineTransform constructor
var LineFilter = require('node-line-reader').LineFilter;  // LineFilter constructor

var transform = new LineTransform();

// Skip empty lines and lines with "et" (with leading and trailing space) in them
var filter = new LineFilter({ skipEmpty: true, exclude: [/\bet\b/ });

// Pipe input from a file stream over to line transform and to the filter
stream.pipe(transform).pipe(filter); 

filter.on('data', function(line) {
    // line - single line of text from input file
});

filter.on('end', function() {
    // no more text lines
});
```

## API:

### Class: `LineReader`
`LineReader` is a text lines reader from a specified file.

#### 'LineReader.nextLine(cb)' 
This function reads another line of text from a specified file and passes it over to the callback method.

The callback has arguments `(err, line)`. The `err` argument is an error that occurred while reading a line of text (`null` if no error occurred). The `line` is a string with line of text from a specified input file.

### Class: `LineFilter`
`LineFilter` is a duplex stream passing through lines of text matching include and exclude rules. `LineFilter` instance can be piped into antoher [Writable](http://nodejs.org/api/stream.html#stream_class_stream_writable) instance.

The `LineFilter` accepts options objects with following parameters:
- `skipEmpty` - boolean value blocking empty lines
- `skipBlank` - boolean value blocking blank lines (lines composed of whitespace characters)
- `include` - a single instance or an array of regular expressions (see below for text filtering rules)
- `exclude` - a single instance or an array of regular expressions (see below for text filtering rules)

**Text filtering rules**:
- If only `include` pattern(s) are provided, filter will pass through lines of text which are matched by the include pattern(s) only
- If only `exclude` pattern(s) are provided, fillter will pass through all lines except the ones which are matched by the exclude pattern(s) only
- If `include` and `exclude` pattern(s) are provided, filter filter will pass through lines of text which are matched by the include pattern(s) and not matched by the exclude pattern(s)

#### Event: 'readable'
When a line of text can be read from the transform, it will emit a 'readable' event.

#### Event: 'data'
- `line` Buffer | String The line of text.

#### Event: 'end'
This event fires when there will be no more test to read.

#### Event: 'close'
As [Stream 'close' event](http://nodejs.org/api/stream.html#stream_event_close): Emitted when the underlying resource (for example, the backing file descriptor) has been closed. Not all streams will emit this.

#### Event: 'error'
As [Stream 'close' event](http://nodejs.org/api/stream.html#stream_event_error): Emitted if there was an error receiving data.

### Class: `LineTransform`
`LineTransform` is a duplex stream converting input text into lines of text. `LineTransform` instance can be piped into antoher [Writable](http://nodejs.org/api/stream.html#stream_class_stream_writable) instance.

#### Event: 'readable'
When a line of text can be read from the transform, it will emit a 'readable' event.

#### Event: 'data'
- `line` Buffer | String The line of text.

#### Event: 'end'
This event fires when there will be no more test to read.

#### Event: 'close'
As [Stream 'close' event](http://nodejs.org/api/stream.html#stream_event_close): Emitted when the underlying resource (for example, the backing file descriptor) has been closed. Not all streams will emit this.

#### Event: 'error'
As [Stream 'close' event](http://nodejs.org/api/stream.html#stream_event_error): Emitted if there was an error receiving data.

## Author

Writen by Tom Pawlak - [Blog](http://blog.tompawlak.org)

## License:

The MIT License (MIT)

Copyright © 2014 Tom Pawlak