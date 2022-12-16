'use strict';

const jetpack = require('fs-jetpack');
const path = require('path');
const conf = require('./conf');

const FOLDERS_TO_COPY = ['/Office_HVAC', '/Office_Study'];

const tmpTestFiles = async () => {
  const tmpDir = await jetpack.dirAsync(conf.paths.tmpTest, { empty: true });
  await tmpDir.dirAsync('empty', { empty: true });
  for (const folder of FOLDERS_TO_COPY) {
    await jetpack.copyAsync(path.join('sample_projects', folder), path.join(conf.paths.tmpTest, folder));
  }
};

exports.tmpTestFiles = tmpTestFiles;
