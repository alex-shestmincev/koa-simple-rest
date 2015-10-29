

module.exports = function*(next) {

  try {
    yield* next;
  } catch (e) {
    if (e.status) {
      // could use template methods to render error page
      this.status = e.status;
      if (this.request.is('application/json')){
        this.body = {error: e.message};
      } else {
        this.body = e.message;
      }
    } else {
      this.body = "Error 500";
      this.statusCode = 500;
      console.error(e.message, e.stack);
    }

  }
};
