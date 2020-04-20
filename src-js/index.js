const fs = require('fs');
const path = require('path');
const util = require('util');
const readFile = util.promisify(fs.readFile);

async function buildJS() {
    const paths = [
        'util.js',
        'main.js',
        'elements.js',
        'diagram-items.js',
    ].map(filename => path.join(__dirname, 'browser', filename));
    const buffers = await Promise.all(paths.map(path => readFile(path)));
    return [
        '(function () {',
        'function Connection(params) {',
        buffers.map(buf => buf.toString('utf8')).join('\n\n'),
        'return this;',
        '}',
        'window.SN = { Connection: Connection };',
        '})();',
    ].join('\n');
}

module.exports = {
    buildJS,
    JS_MIN: fs.readFileSync(path.join(__dirname, '..', 'SolidNotebook-0.1.0.min.js'))
};
