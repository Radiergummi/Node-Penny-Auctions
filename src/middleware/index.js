/*
 global module,
 require
 */

var fs      = require('fs'),
    path    = require('path'),
    nconf   = require('nconf'),
    winston = require('winston');

/**
 * Middleware modules
 */
var favicon          = require('serve-favicon'),
    logger           = require('morgan'),
    express          = require('express'),
    cookieParser     = require('cookie-parser'),
    bodyParser       = require('body-parser'),
    templates        = require('templates.js'),
    compression      = require('compression'),
    expressValidator = require('express-validator'),
    mongoose         = require('mongoose'),
    passport         = require('passport'),
    session          = require('express-session'),
    flash            = require('connect-flash');

var db   = require('../database').initialize(),
    auth = require('../authentication');

var middleware = {};

module.exports = function(app) {
  middleware = require('./middleware')(app);

  // register templates.js
  app.engine('tpl', templates.__express);

  // set view path
  app.set('views', path.join(nconf.get('path'), nconf.get('views:templates:path')));

  // set view engine
  app.set('view engine', nconf.get('views:templates:engine'));

  // add JSON indenting
  app.set('json spaces', 2);

  /**
   * Load standard middleware to apply on any request
   */

  // if we are in dev mode, enable the Morgan request logger. It will log all requests made to
  // the server to the winston log using a custom WinstonStream object.
  if (nconf.get('environment') === 'development') {
    var winstonStream = {
      write: function(message) {
        winston.verbose('[request] ' + message.replace(/\n$/, ''));
      }
    };

    app.use(logger('dev', {
      stream: winstonStream
    }));
  }


  app.use(bodyParser.urlencoded({
    extended: false,
    limit: '5mb'
  }));

  // input validation
  app.use(expressValidator());

  app.use(bodyParser.json());

  app.use(cookieParser());
  app.use(express.static(path.join(nconf.get('path'), 'public')));

  app.enable('view cache');
  app.use(compression());


  var cookie = {
    // Set maximum login time to two weeks
    maxAge: 1000 * 60 * 60 * 24 * 14
  };

  if (nconf.get('secure')) {
    cookie.secure = true;
  }

  app.use(session({
    store:             db.sessionStore(session),
    secret:            nconf.get('secret'),
    key:               'express.sid',
    cookie:            cookie,
    resave:            true,
    saveUninitialized: true
  }));
  app.use(flash());

  auth.initialize(app, middleware);

  return middleware;
};
