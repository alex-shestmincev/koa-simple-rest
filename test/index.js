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
  email: 'alex@gmail.com',
  age: 25,
};

const existingUserData = {
  displayName: 'john',
  email: 'john@gmail.com',
  age: 24,
};
let existingUser;

const invalidUser = {
  displayName: 'alex',
};

describe('Users api', () => {
  before(function* (){
    yield (callback) => app.listen(config.port, callback);
    yield User.remove({});
  })

  beforeEach(function* () {
    yield User.remove({});
    existingUser = yield User.create(existingUserData);
  });

  describe("GET /users", function() {

    it('should get users array without errors', function* () {
      let result = yield request.get(url + '/users');
      let users = JSON.parse(result.body);
      users.should.be.an.instanceOf(Array).and.have.lengthOf(1);
      users[0].displayName.should.equal(existingUserData.displayName);
      users[0].email.should.equal(existingUserData.email);
      users[0].age.should.equal(existingUserData.age);
    });
  });

  describe("POST /users/", function() {
    let user;

    it('should create user without errors', function* () {
      let result = yield request.post(url + '/users/', {form: validUser});
      user = JSON.parse(result.body);
      user.displayName.should.equal(validUser.displayName);
      user.email.should.equal(validUser.email);
      user.age.should.equal(validUser.age);
    });

    it('should not create user, return errors', function* () {
      let result = yield request.post(url + '/users/', {form: invalidUser});
      result.should.be.html;
      result.statusCode.should.equal(400);
      result.body.should.equal('Bad request');
    });

    it('should not create user, return errors in json format', function* () {
      let result = yield request.post(url + '/users/', {json: invalidUser});
      result.should.be.json;
      result.statusCode.should.equal(400);
      //result.body.errors.AssertionError.should.equal('User validation failed');
    });


  });

  describe("GET /users/:userById", function() {
    it('should getone user without errors', function* () {
      let result = yield request.get(url + '/users/' + existingUser._id);
      let user = JSON.parse(result.body);
      user.displayName.should.equal(existingUser.displayName);
      user.email.should.equal(existingUser.email);
      user.age.should.equal(existingUser.age);
    });

    it('should not find user with 404', function* () {
      let result = yield request.get(url + '/users/' + 123);
      result.statusCode.should.equal(404);
    });
  });

  describe("DELETE /users/:userById", function() {
    it('should delete user without errors', function* () {
      let result = yield request.del(url + '/users/' + existingUser._id);
      let body = JSON.parse(result.body);
      body.status.should.equal('deleted');
    });

    it('should not delete user after user is deleted - 404', function* () {
      let result = yield request.del(url + '/users/' + 123);
      result.statusCode.should.equal(404);
    });
  });

});