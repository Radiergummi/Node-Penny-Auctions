/*
 global module,
 require
 */

var controllers = require('./main');
controllers.helpers = require('./helpers');
controllers.auctions = require('./auctions');
controllers.store = require('./store');
controllers.authentication = require('./authentication');
controllers.user = require('./user');
controllers.api = require('./api');
controllers.admin = require('./admin');

module.exports = controllers;
