function* homeRoute(next) { console.log('homeRoute')
  if (this.isAuthenticated()) {
    this.body = this.render('index');
  } else {
    this.body = this.render('login');
  }
};

module.exports = function(router){

  router.get('/', homeRoute);

  return router;
}