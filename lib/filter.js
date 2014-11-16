"use strict";

var util = require('util');
var Transform = require('stream').Transform;
var StringDecoder = require('string_decoder').StringDecoder;

util.inherits(LineFilter, Transform);

function LineFilter(options) {
    if (!(this instanceof LineFilter)) {
        return new LineFilter(options);
    }

    Transform.call(this, options);
    this._writableState.objectMode = true;
    this._readableState.objectMode = true;
    this._decoder = new StringDecoder('utf8');

    options = options || {};

    var include = options.include || [];
    var exclude = options.exclude || [];

    if (!util.isArray(include)) {
        include = [include];
    }

    if(!util.isArray(exclude)) {
        exclude = [exclude];
    }

    this._include = include;
    this._exclude = exclude;

    if (options.skipEmpty) {
        this._exclude.push(/^$/);
    }

    if (options.skipBlank) {
        this._exclude.push(/^\s+$/);
    }
}

function filter(self, line) {
    var emit = self._include.length == 0, i;

    for(i = self._include.length - 1; i >= 0; i--) {
        if(self._include[i].test(line)) {
            emit = true;
            break;
        }
    }

    for(i = self._exclude.length - 1; i >= 0; i--) {
        if(self._exclude[i].test(line)) {
            emit = false;
            break;
        }
    }

    if(emit) {
        self.push(line);
    }
}

LineFilter.prototype._transform = function (line, encoding, done) {
    filter.call(this, this, this._decoder.write(line));

    done();
};

LineFilter.prototype._flush = function (done) {
    done();
};

module.exports = LineFilter;
