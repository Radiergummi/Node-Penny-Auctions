/*
 global module,
 require
 */

var nconf = require('nconf'),
    path = require('path'),
    express = require('express'),
    winston = require('winston'),
    helper = require('../libs/helper'),
    controllers = require('../controllers'),
    mainRoutes = require('./main'),
    apiRoutes = require('./api'),
    auctionRoutes = require('./auctions'),
    storeRoutes = require('./store'),
    userRoutes = require('./user'),
    adminRoutes = require('./admin'),
    authenticationRoutes = require('./authentication');

var setupPageRoute = helper.setupPageRoute;

module.exports = function(app, middleware) {
  var router = express.Router();

  app.all('(/api|/api/*?)', middleware.prepareAPI);
  app.all('(/api/admin|/api/admin/*?)', middleware.isAdmin);

  mainRoutes(router, middleware, controllers);
  authenticationRoutes(router, middleware, controllers);
  apiRoutes(router, middleware, controllers);
  auctionRoutes(router, middleware, controllers.auctions);
  storeRoutes(router, middleware, controllers.store);
  userRoutes(router, middleware, controllers.user);
  adminRoutes(router, middleware, controllers.admin);

  app.use('/', router);


  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    var err = new Error('Page Not Found: ' + req.url);

    err.status = 404;
    err.stack = err.stack.replace(new RegExp('(' + helper.escapeRegExp(nconf.get('path')) + ')+', 'g'), '').trim();
    next(err);
  });

  // register error handler
  app.use(require('../libs/errorHandler'));

};
