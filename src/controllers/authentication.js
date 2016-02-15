/*
 global module,
 require
 */

var async = require('async'),
    passport = require('passport'),
    validator = require('validator'),
    _ = require('underscore'),
    winston = require('winston'),
    db = require('../database');

var user = require('../user'),
    auth = require('../authentication');


var authentication = module.exports = {};


authentication.logout = function (req, res, next) {
  if (req.user && req.user.id !== 0 && req.sessionID) {
    var id = req.user.id;
    req.session.destroy();
    req.logout();
  }

  res.redirect('/');
};

authentication.login = auth.login;
authentication.register = auth.register;
