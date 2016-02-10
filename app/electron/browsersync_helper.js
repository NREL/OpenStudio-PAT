const path = require('path');
const globalPaths = require('module').globalPaths;

globalPaths.push(path.resolve(process.cwd(), 'app/node_modules'));
