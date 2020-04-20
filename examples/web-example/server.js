const fs = require('fs');
const path = require('path');
const http = require('http');
const crypto = require('crypto');
const url = require('url');
const SolidNotebook = require('../../src-js');
const WebSocket = require('ws');

const STROKE_COLORS = [
    '#ff1492', // deeppink
    '#ffa500', // orange
    '#006400', // darkgreen
    '#8b0000', // darkred
    '#00ccff', // cyan
];

const activeConnectionsById = {};
let numConnections = 0;

const mostRecentMessageForItemId = {};

function main() {
    startWS();
    startHTTP();
}

function startWS() {
    const wss = new WebSocket.Server({ port: 8080 });

    wss.on('connection', function connection(ws) {
        const ourConnectionId = crypto.randomBytes(16).toString('hex');
        activeConnectionsById[ourConnectionId] = ws;
        numConnections++;
        const strokeColor = STROKE_COLORS[(numConnections - 1) % STROKE_COLORS.length];
        ws.send(JSON.stringify({ type: "sample-app-init", strokeColor, connectionId: ourConnectionId }));

        Array.from(Object.keys(mostRecentMessageForItemId)).forEach(id => {
            const json = mostRecentMessageForItemId[id];
            ws.send(json);
        });

        ws.on('message', function incoming(json) {
            const message = JSON.parse(json);

            if (message.type === 'update-item') {
                mostRecentMessageForItemId[message.props.item.id] = json;
            }

            if (shouldForwardEventToEverybody(message)) {
                Array.from(Object.keys(activeConnectionsById)).forEach(connectionId => {
                    if (connectionId !== ourConnectionId) {
                        const destConnection = activeConnectionsById[connectionId];
                        if (destConnection.readyState === WebSocket.OPEN) {
                            try {
                                destConnection.send(json);
                            } catch (e) {
                                console.log('WS ERROR:', e);
                            }
                        }
                    }
                })
            }
        });
    });
}

function shouldForwardEventToEverybody(event) {
    return event.type !== 'received-event';
}

function startHTTP() {
    const host = '0.0.0.0';
    const port = 3000;
    const server = http.createServer((req, res) => {
        const { pathname } = url.parse(req.url);
        const m = pathname.match(/^\/slides\/([0-9]+).jpg$/);
        if (m) {
            const delay = (m[1] === '2') ? 500 : 1;
            setTimeout(() => {
                res.writeHead(200, { 'Content-Type': 'image/jpeg' });
                res.end(fs.readFileSync(path.join(__dirname, 'slides', m[1] + '.jpg')));
            }, delay);
        } else if (pathname === '/') {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(fs.readFileSync(path.join(__dirname, 'client.html')));
        } else if (pathname === '/SolidNotebook.js') {
            SolidNotebook.buildJS()
                .then((js) => {
                    res.writeHead(200, { 'Content-Type': 'text/javascript' });
                    res.end(js);
                })
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404\n');
        }
    });
    server.listen(port, host, () => {
        console.log('http://localhost:3000');
    });
}

main();
