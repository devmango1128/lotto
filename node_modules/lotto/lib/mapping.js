/**
 * Generate an unique index by wonder count
 */

var count = require('./count');
var arrange = require('./arrange');
var config = require('./../config');

var mapping = function () { };

mapping.get = function () {

    var _count = count.get();
    count.decrease(_count.class);
    
    var _arrange = arrange.get();
    var _dimension = _arrange[_arrange.length - 1];

    if (_count.count <= _count.limit) {
        re = 0;
    }
    else {
        re = mapping.indexing(_count.count, config.super_prime, _dimension);
    }

    return re;
}

mapping.indexing = function (c, p, a) {
    var unique = mapping.quadraticresidues(c, p);

    var re = [];
    for (var i = a.length - 1; i >= 0; i--) {
        re[i] = unique % a[i];
        unique = Math.floor(unique / a[i]);
    }

    return re;
}

mapping.quadraticresidues = function (c, p) {
    if (c * 2 < p) {
        return Math.pow(c, 2) % p;
    }
    else {
        return p - Math.pow(c, 2) % p;
    }
}

module.exports = mapping;