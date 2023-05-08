var mapping = require('./mapping');
var index2d = require('./index2d');
var arrange = require('./arrange');
var count = require('./count');

var lib = function() { };

lib.get = function() {
    _arrange = arrange.get();
    _mapping = mapping.get();

    if (_mapping == 0) {
        return 0;
    } else {
        var lotto = [];
        for (var i = 0; i < _mapping.length; i++) {
            if (i < 3) {
                _index2d = index2d.get(_mapping[i], 16);
                row = _index2d[0];
                column = _index2d[1];
                lotto[i] = _arrange[i][0][column] * 10 + _arrange[i][1][row];
            }
            else if (i >= 3 && i < 6) {
                _index2d = index2d.get(_mapping[i], 12);
                row = _index2d[0];
                column = _index2d[1];
                lotto[i] = _arrange[i][0][column] * 10 + _arrange[i][1][row];
            }
        }

        return lotto.sort(function(a, b) { return a - b });
    }
}

lib.reset = function() {
    count.reset();
    arrange.reset();
}

lib.count = function() {
    return count.get();
}

module.exports = lib;