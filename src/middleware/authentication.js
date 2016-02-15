var controllers = require('../controllers');

module.exports = function(middleware) {
  middleware.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }

    return controllers.helpers.notAllowed(req, res);
  };

  return middleware;
};

