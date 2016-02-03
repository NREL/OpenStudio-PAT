'use strict';

['build', 'inject', 'release', 'scripts', 'styles', 'watch'].forEach(name => {
  require('./tasks/' + name);
});
