var Router = require('koa-router');

const home = require('./home')(new Router());
const auth = require('./auth')(new Router({ prefix: '/auth' }));
const users = require('./users')(new Router({ prefix: '/users' }));


module.exports = function(app) {

  app.use(home.routes());
  app.use(auth.routes());
  app.use(users.routes());

};