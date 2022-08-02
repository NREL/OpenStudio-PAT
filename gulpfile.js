'use strict';

const { build, clean, copyManifest, installDeps } = require('./tasks/build');
const { release } = require('./tasks/release');
const { watch } = require('./tasks/watch');

exports.build = build;
exports.clean = clean;
exports.copyManifest = copyManifest;
exports.installDeps = installDeps;
exports.release = release;
exports.watch = watch;
