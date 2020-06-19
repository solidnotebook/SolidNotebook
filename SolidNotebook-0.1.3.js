window.lazySizesConfig = window.lazySizesConfig || {};
window.lazySizesConfig.init = false;



/*! lazysizes - v5.2.2

https://github.com/aFarkas/lazysizes

The MIT License (MIT)

Copyright (c) 2015 Alexander Farkas

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/

!function(e){var t=function(u,D,f){"use strict";var k,H;if(function(){var e;var t={lazyClass:"lazyload",loadedClass:"lazyloaded",loadingClass:"lazyloading",preloadClass:"lazypreload",errorClass:"lazyerror",autosizesClass:"lazyautosizes",srcAttr:"data-src",srcsetAttr:"data-srcset",sizesAttr:"data-sizes",minSize:40,customMedia:{},init:true,expFactor:1.5,hFac:.8,loadMode:2,loadHidden:true,ricTimeout:0,throttleDelay:125};H=u.lazySizesConfig||u.lazysizesConfig||{};for(e in t){if(!(e in H)){H[e]=t[e]}}}(),!D||!D.getElementsByClassName){return{init:function(){},cfg:H,noSupport:true}}var O=D.documentElement,a=u.HTMLPictureElement,P="addEventListener",$="getAttribute",q=u[P].bind(u),I=u.setTimeout,U=u.requestAnimationFrame||I,l=u.requestIdleCallback,j=/^picture$/i,r=["load","error","lazyincluded","_lazyloaded"],i={},G=Array.prototype.forEach,J=function(e,t){if(!i[t]){i[t]=new RegExp("(\\s|^)"+t+"(\\s|$)")}return i[t].test(e[$]("class")||"")&&i[t]},K=function(e,t){if(!J(e,t)){e.setAttribute("class",(e[$]("class")||"").trim()+" "+t)}},Q=function(e,t){var i;if(i=J(e,t)){e.setAttribute("class",(e[$]("class")||"").replace(i," "))}},V=function(t,i,e){var a=e?P:"removeEventListener";if(e){V(t,i)}r.forEach(function(e){t[a](e,i)})},X=function(e,t,i,a,r){var n=D.createEvent("Event");if(!i){i={}}i.instance=k;n.initEvent(t,!a,!r);n.detail=i;e.dispatchEvent(n);return n},Y=function(e,t){var i;if(!a&&(i=u.picturefill||H.pf)){if(t&&t.src&&!e[$]("srcset")){e.setAttribute("srcset",t.src)}i({reevaluate:true,elements:[e]})}else if(t&&t.src){e.src=t.src}},Z=function(e,t){return(getComputedStyle(e,null)||{})[t]},s=function(e,t,i){i=i||e.offsetWidth;while(i<H.minSize&&t&&!e._lazysizesWidth){i=t.offsetWidth;t=t.parentNode}return i},ee=function(){var i,a;var t=[];var r=[];var n=t;var s=function(){var e=n;n=t.length?r:t;i=true;a=false;while(e.length){e.shift()()}i=false};var e=function(e,t){if(i&&!t){e.apply(this,arguments)}else{n.push(e);if(!a){a=true;(D.hidden?I:U)(s)}}};e._lsFlush=s;return e}(),te=function(i,e){return e?function(){ee(i)}:function(){var e=this;var t=arguments;ee(function(){i.apply(e,t)})}},ie=function(e){var i;var a=0;var r=H.throttleDelay;var n=H.ricTimeout;var t=function(){i=false;a=f.now();e()};var s=l&&n>49?function(){l(t,{timeout:n});if(n!==H.ricTimeout){n=H.ricTimeout}}:te(function(){I(t)},true);return function(e){var t;if(e=e===true){n=33}if(i){return}i=true;t=r-(f.now()-a);if(t<0){t=0}if(e||t<9){s()}else{I(s,t)}}},ae=function(e){var t,i;var a=99;var r=function(){t=null;e()};var n=function(){var e=f.now()-i;if(e<a){I(n,a-e)}else{(l||r)(r)}};return function(){i=f.now();if(!t){t=I(n,a)}}},e=function(){var v,m,c,h,e;var y,z,g,p,C,b,A;var n=/^img$/i;var d=/^iframe$/i;var E="onscroll"in u&&!/(gle|ing)bot/.test(navigator.userAgent);var _=0;var w=0;var N=0;var M=-1;var x=function(e){N--;if(!e||N<0||!e.target){N=0}};var W=function(e){if(A==null){A=Z(D.body,"visibility")=="hidden"}return A||!(Z(e.parentNode,"visibility")=="hidden"&&Z(e,"visibility")=="hidden")};var S=function(e,t){var i;var a=e;var r=W(e);g-=t;b+=t;p-=t;C+=t;while(r&&(a=a.offsetParent)&&a!=D.body&&a!=O){r=(Z(a,"opacity")||1)>0;if(r&&Z(a,"overflow")!="visible"){i=a.getBoundingClientRect();r=C>i.left&&p<i.right&&b>i.top-1&&g<i.bottom+1}}return r};var t=function(){var e,t,i,a,r,n,s,l,o,u,f,c;var d=k.elements;if((h=H.loadMode)&&N<8&&(e=d.length)){t=0;M++;for(;t<e;t++){if(!d[t]||d[t]._lazyRace){continue}if(!E||k.prematureUnveil&&k.prematureUnveil(d[t])){R(d[t]);continue}if(!(l=d[t][$]("data-expand"))||!(n=l*1)){n=w}if(!u){u=!H.expand||H.expand<1?O.clientHeight>500&&O.clientWidth>500?500:370:H.expand;k._defEx=u;f=u*H.expFactor;c=H.hFac;A=null;if(w<f&&N<1&&M>2&&h>2&&!D.hidden){w=f;M=0}else if(h>1&&M>1&&N<6){w=u}else{w=_}}if(o!==n){y=innerWidth+n*c;z=innerHeight+n;s=n*-1;o=n}i=d[t].getBoundingClientRect();if((b=i.bottom)>=s&&(g=i.top)<=z&&(C=i.right)>=s*c&&(p=i.left)<=y&&(b||C||p||g)&&(H.loadHidden||W(d[t]))&&(m&&N<3&&!l&&(h<3||M<4)||S(d[t],n))){R(d[t]);r=true;if(N>9){break}}else if(!r&&m&&!a&&N<4&&M<4&&h>2&&(v[0]||H.preloadAfterLoad)&&(v[0]||!l&&(b||C||p||g||d[t][$](H.sizesAttr)!="auto"))){a=v[0]||d[t]}}if(a&&!r){R(a)}}};var i=ie(t);var B=function(e){var t=e.target;if(t._lazyCache){delete t._lazyCache;return}x(e);K(t,H.loadedClass);Q(t,H.loadingClass);V(t,L);X(t,"lazyloaded")};var a=te(B);var L=function(e){a({target:e.target})};var T=function(t,i){try{t.contentWindow.location.replace(i)}catch(e){t.src=i}};var F=function(e){var t;var i=e[$](H.srcsetAttr);if(t=H.customMedia[e[$]("data-media")||e[$]("media")]){e.setAttribute("media",t)}if(i){e.setAttribute("srcset",i)}};var s=te(function(t,e,i,a,r){var n,s,l,o,u,f;if(!(u=X(t,"lazybeforeunveil",e)).defaultPrevented){if(a){if(i){K(t,H.autosizesClass)}else{t.setAttribute("sizes",a)}}s=t[$](H.srcsetAttr);n=t[$](H.srcAttr);if(r){l=t.parentNode;o=l&&j.test(l.nodeName||"")}f=e.firesLoad||"src"in t&&(s||n||o);u={target:t};K(t,H.loadingClass);if(f){clearTimeout(c);c=I(x,2500);V(t,L,true)}if(o){G.call(l.getElementsByTagName("source"),F)}if(s){t.setAttribute("srcset",s)}else if(n&&!o){if(d.test(t.nodeName)){T(t,n)}else{t.src=n}}if(r&&(s||o)){Y(t,{src:n})}}if(t._lazyRace){delete t._lazyRace}Q(t,H.lazyClass);ee(function(){var e=t.complete&&t.naturalWidth>1;if(!f||e){if(e){K(t,"ls-is-cached")}B(u);t._lazyCache=true;I(function(){if("_lazyCache"in t){delete t._lazyCache}},9)}if(t.loading=="lazy"){N--}},true)});var R=function(e){if(e._lazyRace){return}var t;var i=n.test(e.nodeName);var a=i&&(e[$](H.sizesAttr)||e[$]("sizes"));var r=a=="auto";if((r||!m)&&i&&(e[$]("src")||e.srcset)&&!e.complete&&!J(e,H.errorClass)&&J(e,H.lazyClass)){return}t=X(e,"lazyunveilread").detail;if(r){re.updateElem(e,true,e.offsetWidth)}e._lazyRace=true;N++;s(e,t,r,a,i)};var r=ae(function(){H.loadMode=3;i()});var l=function(){if(H.loadMode==3){H.loadMode=2}r()};var o=function(){if(m){return}if(f.now()-e<999){I(o,999);return}m=true;H.loadMode=3;i();q("scroll",l,true)};return{_:function(){e=f.now();k.elements=D.getElementsByClassName(H.lazyClass);v=D.getElementsByClassName(H.lazyClass+" "+H.preloadClass);q("scroll",i,true);q("resize",i,true);q("pageshow",function(e){if(e.persisted){var t=D.querySelectorAll("."+H.loadingClass);if(t.length&&t.forEach){U(function(){t.forEach(function(e){if(e.complete){R(e)}})})}}});if(u.MutationObserver){new MutationObserver(i).observe(O,{childList:true,subtree:true,attributes:true})}else{O[P]("DOMNodeInserted",i,true);O[P]("DOMAttrModified",i,true);setInterval(i,999)}q("hashchange",i,true);["focus","mouseover","click","load","transitionend","animationend"].forEach(function(e){D[P](e,i,true)});if(/d$|^c/.test(D.readyState)){o()}else{q("load",o);D[P]("DOMContentLoaded",i);I(o,2e4)}if(k.elements.length){t();ee._lsFlush()}else{i()}},checkElems:i,unveil:R,_aLSL:l}}(),re=function(){var i;var n=te(function(e,t,i,a){var r,n,s;e._lazysizesWidth=a;a+="px";e.setAttribute("sizes",a);if(j.test(t.nodeName||"")){r=t.getElementsByTagName("source");for(n=0,s=r.length;n<s;n++){r[n].setAttribute("sizes",a)}}if(!i.detail.dataAttr){Y(e,i.detail)}});var a=function(e,t,i){var a;var r=e.parentNode;if(r){i=s(e,r,i);a=X(e,"lazybeforesizes",{width:i,dataAttr:!!t});if(!a.defaultPrevented){i=a.detail.width;if(i&&i!==e._lazysizesWidth){n(e,r,a,i)}}}};var e=function(){var e;var t=i.length;if(t){e=0;for(;e<t;e++){a(i[e])}}};var t=ae(e);return{_:function(){i=D.getElementsByClassName(H.autosizesClass);q("resize",t)},checkElems:t,updateElem:a}}(),t=function(){if(!t.i&&D.getElementsByClassName){t.i=true;re._();e._()}};return I(function(){H.init&&t()}),k={cfg:H,autoSizer:re,loader:e,init:t,uP:Y,aC:K,rC:Q,hC:J,fire:X,gW:s,rAF:ee}}(e,e.document,Date);e.lazySizes=t,"object"==typeof module&&module.exports&&(module.exports=t)}("undefined"!=typeof window?window:{});



if (!('loading' in HTMLImageElement.prototype)) {
  lazySizes.init();
}

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
var Z_DIAGRAM_IMAGE_PLACEHOLDER = 3;
var Z_STROKE = 4;
var Z_DIAGRAM_TOP = 5;

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