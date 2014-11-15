var fs = require('fs');
var join = require('path').join;
var assert = require('assert');

var stream = fs.createReadStream(join(__dirname, 'input.txt'));
var LineTransform = require('..').LineTransform;
var transform = new LineTransform();

describe('LineTransform', function () {
    var lines = [];
    var hasntEnded = true;

    it('shoould generate \'data\' events with test lines and \'end\' event at the end of processing', function (done) {
        stream.pipe(transform);

        transform.on('data', function (line) {
            assert.notEqual(line, null);
            assert(hasntEnded);
            lines.push(line);
        });

        transform.on('end', function () {
            hasntEnded = false;
            done();
        });
    });

    it('should generate 63 lines', function () {
        assert.equal(lines.length, 63);
        assert.equal(lines[0], 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.');
        assert.equal(lines[62], 'Quisque finibus eros nec faucibus laoreet.');
    })
});
