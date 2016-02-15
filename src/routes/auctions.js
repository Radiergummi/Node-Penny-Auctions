/*
 global module,
 require
 */

var helper = require('./helper'),
    setupPageRoute = helper.setupPageRoute;

module.exports = function(router, middleware, controllers) {
  setupPageRoute(router, '/auctions', middleware, [], controllers.auctions);
};
