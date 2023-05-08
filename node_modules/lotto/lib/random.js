var random = function () { };

/**
 * Function generate a pseudo-random number from 0 to n
 */
random.random = function (n) {
    return Math.floor((Math.random() * (n + 1)))
}

/**
 * Function generate a pseudo-random permutation
 */
random.suffle = function (array) {
    times = array.length;
    for (var i = 0; i <= times - 2; i++) {
        j = random.random(times - i - 1);
        // Swap elements of array
        temp = array[i];
        array[i] = array[i + j];
        array[i + j] = temp;
    }
    return array;
}

module.exports = random;
