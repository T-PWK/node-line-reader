 "use strict";

var fs = require('fs');
var LineTransformer = require('./transformer');
var StringDecoder = require('string_decoder').StringDecoder;

var LineReader = module.exports = function LineReader (file, options) {
    this.file = (typeof file === 'object') ? this.file = options.input : file;

    if(!fs.existsSync(this.file)) {
        throw new Error('File: ' + file + ' does not exist');
    }

    options = options || {};
    this._encoding = options.encoding || 'utf8';
    this._decoder = new StringDecoder(this._encoding);
    this._reader = new LineTransformer();

    this._stream = fs.createReadStream(this.file);
    this._stream.setEncoding(this._encoding);

    this._init = false;
    this._end = false;
}

LineReader.prototype.nextLine = function (cb) {
    var dataFn = dataHandler.bind(this, cb), 
        endFn = endHandler.bind(this, cb);

    if(!this._init) {
        this._init = true;
        this._stream.pipe(this._reader);
    }

    if(this._end) {
        return cb(null, null);
    }
    
    this._reader.on('error', cb);
    this._reader.on('data', dataHandler);
    this._reader.on('end', endHandler);
    this._reader.resume();

    function endHandler (cb) {
        self._end = true;
        self._reader.removeListener('error', cb);

        cb(null, null);
    }

    function dataHandler (cb, line) {
        self._reader.pause();
        self._reader.removeListener('error', cb);

        cb(null, self._decoder.write(line));
    }
};