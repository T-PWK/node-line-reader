(function () {
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

		// Check if the line of text matches includes and does not match excludes
		if(checkFilters(self._include, line, true, self._include.length === 0) &&
			checkFilters(self._exclude, line, false, true)) {

			self.push(line);
		}
	}

	function checkFilters (patterns, line, hasMatch, noMatch) {
		for(var i = patterns.length - 1; i >= 0; i--) {
			if(patterns[i].test(line)) {
				return hasMatch;
			}
		}
		return noMatch;
	}

	LineFilter.prototype._transform = function (line, encoding, done) {
		filter.call(this, this, this._decoder.write(line));

		done();
	};

	LineFilter.prototype._flush = function (done) {
		done();
	};

	module.exports = LineFilter;
}());