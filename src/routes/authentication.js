var helper = require('./helper'),
    setupPageRoute = helper.setupPageRoute,
    auth = require('../authentication');

module.exports = function(router, middleware, controllers) {
  router.post('/register', middleware.recaptcha.verify, auth.register);
  router.post('/login', auth.login);
};

