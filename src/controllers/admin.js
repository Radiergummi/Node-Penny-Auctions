/*
 global module,
 require
 */

'use strict';

var helpers = require('./helpers');

var admin = module.exports = {},
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
    };


admin.dashboard = function (req, res, next) {
  var vars = {
    user:            userVariables(req),
    siteTitle:       'Dashboard',
    dashboardActive: 'active'
  };

  res.render('admin/dashboard', vars);
};


admin.settings = function (req, res, next) {
  var vars = {
    user:           userVariables(req),
    siteTitle:      'Einstellungen',
    settingsActive: 'active'

  };

  res.render('admin/settings', vars);
};


admin.users = function (req, res, next) {
  require('../user').getAll(function (error, data) {
    if (error) {
      return res.status(500).render('errors/admin');
    }

    var vars = {
      user:        userVariables(req),
      siteTitle:   'Benutzer',
      usersActive: 'active'
    };

    vars.users = JSON.parse(JSON.stringify(data));

    res.render('admin/users', vars);
  });
};


admin.items = function (req, res, next) {
  var vars = {
    user:        userVariables(req),
    siteTitle:   'Artikel',
    itemsActive: 'active'

  };

  res.render('admin/items', vars);
};


admin.auctions = function (req, res, next) {
  var vars = {
    user:           userVariables(req),
    siteTitle:      'Auktionen',
    auctionsActive: 'active'

  };

  res.render('admin/auctions', vars);
};
