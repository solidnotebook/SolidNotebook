var createItem = function (type, id, diagram, diagramIndex, color, opacity, width, height, x, y) {
    var tConnectionUnix = Date.now();
    var item = {
        id: id,
        type: type,
        canvasId: '' + diagramIndex,
        canvasWidth: diagram.width,
        canvasHeight: diagram.height,
        color: color,
        opacity: opacity,
        viewWidth: width,
        viewHeight: height,
        tConnectionUnix: tConnectionUnix,
        isDone: false,
        isUndone: false,
        points: []
    };
    addPointToItem(item, x, y);
    return item;
}

var addPointToItem = function (item, x, y) {
    var tConnectionMono = Math.round(performance.now());
    var point = {
        x: x,
        y: y,
        t: tConnectionMono
    };
    if (item.type === 'rectangle') {
        item.points = item.points.slice(0, 1).concat([point]);
    } else {
        item.points.push(point);
    }
};

var completeItem = function (item) {
    item.isDone = true;
};

var STROKE_MARGIN = 4;

var renderStrokeSVG = function (item, boundingRect) {
    return [
        '<svg style="position: absolute; top: 0; left: 0" viewBox="0 0 ', boundingRect.width + (2 * STROKE_MARGIN), ' ', boundingRect.height + (2 * STROKE_MARGIN),
        '" xmlns="http://www.w3.org/2000/svg/">',
        '<polyline fill="none" stroke-linecap="round" stroke-linejoin="round"',
        ' stroke="', item.color, '"',
        ' stroke-width="', strokeWidth, '"',
        ' points="',
        (item.points
            .map(function (point) { return (point.x - boundingRect.x + STROKE_MARGIN) + ',' + (point.y - boundingRect.y + STROKE_MARGIN); })
            .join(' ')),
        '" /></svg>',
    ].join('');
}
