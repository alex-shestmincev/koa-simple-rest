'use strict';
const winston = require('winston');
const path = require('path');

function timestamp() {
  var d = new Date();
  return d.toLocaleTimeString() + ' ' + d.toLocaleDateString();
}

function formatter(options) {
  // Return string will be passed to logger.
  return timestamp() +' '+ options.level.toUpperCase() +' '+ (undefined !== options.message ? options.message : '') +
    (options.meta && Object.keys(options.meta).length ? '\n\t'+ JSON.stringify(options.meta) : '' );
}

let transports = [];
transports.push(
  new (winston.transports.File)({
    name: 'info-file',
    filename: path.join(__dirname, '../logs/info.log'),
    level: 'info',
    json: false,
    maxsize: 5242880, //5MB
    maxFiles: 5,
  })
);

transports.push(
  new (winston.transports.File)({
    name: 'error-file',
    filename: path.join(__dirname, '../logs/error.log'),
    level: 'error',
    handleExceptions: true,
    json: false,
    maxsize: 5242880, //5MB
    maxFiles: 5,

  })
);

if (process.env.NODE_ENV !== 'test'){
  transports.push(new (winston.transports.Console)({
    level: 'debug',
    handleExceptions: true,
    formatter: formatter,
    json: true
  }));
} else {
  transports.push(new (winston.transports.Console)({
    level: 'error',
    handleExceptions: true,
    formatter: formatter,
    json: true
  }));
}

if (process.env.NODE_ENV !== 'production'){
  transports.push(
    new (winston.transports.File)({
      name: 'debug-file',
      filename: path.join(__dirname, '../logs/debug.log'),
      level: 'debug',
      json: false,
      maxsize: 5242880, //5MB
      maxFiles: 5,
    })
  );
}

const log = new (winston.Logger)({
  transports: transports
});

module.exports = log;