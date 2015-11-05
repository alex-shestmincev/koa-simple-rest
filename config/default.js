var defer = require('config/defer').deferConfig;
var path = require('path');

module.exports = {
  secret:   'mysecret',
  template: {
    // template.root uses config.root
    root: defer(function(cfg) {
      return path.join(cfg.root, 'templates');
    })
  },
  root:     process.cwd()
}