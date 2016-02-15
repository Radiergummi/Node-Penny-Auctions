var helper         = require('./helper'),
    setupPageRoute = helper.setupPageRoute;

module.exports = function(router, middleware, controllers) {
  var loginRegisterMiddleware = [];

  setupPageRoute(router, '/', middleware, loginRegisterMiddleware, controllers.home);

  setupPageRoute(router, '/login', middleware, loginRegisterMiddleware, controllers.login);
  setupPageRoute(router, '/register', middleware, [middleware.recaptcha.render], controllers.register);
  setupPageRoute(router, '/logout', middleware, [], controllers.authentication.logout);

  setupPageRoute(router, '/imprint', middleware, [], controllers.imprint);
  setupPageRoute(router, '/tos', middleware, [], controllers.termsofservice);
  setupPageRoute(router, '/faq', middleware, [], controllers.faq);
  setupPageRoute(router, '/about', middleware, [], controllers.about);
  setupPageRoute(router, '/chat', middleware, [], controllers.chat);

  router.get('/impressum', function(req, res, next) {
    res.redirect(301, '/imprint');
  });

  router.get('/agb', function(req, res, next) {
    res.redirect(301, '/tos');
  });
};
