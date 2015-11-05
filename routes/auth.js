const passport = require('koa-passport');

function* logIn(next){
  var ctx = this;
  yield passport.authenticate('local', function*(err, user, info) {
    if (err) throw err
    if (user === false) {
      ctx.status = 401
      ctx.body = { success: false }
    } else {
      yield ctx.login(user)
      ctx.body = { success: true }
    }
  });
}

function* logOut(next) {
  this.logout();
  this.redirect('/');
};

module.exports = function(router){

  router.post('/login', logIn);
  router.post('/logout', logOut);


  return router;
}