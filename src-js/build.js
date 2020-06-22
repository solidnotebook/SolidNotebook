const fs = require('fs');
const path = require('path');
const UglifyJS = require("uglify-js");
const SN = require('./index');

async function main() {
    const js = await SN.buildJS();

    const result = UglifyJS.minify(js);
    if (result.error) {
        throw result.error;
    }
    const minJs = result.code;

    fs.writeFileSync(path.join(__dirname, '..', 'SolidNotebook-0.1.4.js'), js);
    fs.writeFileSync(path.join(__dirname, '..', 'SolidNotebook-0.1.4.min.js'), minJs);
}

if (!module.parent) {
    main()
}
