'use strict';

const jetpack = require('fs-jetpack');
const path = require('path');
const conf = require('./conf');

const OFFICE_HVAC_FOLDER = '/Office_HVAC';

const tmpTestFiles = async () => {
  const tmpDir = await jetpack.dirAsync(conf.paths.tmpTest, { empty: true });
  await tmpDir.dirAsync('empty', { empty: true });
  await jetpack.copyAsync(path.join('sample_projects', OFFICE_HVAC_FOLDER), path.join(conf.paths.tmpTest, OFFICE_HVAC_FOLDER));
};

exports.tmpTestFiles = tmpTestFiles;
