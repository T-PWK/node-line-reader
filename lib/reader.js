(function () {
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

		this._source = fs.createReadStream(this.file);
		this._source.setEncoding(this._encoding);

		this._init = false;
		this._end = false;
		this._cbs = [];
	};

	LineReader.prototype.nextLine = function (cb) {
		if(!this._init) {
			this._init = true;
			this._source.pipe(this._reader);
			this._reader.on('data', onData.bind(this));
			this._reader.on('end', onEnd.bind(this));
		}

		if(this._end) {
			return cb(null, null);
		}

		this._cbs.push(cb);
		this._reader.resume();

		/*jshint validthis:true */
		function onData(line) {
			this._cbs.shift()(null, this._decoder.write(line));

			if(this._cbs.length === 0) {
				this._reader.pause();
			}
		}

		/*jshint validthis:true */
		function onEnd() {
			this._end = true;
			this._cbs.forEach(function (cb) {
				cb(null, null);
			});
			this._cbs = [];
		}
	};
}());
