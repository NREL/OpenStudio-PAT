/**
 *  This file contains the variables used in other gulp files
 *  which defines tasks
 *  By design, we only put there very generic config values
 *  which are used in several places to keep good readability
 *  of the tasks
 */

var $ = require('gulp-load-plugins')();

/**
 *  The main paths of your project handle these with care
 */
exports.paths = {
  src: 'app',
  dist: 'build',
  tmp: '.tmp',
  e2e: 'e2e'
};

/**
 *  Common implementation for an error handler of a Gulp plugin
 */
exports.errorHandler = function (title) {
  return function (err) {
    $.util.log($.util.colors.red('[' + title + ']'), err.toString());
    this.emit('end');
  };
};
