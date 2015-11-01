'use strict';

const mongoose = require('./mongoose');
const uniqueValidator = require('mongoose-unique-validator');


const schema = new mongoose.Schema({

  displayName: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^([\w]{1,100})?$/;
      },
      message: '{VALUE} is not a valid displayName'
    }
  },

  age: {
    type: Number,
    required: true,
    min: 1,
    max: 100
  },

  email:   {
    type:     String,
    required: true,
    unique:   true,
    validate: {
      validator: function (v) {
        var emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        return emailRegex.test(v);
      },
      message: '{VALUE} is not a valid email!'
    }
  },

  created: {
    type:    Date,
    default: Date.now
  }
});

schema.plugin(uniqueValidator, {
    message: 'Ошибка: {PATH} уже существует.' }
);

module.exports = mongoose.model('User', schema);