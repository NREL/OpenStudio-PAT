// Simple module exposes environment variables to rest of the code.

import * as jetpack from 'fs-jetpack';

let app;
if (process.type === 'renderer') {
    app = require('electron').remote.app;
} else {
    app = require('electron').app;
}
const appDir = jetpack.cwd(app.getAppPath());

const manifest = appDir.read('package.json', 'json');

export default manifest.env;
