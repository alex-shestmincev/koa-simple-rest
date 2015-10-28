var Router = require('koa-router');

const users = require('./users')(new Router({ prefix: '/users' }));

module.exports = function(app) {
  app.use(users.routes());
};