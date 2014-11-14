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

LineReader.prototype.nextLine = function (cb, id) {
    var self = this,
        dataFn = function (line) {
            self._reader.pause();
            self._reader.removeListener('error', cb);
            self._reader.removeListener('data', dataFn);

            cb(null, self._decoder.write(line));
        },
        endFn = function (cb) {
            self._end = true;
            self._reader.removeListener('error', cb);
            self._reader.removeListener('data', dataFn);

            cb(null, null);
        };

    if(!this._init) {
        this._init = true;
        this._stream.pipe(this._reader);
    }

    if(this._end) {
        return cb(null, null);
    }
    
    this._reader.on('error', cb);
    this._reader.on('data', dataFn);
    this._reader.on('end', endFn);
    this._reader.resume();
};