'use strict';

const User = require('../model/User');
const mongoose = require('mongoose');

function* createUser(next){
  const params = this.request.body;
  let userData = {
    displayName: params.displayName,
    email: params.email,
    age: params.age,
  };

  let check = yield User.findOne({email: userData.email});
  if (check){
    this.status = 400;
    this.body = 'User already exists';
  } else {
    try{
      let user = yield User.create(userData);
      this.body = user.toObject();
    } catch (e){
      e.status = 400;
      this.throw(e);
    }

  }
}

function* getUser(next){
  this.body = this.userById.toObject();
}

function* getList(next){
  let users = yield User.find().lean();
  this.body = users;
}

function* deleteUser(next){
  yield this.userById.remove();
  this.body = {status: 'deleted'};
}

module.exports = function(router){

  router.param('userById', function*(id, next) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      this.throw(404);
    }

    this.userById = yield User.findById(id);

    if (!this.userById) {
      this.throw(404);
    }

    yield* next;
  })

  router.post('/', createUser);

  router.get('/', getList);

  router.get('/:userById', getUser);

  router.delete('/:userById', deleteUser);

  return router;
}