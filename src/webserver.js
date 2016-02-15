/*
 global module,
 require
 */

'use strict';

var nconf = require('nconf'),
    url = require('url'),
    fs = require('fs'),
    path = require('path'),
    https = require('https'),
    http = require('http'),
    winston = require('winston'),
    express = require('express'),
    systemd = require('systemd'),
    app = express(),
    middleware = require('./middleware'),
    controllers = require('./controllers'),
    routes = require('./routes'),
    server;

if (useSSL()) {
  try {
    var key  = fs.readFileSync(path.join(nconf.get('path'), 'ssl', 'private_key.pem'));
    var cert = fs.readFileSync(path.join(nconf.get('path'), 'ssl', 'certificate.pem'));
  } catch (fsError) {
    winston.error('[webserver]'.white + ' SSL certificate files could not be loaded:');
    winston.error('[webserver]'.white + ' ' + fsError.message);
    winston.error('[webserver]'.white + ' Shutting down...');
    process.exit(1);
  }

  server = require('https').createServer({
    key: key,
    cert: cert
  }, app);

  nconf.set('secure', true);
} else {
  server = require('http').createServer(app);
}


/**
 * Event listener for HTTP server "error" event.
 */
server.on('error', function(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var port = getPort(),
      bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      winston.error('[webserver] '.white + bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      winston.error('[webserver] '.white + bind + ' is already in use');
      process.exit(1);
      break;
    case 'ENOENT':
      winston.error('[webserver] '.white + bind + ' could not be read');
      process.exit(1);
      break;
    default:
      throw error;
  }
});

/**
 * Event listener for HTTP server "listening" event.
 */
server.on('listening', function() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  winston.info('[webserver]'.white + ' listening on ' + bind);

});

module.exports.server = server;
module.exports.listen = function(port) {
  // initialize the app
  initialize();

  var /*port = getPort(),*/
      bind = process.env.LISTEN_PID > 0 ? 'systemd' : port;

  // if the server is running on a port alternating from 80 or 443 or the trust proxy
  // option in the config is enabled, it is setup behind a proxy server. Which is good.
  if ((port !== 80 && port !== 443) || nconf.get('trust_proxy') === true) {
    winston.info('[webserver]'.white + ' enabling trust proxy');
    app.enable('trust proxy');
  }

  // if the server is running on either port 80 or 443 and the app is not configured to run
  // in a development environment, it is running directly on the internet, which is not
  // recommended. A proxy should be used to forward requests to node.
  if ((port === 80 || port === 443) && nconf.get('environment') !== 'development') {
    winston.info('[webserver]'.white + ' Using ports 80 and 443 is not recommended; use a proxy instead. See README.md');
  }

  // listen on the given port
  server.listen(/*bind*/port); // TODO: Implement correct socket handling. Disabled for now.
  require('./socket.io').server.sockets.emit('app.updated', {date: Date.now()});
};

function initialize() {
  // register middleware
  middleware = middleware(app);

  // load routes
  routes(app, middleware, controllers);
}

/**
 * retrieves whether SSL should be used
 *
 * @returns {boolean}
 */
function useSSL() {
  var rawUrl = nconf.get('url'),
      parsedUrl = url.parse(rawUrl);

  return nconf.get('ssl') || (parsedUrl.protocol === 'https:') || false;
}

/**
 * retrieves the port the app is configured to use
 *
 * @returns {*|number}
 */
function getPort() {
  var rawUrl = nconf.get('url'),
      parsedUrl = url.parse(rawUrl);

  return parseInt(nconf.get('port') || parsedUrl.port || 3000, 10);
}
