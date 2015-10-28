'use strict';
const config = require('config');
const mongoose = require('mongoose');

module.exports = mongoose.connect(`mongodb://${config.get('db.host')}/${config.get('db.name')}`);