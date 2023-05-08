/**
 * Generate wonder sets
 */

var random = require('./random');

var _arrange = null;

var arrange = function () { };

arrange.reset = function () {

    var _master = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    var master = random.suffle(_master);

    /**
     * Matrix X = [Column, Row]
     */

    var A = [
        [master[0], master[1], master[2], master[3]],
        [master[0], master[1], master[2], master[3]]]
    var B = [
        [master[3], master[4], master[5], master[6]],
        [master[3], master[4], master[5], master[6]]]
    var C = [
        [master[6], master[7], master[8], master[9]],
        [master[6], master[7], master[8], master[9]]]

    // Wonder D-E-F
    var D = [
        [master[1], master[2]],
        [master[4], master[5], master[6], master[7], master[8], master[9]]]
    var E = [
        [master[4], master[5]],
        [master[7], master[8], master[9], master[0], master[1], master[2]]]
    var F = [
        [master[7], master[8]],
        [master[0], master[1], master[2], master[3], master[4], master[5]]]


    // Dimension
    dimension = [16, 16, 16, 12, 12, 12]

    _arrange = [A, B, C, D, E, F, dimension];
}

arrange.get = function () {
    if (_arrange == null) {
        arrange.reset();
    }
    return _arrange;
}

module.exports = arrange;