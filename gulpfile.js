'use strict';

const gulp = require('gulp');
const { build, clean, copyManifest, installDeps } = require('./tasks/build');
const { fixLibyaml } = require('./tasks/fixLibyaml');
const { release } = require('./tasks/release');
const { tmpTestFiles } = require('./tasks/tmpTestFiles');
const { watch } = require('./tasks/watch');

exports.build = build;
exports.clean = clean;
exports.copyManifest = copyManifest;
exports.fixLibyaml = fixLibyaml;
exports.installDeps = gulp.series(installDeps, fixLibyaml);
exports.release = release;
exports.tmpTestFiles = tmpTestFiles;
exports.watch = watch;
