var fs = require('fs');
var join = require('path').join;
var assert = require('assert');
var LineTransform = require('..').LineTransform;
var LineFilter = require('..').LineFilter;


function getStream(argument) {
    return fs.createReadStream(join(__dirname, 'input.txt'));
}

describe('LineFilter', function () {

    describe('without any include and exclude filter', function () {
        var lines = [], transform = new LineTransform(), filter = new LineFilter();

        getStream().pipe(transform).pipe(filter);

        it('shoould generate \'data\' events for each line of text and \'end\' event', function (done) {
            extractLinesOfText(lines, filter, done);
        });

        it('should generate 63 lines', function () {
            assert.equal(lines.length, 63);
            assert.equal(lines[0], 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.');
            assert.equal(lines[62], 'Quisque finibus eros nec faucibus laoreet.');
        });
    });

    describe('with single include and no exclude', function () {
        var lines = [], transform = new LineTransform(),
            filter = new LineFilter({ include: /P/});

        getStream().pipe(transform).pipe(filter);

        it('shoould generate \'data\' events for each line of text and \'end\' event', function (done) {
            extractLinesOfText(lines, filter, done);
        });

        it('should return only lines starting with \'P\'', function () {
            assert.equal(lines.length, 11);
            lines.forEach(function (line) {
                assert.equal(line.indexOf('P'), 0);
            });
        });
    });

    describe('with single exclude and no include', function () {
        var lines = [], transform = new LineTransform(),
            filter = new LineFilter({ exclude: /P/});

        getStream().pipe(transform).pipe(filter);

        it('shoould generate \'data\' events for each line of text and \'end\' event', function (done) {
            extractLinesOfText(lines, filter, done);
        });

        it('should return only lines not starting with \'P\'', function () {
            lines.forEach(function (line) {
                assert.notEqual(line.indexOf('P'), 0);
            });
        });
    });


});

function extractLinesOfText(lines, stream, cb) {
    var hasntEnded = true;

    stream.on('data', function (line) {
        assert.notEqual(line, null);
        assert(hasntEnded);
        lines.push(line);
    });

    stream.on('end', function () {
        hasntEnded = false;
        cb();
    });
}

// var LineTransform = require('./lib/transformer');
// var fs = require('fs');
//
// var stream = fs.createReadStream('.\\test\\input.txt');
// var transform = new LineTransform();
//
// stream.pipe(transform);
//
// transform.on('data', function(chunk) {
//   console.log('got %d bytes of data', chunk.length, chunk);
//   transform.pause();
//   console.log('there will be no more data for 1 second');
//   setTimeout(function() {
//     console.log('now data will start flowing again');
//     transform.resume();
//   }, 100);
// })
