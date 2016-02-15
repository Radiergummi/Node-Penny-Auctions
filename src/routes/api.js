var express = require('express'),
    nconf = require('nconf');

module.exports = function(app, middleware, controllers) {
  var router = express.Router();
  app.use('/' + nconf.get('api:slug'), router);

  /**
   * Auction actions
   */
  router.get('/auctions', controllers.api.auctions.getAuctions);
  router.get('/auction/:auctionid', controllers.api.auctions.getAuctionById);
  router.get('/auction/:auctionid/bid/:bidid', controllers.api.auctions.getBid);
  router.post('/auction/:auctionid/bid/:bidid', controllers.api.auctions.placeBid);

  /**
   * Store actions
   */
  router.get('/store/items', controllers.api.store.getItems);
  router.get('/store/:itemid', controllers.api.store.getItemById);
  router.post('/store/:itemid/vote', controllers.api.store.voteItem);
  router.get('/store/categories', controllers.api.store.getCategories);
  router.get('/store/category/:categoryid', controllers.api.store.getCategoryById);
  router.get('/store/category/:categoryslug', controllers.api.store.getCategoryBySlug);
  router.get('/store/search/:query', controllers.api.store.searchItem);

  /**
   * User actions
   */
  router.get('/users', controllers.api.users.getUsers);
  router.get('/user/:userslug', controllers.api.users.getUserProfile);
  router.get('/user/:userslug/edit', controllers.api.users.editUserProfile);
  router.get('/user/:userslug/settings', controllers.api.users.editUserSettings);
};
