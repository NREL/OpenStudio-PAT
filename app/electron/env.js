// Simple module exposes environment variables to rest of the code.

import jetpack from 'fs-jetpack';

var env = jetpack.cwd(__dirname).read('package.json', 'json');

export default env;
