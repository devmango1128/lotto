var index2d = function () { };

index2d.get = function (s, m) {
    if (m == 16) {
        r = Math.floor(s / 4);
        c = s % 4;
    }
    else if (m == 12) {
        r = Math.floor(s / 2);
        c = s % 2;
    }
    return [r, c]
}

module.exports = index2d;