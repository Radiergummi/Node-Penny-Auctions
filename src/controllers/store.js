/*
 global module,
 require
 */

'use strict';

var ItemModel = require('../models/item');

var store = module.exports = {};

var userVariables = function (req) {
      return {
        loggedIn:     true,
        username:     req.user.local.username,
        id:           req.user.getId(),
        credits:      req.user.data.paymentUnits,
        settings:     req.user.getSettings(),
        isAdmin:      req.user.data.admin,
        profileImage: req.user.getProfileImage()
      }
    },
    getStoreItems = function () {
    };


store.store = function (req, res, next) {
  ItemModel.find({}, function(error, items) {
    if (error) {
      throw error;
    }

    var itemMap = [];

    for (var i in items) {
      var item = items[ i ];

      itemMap.push({
        id: item.getId(),
        name: item.name,
        manufacturer: item.manufacturer,
        description: item.description,
        price: item.price,
        timeToStart: item.startDate.toString(),
        votes: item.getVotes(),
        images: item.images
      });
    }

    var vars = {};
    vars.user = userVariables(req);
    vars.items = itemMap;

    res.render('store', vars);
  });
};
