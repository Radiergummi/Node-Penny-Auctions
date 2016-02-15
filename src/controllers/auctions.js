/*
 global module,
 require
 */

'use strict';

var Auction = require('../auction');

var auctions = module.exports = {},
    userVariables = function (req) {
      var loggedIn = req.hasOwnProperty('user');

      if (loggedIn) {
        return {
          loggedIn:     true,
          username:     req.user.local.username,
          id:           req.user.getId(),
          credits:      req.user.data.paymentUnits,
          settings:     req.user.getSettings(),
          isAdmin:      req.user.data.admin,
          profileImage: req.user.getProfileImage()
        };
      }

      return {
        loggedIn:     false,
        username:     'guest',
        id:           '0',
        credits:      null,
        settings:     null,
        isAdmin:      false,
        profileImage: '/images/user/default.jpg'
      };
    };

auctions.auctions = function (req, res) {
  Auction.getAll(function (error, data) {
    if (error) {
      res.next(error);
    }

    var vars = {};
    vars.user = userVariables(req);

    vars.items = data.map(function(current) {
      var item = JSON.parse(JSON.stringify(current));

      item.price = item.price.toString().slice(0, -2) + ',' + item.price.toString().slice(-2) + '€';
      return item;
    });

    // TODO: Ugly helper to stringify the object properties prior to view rendering
    // vars.items = JSON.parse(JSON.stringify(vars.items));

    res.render('auctions', vars);
  });
};
