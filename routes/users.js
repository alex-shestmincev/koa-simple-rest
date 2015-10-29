'use strict';

const User = require('../model/User');

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
      this.body = user;
    } catch (e){
      e.status = 400;
      this.throw(e);
    }

  }
}

function* getUser(next){
  let user = yield User.findOne(this.params.id);
  if (user){
    this.body = user;
  } else {
    this.status = 404;
  }
}

function* getList(next){
  let users = yield User.find();
  this.body = users;
}

function* deleteUser(next){
  let user = yield User.findOne(this.params.id);
  if (user){
    yield user.remove();
    this.body = {status: 'deleted'};
  } else {
    this.status = 404;
  }
}

module.exports = function(router){

  router.post('/', createUser);

  router.get('/', getList);

  router.get('/:id', getUser);

  router.delete('/:id', deleteUser);

  return router;
}