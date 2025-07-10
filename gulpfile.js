'use strict';

const { build, clean, copyManifest, installDeps, downloadDeps, verifyDeps, extractDeps, cleanDeps } = require('./tasks/build');
const { release } = require('./tasks/release');
const { tmpTestFiles } = require('./tasks/tmpTestFiles');
const { watch } = require('./tasks/watch');

exports.build = build;
exports.clean = clean;
exports.copyManifest = copyManifest;
exports.installDeps = installDeps;
exports.downloadDeps = downloadDeps;
exports.verifyDeps = verifyDeps;
exports.extractDeps = extractDeps;
exports.cleanDeps = cleanDeps;
exports.release = release;
exports.tmpTestFiles = tmpTestFiles;
exports.watch = watch;
