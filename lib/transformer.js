(function () {
	"use strict";

	var util = require('util');
	var Transform = require('stream').Transform;
	var StringDecoder = require('string_decoder').StringDecoder;

	util.inherits(LineTransformer, Transform);

	function LineTransformer(options) {
		if (!(this instanceof LineTransformer)) {
			return new LineTransformer(options);
		}

		Transform.call(this, options);
		this._writableState.objectMode = false;
		this._readableState.objectMode = true;
		this._buffer = '';
		this._decoder = new StringDecoder('utf8');
	}

	LineTransformer.prototype._transform = function (chunk, encoding, done) {
		this._buffer += this._decoder.write(chunk);

		var lines = this._buffer.split(/\r?\n/);

		// Keep the last (potentially) partial line buffered
		this._buffer = lines.pop();

		// Process all lines
		lines.forEach(this.push.bind(this));

		done();
	};

	LineTransformer.prototype._flush = function (done) {
		var rem = this._buffer.trim();

		if(rem) {
			this.push(rem);
		}

		done();
	};

	module.exports = LineTransformer;
}());
