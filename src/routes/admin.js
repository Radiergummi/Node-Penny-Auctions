/*
 global module,
 require
*/

'use strict';

var helper = require('./helper'),
    express = require('express'),
    setupPageRoute = helper.setupPageRoute;

module.exports = function(app, middleware, controllers) {
  var router = express.Router();
  app.use('/admin', router);

  var loggedInAdmin = [
    middleware.isLoggedIn,
    middleware.isAdmin
  ];

  router.get('/', function(req, res, next) {
    res.redirect('/admin/dashboard');
  });

  setupPageRoute(router, '/dashboard', middleware, loggedInAdmin, controllers.dashboard);
  setupPageRoute(router, '/settings', middleware, loggedInAdmin, controllers.settings);
  setupPageRoute(router, '/users', middleware, loggedInAdmin, controllers.users);
  setupPageRoute(router, '/items', middleware, loggedInAdmin, controllers.items);
  setupPageRoute(router, '/auctions', middleware, loggedInAdmin, controllers.auctions);
};
