// Simple module exposes environment variables to rest of the code.

import jetpack from 'fs-jetpack';

const env = jetpack.cwd(__dirname).read('env.json', 'json');

export default env;
