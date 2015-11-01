const winston = require('winston');

const log = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({ filename: 'somefile.log' })
  ]
});

module.exports = log;