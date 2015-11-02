'use strict';

const config = require('config');
const app = require('./../app');

app.listen(config.port, function(){
  console.log('Listening port ' + config.port)
});
