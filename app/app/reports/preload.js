// preload some external node modules for the project reporting measure
// note that the native
console.info('Loaded preload.js');

// note that adding var before these like normal
// doesn't work.
console.info('Preloading node libraries.');
var fs = require('fs');
var path = require('path');
_ = require('lodash');
var js2xmlparser = require('js2xmlparser');
var angular = require('angular');
var os = require('os');

var jetpack = require('fs-jetpack');

// TODO read the results from disk and pass
// to the project reporting measure
console.info('Preloading simulation results.');

// initialize results array
//results =  [];

// TODO decide where any exported files should be saved
console.info('Preloading report output directory.');
reportDir = os.homedir() + 'Openstudio/PAT/Project_Reporting_Measures';
