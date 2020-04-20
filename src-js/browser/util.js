var throwInvalidParamError = function () {
    throw new Error('invalid param');
};

var newId = function () {
    state__numIds++;
    return 'id_' + ourConnectionId + '_' + state__numIds;
};

var setRect = function (element, x, y, width, height) {
    element.style.left = Math.round(x) + 'px';
    element.style.top = Math.round(y) + 'px';
    element.style.width = Math.round(width) + 'px';
    element.style.height = Math.round(height) + 'px';
};

var boundingRect = function (points) {
    var xmin = 1e12;
    var xmax = -1e12;
    var ymin = 1e12;
    var ymax = -1e12;
    for (var i = 0; i < points.length; i++) {
        var point = points[i];
        var x = point.x;
        var y = point.y;
        if (x < xmin) { xmin = x; }
        if (y < ymin) { ymin = y; }
        if (x > xmax) { xmax = x; }
        if (y > ymax) { ymax = y; }
    }
    return {
        x: xmin,
        y: ymin,
        width: xmax - xmin,
        height: ymax - ymin,
    };
};

var assertPositiveInteger = function (value, valueName) {
    if (!(Number.isInteger(value) && value > 0)) {
        throwInvalidParamError();
    }
}
