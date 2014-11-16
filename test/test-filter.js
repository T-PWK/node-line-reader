var fs = require('fs');
var join = require('path').join;
var assert = require('assert');
var LineTransform = require('..').LineTransform;
var LineFilter = require('..').LineFilter;


function getStream(name) {
    return fs.createReadStream(join(__dirname, name || 'input.txt'));
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
            assert.equal(lines.length, 52);
            lines.forEach(function (line) {
                assert.notEqual(line.indexOf('P'), 0);
            });
        });
    });

    describe('with several include and no exclude', function () {
        var lines = [], transform = new LineTransform(),
            filter = new LineFilter({ include: [/P/, /Sed/] });

        getStream().pipe(transform).pipe(filter);

        it('shoould generate \'data\' events for each line of text and \'end\' event', function (done) {
            extractLinesOfText(lines, filter, done);
        });

        it('should return lines starting with \'P\' and \'Sed\'', function () {
            assert.equal(lines.length, 16);
            lines.forEach(function (line) {
                assert(line.indexOf('P') === 0 || line.indexOf('Sed') === 0);
            });
        });
    });

    describe('with several excludes and no include', function () {
        var lines = [], transform = new LineTransform(),
            filter = new LineFilter({ exclude: [/P/ , /Sed/]});

        getStream().pipe(transform).pipe(filter);

        it('shoould generate \'data\' events for each line of text and \'end\' event', function (done) {
            extractLinesOfText(lines, filter, done);
        });

        it('should return only lines not starting with \'P\' nor \'Sed\'', function () {
            assert.equal(lines.length, 47);
            lines.forEach(function (line) {
                assert(line.indexOf('P') !== 0 && line.indexOf('Sed') !== 0);
            });
        });
    });

    describe('with some excludes and includes', function () {
        var lines = [], transform = new LineTransform(),
            filter = new LineFilter({ include: [/P/ , /Sed/], exclude: [/s\.$/] });

        getStream().pipe(transform).pipe(filter);

        it('shoould generate \'data\' events for each line of text and \'end\' event', function (done) {
            extractLinesOfText(lines, filter, done);
        });

        it('should return only lines starting with \'P\' nor \'Sed\' and not ending with \'s.\'', function () {
            assert.equal(lines.length, 11);
            lines.forEach(function (line) {
                assert(line.indexOf('P') === 0 || line.indexOf('Sed') === 0);
                assert.equal(line.indexOf('s.', line.length - 2), -1);
            });
        });
    });

    describe('matching lines with \' et \' text inside', function () {
        var lines = [], transform = new LineTransform(),
            filter = new LineFilter({ include: [/\bet\b/]});

        getStream().pipe(transform).pipe(filter);

        before(function (done) {
            extractLinesOfText(lines, filter, done);
        })

        it('should return only 6 lines', function () {
            assert.equal(lines.length, 6);
            lines.forEach(function (line) {
                assert(line.indexOf(' et ') > 0);
            });
        });
    });

    describe('matching lines except empty lines', function () {
        var lines = [], transform = new LineTransform(),
            filter = new LineFilter({ skipEmpty: true });

        getStream('input-blanks.txt').pipe(transform).pipe(filter);

        before(function (done) {
            extractLinesOfText(lines, filter, done);
        })

        it('should return 11 lines: 10 with text and 1 blank (spaces only)', function () {
            assert.equal(lines.length, 11);
            lines.forEach(function (line) {
                assert(line.length > 0);
            });
        });
    });

    describe('matching lines except blank lines', function () {
        var lines = [], transform = new LineTransform(),
            filter = new LineFilter({ skipBlank: true });

        getStream('input-blanks.txt').pipe(transform).pipe(filter);

        before(function (done) {
            extractLinesOfText(lines, filter, done);
        })

        it('should return 13 lines: 10 with text and 3 empty', function () {
            assert.equal(lines.length, 13);
            lines.forEach(function (line) {
                assert(line.length !== 2);
            });
        });
    });

    describe('matching lines except empty and empty lines', function () {
        var lines = [], transform = new LineTransform(),
            filter = new LineFilter({ skipEmpty: true, skipBlank: true });

        getStream('input-blanks.txt').pipe(transform).pipe(filter);

        before(function (done) {
            extractLinesOfText(lines, filter, done);
        })

        it('should return 10 lines of text (no empty and no blank lines)', function () {
            assert.equal(lines.length, 10);
            lines.forEach(function (line) {
                assert(line.length > 10);
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
