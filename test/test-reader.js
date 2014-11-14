var assert = require('assert');
var async  = require('async');
var path = require('path');
var LineReader = require('..').LineReader;

describe('LineReader', function () {
    describe('constructor', function () {

        it('should throw an exception if a specified file does not exist', function () {
            assert.throws(function () {
                var reader = new LineReader('file-does-not-exist.txt');
            });
        });

        it('should create a reader instace with no error if a file exists', function () {
            var reader = new LineReader(path.join(__dirname, 'input.txt'));
        });
    });

    describe('nextLine', function () {
        describe('should read line by line from the input file', function () {
            var reader;

            before(function () {
                reader = new LineReader(path.join(__dirname, 'input.txt'));
            });

            it('and the first line should start with \'Lorem ipsum dolor sit amet\'', function (done) {
                reader.nextLine(function (err, line) {
                    assert.ifError(err);
                    assert.equal(line, "Lorem ipsum dolor sit amet, consectetur adipiscing elit.");
                    done();
                }, 1);
            });

            it('and the second line should start with \'Integer placerat risus sed velit\'', function (done) {
                reader.nextLine(function (err, line) {
                    assert.ifError(err);
                    assert.equal(line, "Integer placerat risus sed velit vestibulum ultricies.");
                    done();
                }, 2);
            });

            it('and the third line should start with \'Praesent ut diam nec sapien\'', function (done) {
                reader.nextLine(function (err, line) {
                    assert.ifError(err);
                    assert.equal(line, "Praesent ut diam nec sapien fermentum ullamcorper.");
                    done();
                }, 3);
            });
        });

        describe('should read line by line from the input file', function () {
            var reader;

            before(function () {
                reader = new LineReader(path.join(__dirname, 'input.txt'));
            });

            it('and return null after reading all lines', function (done) {
                var keepReading = true;
                var lines = [];

                async.whilst(
                    function () {
                        return keepReading;
                    },
                    function (cb) {
                        reader.nextLine(function (err, line) {
                            assert.ifError(err);
                            if (line === null) {
                                keepReading = false;
                            } else {
                                lines.push(line);
                            }
                            cb();
                        });
                    },
                    function (err) {
                        assert.ifError(err);
                        assert.equal(lines.length, 63);
                        assert.equal(lines[62], "Quisque finibus eros nec faucibus laoreet.");
                        done();
                    }
                );
            });
        });
    });


});
