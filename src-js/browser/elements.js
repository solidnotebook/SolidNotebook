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
    };

    var url = diagram.backgroundImage;
    if ('loading' in HTMLImageElement.prototype) {
      imgElement.loading = 'lazy';
      imgElement.src = url;
    } else {
      imgElement.setAttribute('data-src', url);
      imgElement.className = 'lazyload';
    }

    var loadingElement = document.createElement('div');
    loadingElement.innerHTML = diagramLoadingStateHTML;

    var styleImageElement = function (element, zIndex) {
        element.style.userSelect = 'none';
        element.style.zIndex = zIndex;
        element.style.position = 'absolute';
        setRect(element, left, top, width, height);
    };

    styleImageElement(loadingElement, Z_DIAGRAM_IMAGE_PLACEHOLDER);
    styleImageElement(imgElement, Z_DIAGRAM_IMAGE);

    diagramViewImages.push(imgElement);

    var topElement = createTopElementForDiagram(diagram, diagramIndex, left, top, width, height);

    content.appendChild(imgElement);
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
