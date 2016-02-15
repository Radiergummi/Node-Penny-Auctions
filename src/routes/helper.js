var helper = module.exports = {};

helper.setupPageRoute = function(router, name, middleware, middlewares, controller) {
  // TODO: Install too busy and header builder library
  router.get(name, /*middleware.busyCheck, middleware.buildHeader, */middlewares, controller);
  router.get('/api' + name, middlewares, controller);
};
