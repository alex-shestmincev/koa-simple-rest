'use strict';
Error.stackTraceLimit = 20;
require('trace');
require('clarify');
process.env.NODE_ENV = 'test';

var mocha = require('mocha')
var coMocha = require('co-mocha')

coMocha(mocha);
const should = require('should');
const request = require("co-request");
const User = require('../model/User');
const app = require('../app');
const config = require('config');

const url = `http://${config.host}:${config.port}`;

const validUser = {
  displayName: 'alex',
  email: 'john@gmail.com',
  age: 25,
};

describe('Users api', () => {

  describe('create User positive tests', function () {

    before(function* () {
      yield (callback) => app.listen(config.port, callback);
      yield User.remove({});
    });

    let user;

    it('should get empty users array without errors', function* () {
      let result = yield request.get(url + '/users');
      let users = JSON.parse(result.body);
      users.should.be.an.instanceOf(Array).and.have.lengthOf(0);
    });

    it('should create user without errors', function* () {
      let result = yield request.post(url + '/users/', {form: validUser});
      user = JSON.parse(result.body);
      user.displayName.should.equal(validUser.displayName);
      user.email.should.equal(validUser.email);
      user.age.should.equal(validUser.age);
    });

    it('should getone user without errors', function* () {
      let result = yield request.get(url + '/users/' + user._id);
      user = JSON.parse(result.body);
      user.displayName.should.equal(validUser.displayName);
      user.email.should.equal(validUser.email);
      user.age.should.equal(validUser.age);
    });

    it('should get users array without errors', function* () {
      let result = yield request.get(url + '/users');
      let users = JSON.parse(result.body);
      users.should.be.an.instanceOf(Array).and.have.lengthOf(1);
      users[0].displayName.should.equal(validUser.displayName);
      users[0].email.should.equal(validUser.email);
      users[0].age.should.equal(validUser.age);
    });

    it('should delete user without errors', function* () {
      let result = yield request.del(url + '/users/' + user._id);
      let body = JSON.parse(result.body);
      body.status.should.equal('deleted');
    });

    it('should get empty users array after delete without errors', function* () {
      let result = yield request.get(url + '/users');
      let users = JSON.parse(result.body);
      users.should.be.an.instanceOf(Array).and.have.lengthOf(0);
    });

    it('should not find user with 404', function* () {
      let result = yield request.get(url + '/users/' + user._id);
      result.statusCode.should.equal(404);
    });

    it('should not delete user after user is deleted', function* () {
      let result = yield request.del(url + '/users/' + user._id);
      result.statusCode.should.equal(404);
    });

  });

});