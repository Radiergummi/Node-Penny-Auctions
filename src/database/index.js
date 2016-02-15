/*
 global module,
 require
 */

/**
 * Returns a mongo database handle
 */
(function (module) {
  var mongoose = require('mongoose'),
      mongoStore = require('connect-mongo'),
      winston = require('winston'),
      nconf = require('nconf');

  module.helpers = module.helpers || {};
  module.helpers.mongo = require('./helpers');

  /**
   * initializes the database
   *
   * @param {function} callback  a callback to execute once the db is connected
   * @returns {exports}
   */
  module.initialize = function (callback) {
    callback = callback || function () {
        };

    // optionally use authentication
    var usernamePassword = '';
    if (nconf.get('database:username') && nconf.get('database:password')) {
      usernamePassword = nconf.get('database:username') + ':' + encodeURIComponent(nconf.get('database:password')) + '@';
    }

    // Sensible defaults for Mongo, if not set
    if (! nconf.get('database:host')) {
      nconf.set('database:host', '127.0.0.1');
    }
    if (! nconf.get('database:port')) {
      nconf.set('database:port', 27017);
    }
    if (! nconf.get('database:name')) {
      nconf.set('database:name', '0');
    }

    // grab database host(s)
    var hosts = nconf.get('database:host').split(',');

    // grab database port(s)
    var ports = nconf.get('database:port').toString().split(',');
    var servers = [];

    for (var i = 0; i < hosts.length; i ++) {
      servers.push(hosts[ i ] + ':' + ports[ i ]);
    }

    // build connection string
    var connString = 'mongodb://' + usernamePassword + servers.join() + '/' + nconf.get('database:name');

    var connOptions = {
      auth: {
        authdb: "admin"
      }
    };

    // Connect to mongo db
    mongoose.connect(connString, connOptions);
    winston.info('[database]'.white + ' Database connection established.');


    require('./main')(mongoose, module);
    require('./hash')(mongoose, module);
    require('./sets')(mongoose, module);
    require('./sorted')(mongoose, module);
    require('./list')(mongoose, module);

    return this;
  };

  module.sessionStore = function(session) {
    var mongo = mongoStore(session);

    try {
      return new mongo({
        mongooseConnection: mongoose.connection,
        stringify: false
      });
    }
    catch (error) {
      winston.error('[database]'.white + ' Could not reuse mongoose connection as session storage. Is the connection initialized?');
      winston.error('[database]'.white + ' %s', error.message);
    }
  };

  module.collection = function(name) {
    try {
      return mongoose.connection.db.collection(name);
    } catch (error) {
      winston.error('[database]'.white + ' Could not retrieve mongoose collection');
      winston.error('[database]'.white + ' %s', error.message);
    }
  };
}(exports));
