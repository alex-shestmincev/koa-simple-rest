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

  passwordHash:  {
    type: String,
    required: true
  },
  salt:          {
    required: true,
    type: String
  },

  created: {
    type:    Date,
    default: Date.now
  }
});

schema.plugin(uniqueValidator, {
    message: 'Ошибка: {PATH} уже существует.' }
);

schema.virtual('password')
  .set(function(password) {

    if (password !== undefined) {
      if (password.length < 4) {
        this.invalidate('password', 'Пароль должен быть минимум 4 символа.');
      }
    }

    this._plainPassword = password;

    if (password) {
      this.salt = crypto.randomBytes(config.crypto.hash.length).toString('base64');
      this.passwordHash = crypto.pbkdf2Sync(password, this.salt, config.crypto.hash.iterations, config.crypto.hash.length);
    } else {
      // remove password (unable to login w/ password any more, but can use providers)
      this.salt = undefined;
      this.passwordHash = undefined;
    }
  })
  .get(function() {
    return this._plainPassword;
  });

schema.methods.checkPassword = function(password) {
  if (!password) return false; // empty password means no login by password
  if (!this.passwordHash) return false; // this user does not have password (the line below would hang!)

  return crypto.pbkdf2Sync(password, this.salt, config.crypto.hash.iterations, config.crypto.hash.length) == this.passwordHash;
};

module.exports = mongoose.model('User', schema);