'use strict';

['build', 'release', 'inject', 'scripts', 'styles'].forEach(function (name) {
  require('./tasks/' + name);
});
