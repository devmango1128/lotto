/**
 * Wonder Count is the controller of unique algorithm
 */

var config = require('./../config');
var random = require('./../lib/random');

var super_prime = config.super_prime;
var partials = 5;
var period = Math.floor(super_prime / partials);

var _count = [
    [0, period],
    [period + 1, 2 * period],
    [2 * period + 1, 3 * period],
    [3 * period + 1, 4 * period],
    [4 * period + 1, super_prime]]

var count = function() { };

count.increase = function(seq) {
    _count[seq][1]++;
}

count.decrease = function(seq) {
    _count[seq][1]--;
}

count.reset = function() {
    _count = [
        [0, period],
        [period + 1, 2 * period],
        [2 * period + 1, 3 * period],
        [3 * period + 1, 4 * period],
        [4 * period + 1, super_prime]]
}

count.get = function() {
    seq = random.random(4);
    return {
        'count': _count[seq][1],
        'limit': _count[seq][0],
        'class': seq
    }
}


module.exports = count;