
// Parse application/json, application/x-www-form-urlencoded
// NOT form/multipart!
// this.request.body
var bodyParser = require('koa-bodyparser');
module.exports = bodyParser();

