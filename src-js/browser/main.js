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
