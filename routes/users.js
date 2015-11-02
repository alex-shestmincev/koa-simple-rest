'use strict';

const User = require('../model/User');
const mongoose = require('mongoose');
const log = require('../libs/log');

function* createUser(next){
  log.debug('createUser start');
  const params = this.request.body;
  let userData = {
    displayName: params.displayName,
    email: params.email,
    age: params.age,
  };

  let check = yield User.findOne({email: userData.email});
  if (check){
    log.info('User already exists');
    this.status = 400;
    this.body = 'User already exists';
  } else {
    //try{
      let user = yield User.create(userData);
      log.info('User finded');
      this.body = user.toObject();
    //} catch (e){
    //  log.error(e);
    //  e.status = 400;
    //  this.throw(e);
    //}
  }
}

function* getUser(next){
  this.body = this.userById.toObject();
}

function* getList(next){
  log.debug('User getList start');
  let users = yield User.find().lean();
  log.info(`Finded ${users.length}' users`);
  this.body = users;
  log.debug('User getList end', {users: users});
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