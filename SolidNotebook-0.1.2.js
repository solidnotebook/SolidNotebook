(function () {
function Connection(params) {
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


/*
Packed as minification-friendly ES5:

    (function () {
        function Connection(params) {
            ...util...          newId, setRect, boundingRect, assertPositiveInteger
            ...main...
            ...elements...
            ...diagram-items... createItem, addPointToItem, completeItem, renderStrokeSVG
            return this;
        }
        window.SN = { Connection: Connection };
    '})();',
*/

var Z_DIAGRAM_IMAGE = 2;
var Z_STROKE = 3;
var Z_DIAGRAM_TOP = 4;

var state__numIds = 0;
var state__numEventsSent = 0;
var state__itemsById = {};
var state__diagramItemElementsById = {};
var state__itemsWeCreated = [];
var state__color = '#000000';
var state__opacity = '1.0';
var state__allowScroll = 1; // fewer bytes than "true"
var state__broadcastScroll = 1;
var state__mode = 'pencil';
var state__touchIdentifier;

// Extract and validate params:
var containerId = params.containerId;
var containerSize = params.containerSize;
var strokeWidth = params.strokeWidth;
var backgroundColor = params.backgroundColor;
var horizontalPadding = params.horizontalPadding;
var verticalPadding = params.verticalPadding;
var ourConnectionId = params.connectionId;
var diagrams = params.diagrams;
var onOutboundMessage = params.onOutboundMessage;
var diagramLoadingStateHTML = params.diagramLoadingStateHTML;
var containerSize_width = containerSize.width;
var containerSize_height = containerSize.height;
var diagrams_length = diagrams.length;
// diagrams[].{width,height} are validated in elements.js
assertPositiveInteger(containerSize_width);
assertPositiveInteger(containerSize_height);
assertPositiveInteger(horizontalPadding);
assertPositiveInteger(verticalPadding);
assertPositiveInteger(diagrams_length);

var sendEvent = function (eventType, props) {
    var event = {};
    event.type = eventType;
    event.tConnectionMono = Math.round(window.performance.now());
    event.tConnectionUnix = Math.round(Date.now());
    event.props = props;
    event.connectionId = ourConnectionId;
    event.iConnection = state__numEventsSent;
    state__numEventsSent++;
    onOutboundMessage(event);
};

this.handleInboundMessage = function (event) {
    if (event.type !== 'received-event') {
        sendEvent('received-event', {
            connectionId: event.connectionId,
            iConnection: event.iConnection
        });
    }

    if (event.type === 'update-item') {
        drawItem(event.props.item);
    } else if (event.type === 'scroll') {
        ourContainer.scrollTop = event.props.scrollTop;
        state__scrollTop = event.props.scrollTop;
    }
};

this.setColor = function (color) {
    color = color.toUpperCase();
    if (!color.match(/^#[0-9A-F]{6}$/)) {
        throwInvalidParamError();
    }
    state__color = color;
};

this.setOpacity = function (opacity) {
    state__opacity = opacity;
};

this.setAllowScroll = function (shouldAllowScroll) {
    state__allowScroll = shouldAllowScroll;
    ourContainer.style.overflowY = state__allowScroll ? 'scroll' : 'hidden';
};

this.setBroadcastScroll = function (shouldBroadcastScroll) {
    state__broadcastScroll = shouldBroadcastScroll;
};

this.setMode = function (mode) {
    if (mode && !mode.match(/^(pencil|rectangle)$/)) {
        throwInvalidParamError();
    }
    state__mode = mode;
};

this.getItems = function () {
    var items = [];
    for (var k in state__itemsById) {
        if (state__itemsById.hasOwnProperty(k)) {
            items.push(state__itemsById[k]);
        }
    }
    return items;
};

this.undo = function () {
    var numItemsBeforeUndo = state__itemsWeCreated.length;
    if (numItemsBeforeUndo > 0) {
        var itemId = state__itemsWeCreated[numItemsBeforeUndo - 1];
        state__itemsWeCreated = state__itemsWeCreated.slice(0, numItemsBeforeUndo - 1);

        var item = state__itemsById[itemId];
        item.isUndone = true;
        sendEvent('update-item', { item: item });
        drawItem(item);
    }
};


var createTopElementForDiagram = function (diagram, diagramIndex, left, top, width, height) {
    var diagramElement = document.createElement('div');
    diagramElement.style.zIndex = Z_DIAGRAM_TOP;
    diagramElement.style.position = 'absolute';
    setRect(diagramElement, left, top, width, height);
    var currentItem = null;

    var touchPos = function (touch) {
        var rect = diagramElement.getBoundingClientRect();
        return { offsetX: touch.clientX - rect.left, offsetY: touch.clientY - rect.top };
    };

    diagramElement.addEventListener('touchstart', function (event) {
        var touch = event.changedTouches[0];
        if (!state__mode || !touch) { return; }
        event.preventDefault();
        state__touchIdentifier = touch.identifier;
        mousedown(touchPos(touch));
    }, false);

    var touchStopped = function (event) {
        for (var i = 0; i < event.changedTouches.length; i++) {
            if (event.changedTouches[i].identifier === state__touchIdentifier) {
                onMouseUpOrMouseLeave(touchPos(event.changedTouches[i]));
            }
        }
    };

    diagramElement.addEventListener('touchend', touchStopped, false);
    diagramElement.addEventListener('touchcancel', touchStopped, false);
    diagramElement.addEventListener('touchmove', function (event) {
        for (var i = 0; i < event.changedTouches.length; i++) {
            if (event.changedTouches[i].identifier === state__touchIdentifier) {
                mousemove(touchPos(event.changedTouches[i]));
            }
        }
    }, false);

    var mousedown = function (event) {
        var itemType = {
            pencil: 'stroke',
            rectangle: 'rectangle',
        }[state__mode];
        if (itemType) {
            currentItem = createItem(itemType, newId(), diagram, diagramIndex, state__color, state__opacity, width, height, event.offsetX, event.offsetY);
        }
    };

    var mousemove = function (event) {
        if (!currentItem) {
            return;
        }
        var x = event.offsetX;
        var y = event.offsetY;
        var lastPoint = currentItem.points[currentItem.points.length - 1];
        var distance = Math.sqrt(Math.pow(lastPoint.x - x, 2) + Math.pow(lastPoint.y - y, 2));
        if (distance >= 2) {
            addPointToItem(currentItem, event.offsetX, event.offsetY);
            sendEvent('update-item', { item: currentItem });
            drawItem(currentItem);
        }
    };

    diagramElement.addEventListener('mousedown', mousedown);
    diagramElement.addEventListener('mousemove', mousemove);

    function onMouseUpOrMouseLeave(event) {
        if (!currentItem) {
            return;
        }
        addPointToItem(currentItem, event.offsetX, event.offsetY);
        completeItem(currentItem);
        sendEvent('update-item', { item: currentItem });
        drawItem(currentItem);
        currentItem = null;
    }

    diagramElement.addEventListener('mouseleave', onMouseUpOrMouseLeave);
    diagramElement.addEventListener('mouseup', onMouseUpOrMouseLeave);

    return diagramElement;
};

var externalContainer = document.getElementById(containerId);

var ourContainer = document.createElement('div');
ourContainer.style.width = containerSize.width + 'px';
ourContainer.style.height = containerSize.height + 'px';
ourContainer.style.overflowY = 'scroll';

var content = document.createElement('div');

var maxDiagramViewWidth = containerSize.width - (2 * horizontalPadding);

var state__scrollTop = null;

var diagramViewWidths = [];
var diagramViewHeights = [];
var diagramViewTops = [];
var diagramViewImages = [];

var totalContentHeight = verticalPadding;
diagrams.forEach(function (diagram, diagramIndex) {
    assertPositiveInteger(diagram.width);
    assertPositiveInteger(diagram.height);

    var width = maxDiagramViewWidth;
    var height = Math.round(diagram.height * (width / diagram.width));
    diagramViewWidths.push(width);
    diagramViewHeights.push(height);

    diagramViewTops.push(totalContentHeight);
    var top = totalContentHeight;
    var left = horizontalPadding;
    totalContentHeight += height + verticalPadding;

    var imgElement = new Image();
    imgElement.onload = function () {
        // TODO event
        content.removeChild(loadingElement);
        content.appendChild(imgElement);
    };
    imgElement.src = diagram.backgroundImage;

    var loadingElement = document.createElement('div');
    loadingElement.innerHTML = diagramLoadingStateHTML;

    var styleImageElement = function (element) {
        element.style.userSelect = 'none';
        element.style.zIndex = Z_DIAGRAM_IMAGE;
        element.style.position = 'absolute';
        setRect(element, left, top, width, height);
    };

    styleImageElement(imgElement);
    styleImageElement(loadingElement);

    diagramViewImages.push(imgElement);

    var topElement = createTopElementForDiagram(diagram, diagramIndex, left, top, width, height);

    content.appendChild(loadingElement);
    content.appendChild(topElement);
});

content.style.width = containerSize.width;
content.style.height = totalContentHeight;
content.style.backgroundColor = backgroundColor;
content.style.position = 'relative';
ourContainer.style.backgroundColor = backgroundColor;
ourContainer.appendChild(content);
externalContainer.appendChild(ourContainer);

var drawItem = function (item) {
    var existingElement = state__diagramItemElementsById[item.id];
    if (existingElement) {
        content.removeChild(existingElement);
    } else {
        state__itemsWeCreated.push(item.id);
    }
    delete state__diagramItemElementsById[item.id];

    state__itemsById[item.id] = item;

    if (item.isUndone) {
        return;
    }

    var rect = boundingRect(item.points);
    var diagramIndex = parseInt(item.canvasId, 10);

    var diagramViewWidth = diagramViewWidths[diagramIndex];
    var scale = diagramViewWidth / item.viewWidth;

    var diagramX = horizontalPadding;
    var diagramY = diagramViewTops[diagramIndex];

    var itemElement = document.createElement('div');
    itemElement.style.position = 'absolute';
    itemElement.style.zIndex = Z_STROKE;
    itemElement.style.opacity = item.opacity;
    setRect(
        itemElement,
        (diagramX + (scale * rect.x) - scale*STROKE_MARGIN),
        (diagramY + (scale * rect.y) - scale*STROKE_MARGIN),
        (scale * rect.width) + (2 * scale*STROKE_MARGIN),
        (scale * rect.height) + (2 * scale*STROKE_MARGIN)
    );

    if (item.type === 'rectangle') {
        itemElement.style.backgroundColor = item.color;
    } else if (item.type === 'stroke') {
        var svg = renderStrokeSVG(item, rect);
        itemElement.innerHTML = svg;
    }

    content.appendChild(itemElement);
    state__diagramItemElementsById[item.id] = itemElement;
};

ourContainer.addEventListener('scroll', function () {
    var scrollTop = ourContainer.scrollTop;
    if (scrollTop !== state__scrollTop) {
        if (state__broadcastScroll) {
            sendEvent('scroll', { scrollTop: scrollTop });
        }
    }
});


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

return this;
}
window.SN = { Connection: Connection };
})();