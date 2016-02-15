var express = require('express'),
    fs = require('fs'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    templates = require('templates.js'),
    nconf = require('nconf');

// set path variable
var PATH = __dirname;

// load libraries
var helper = require(path.join(PATH, 'src/libs/helper'));

// initialize express
var app = express();

// load routes
require(path.join(PATH, 'src/routes/main'))(app);

// register templates.js
app.engine('tpl', templates.__express);

// set view path
app.set('views', path.join(PATH, nconf.get('views:templates:path')));

// set view engine
app.set('view engine', nconf.get('views:templates:engine'));

// load middlewares
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(PATH, 'public')));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Page Not Found');
  err.status = 404;

  err.stack = err.stack.replace(new RegExp('(' + helper.escapeRegExp(PATH) + ')+', 'g'), '').trim();
  next(err);
});

// error handlers
app.use(require(path.join(PATH, 'src/libs/errorHandler')));


module.exports = app;
