/*
 global module,
 require
 */

'use strict';

var nconf = require('nconf'),
    async = require('async'),
    colors = require('colors'),
    winston = require('winston'),
    SocketIO = require('socket.io'),
    socketioWildcard = require('socketio-wildcard')(),
    cookieParser = require('cookie-parser')(nconf.get('secret'));

var db = require('../database'),
    User = require('../user');

var Sockets = module.exports = {},
    Namespaces = {},
    io;

Sockets.initialize = function (server) {
  requireModules();

  io = new SocketIO();

  io.use(socketioWildcard);
  io.use(authorize);

  io.on('connection', onConnection);

  io.listen(server, {
    transports: [
      'websocket',
      'htmlfile',
      'xhr-polling',
      'jsonp-polling',
      'polling'
    ]
  });

  // store prepared socket.io-Server in the exports
  Sockets.server = io;

  winston.info('[socket.io]'.white + ' Socket.io-Server has been initialized.');
};

function requireModules() {
  var modules = [
    'admin',
    'user',
    'chat',
    'auction'
  ];

  modules.forEach(function(module) {
    Namespaces[module] = require('./' + module);
  });
}

function authorize(socket, callback) {
  var handshake = socket.request;

  if (! handshake) {
    return callback(new Error('[[error:not-authorized]]'));
  }

  async.waterfall([
    function (next) {
      // parse the handshake cookie
      cookieParser(handshake, {}, next);
    },
    function (next) {
      // get the session database collection handle
      var sessionStore = db.collection('sessions');

      // try to find the session ID in the database
      sessionStore.findOne({ '_id': handshake.signedCookies[ 'express.sid' ] }, function (error, data) {
        if (error || ! data) {
          return next(error);
        }

        // retrieve the server-side session data
        var session = data.session;

        // check if there are any credentials stored along the session data
        if (session.passport && session.passport.user) {
          // user ID found, assign ID to the socket
          socket._id = session.passport.user;
        } else {
          // no user ID found in session data, assign guest ID
          socket._id = 0;
        }
        next();
      });
    }
  ], callback);
}

function onConnection(socket) {
  // retrieve original IP address
  socket.ip = socket.request.headers[ 'x-forwarded-for' ] || socket.request.connection.remoteAddress;

  onConnect(socket);

  socket.on('disconnect', function (data) {
    onDisconnect(socket, data);
  });

  socket.on('*', function (payload) {
    onMessage(socket, payload);
  });
}

function onConnect(socket) {
  if (socket._id) {
    socket.join('_id_' + socket._id);
    socket.join('online_users');

    User.getById(socket._id, function(error, user) {
      if (error || ! user) {
        return undefined;
      }

      if (user.data.status !== 'offline') {
        socket.broadcast.emit('event:user_status_change', {
          _id:    socket._id,
          status: user.data.status || 'online'
        });
      }
    });
  } else {
    socket.join('online_guests');
  }
}

function onDisconnect(socket) {
  if (socket._id) {
    var socketCount = Sockets.getUserSocketCount(socket._id);
    if (socketCount <= 1) {
      socket.broadcast.emit('event:user_status_change', {
        _id: socket._id,
        status: 'offline'
      });
    }
  }
}

function onMessage(socket, payload) {
  if (! payload.data.length) {
    return winston.warn('[socket.io] Empty payload');
  }

  socket.emit('hi');

  var eventName = payload.data[ 0 ],
      params = payload.data[ 1 ],
      callback = typeof payload.data[ payload.data.length - 1 ] === 'function'
        ? payload.data[ payload.data.length - 1 ]
        : function () {};

  if (! eventName) {
    return winston.warn('[socket.io] Empty method name');
  }

  // split the message in controller and method:
  // each io message is expected to be named as "<controller>.<method>".
  var parts = eventName.toString().split('.'),
      namespace = parts[ 0 ];

  var methodToCall = parts.reduce(function (namespaces, method) {
        if (namespaces !== null && namespaces[ method ]) {
          return namespaces[ method ];
        } else {
          return null;
        }
      }, Namespaces);

  if (! methodToCall) {
    if (nconf.get('environment') === 'development') {
      winston.warn('[socket.io] Unrecognized message: ' + eventName);
    }
    return;
  }

  socket.previousEvents = socket.previousEvents || [];
  socket.previousEvents.push(eventName);
  if (socket.previousEvents.length > 20) {
    socket.previousEvents.shift();
  }

  // run any "before"-handlers before the actual method
  if (Namespaces[ namespace ].before) {
    Namespaces[ namespace ].before(socket, eventName, params, function (err) {
      if (err) {
        return callback({ message: err.message });
      }

      callMethod(methodToCall, socket, params, callback);
    });
  } else {
    callMethod(methodToCall, socket, params, callback);
  }
}

function callMethod(method, socket, params, callback) {
  method(socket, params, function (err, result) {
    callback(err ? { message: err.message } : null, result);
  });
}

Sockets.in = function (room) {
  return io.in(room);
};

Sockets.getSocketCount = function () {
  if (! io) {
    return 0;
  }

  return Object.keys(io.sockets.sockets).length;
};


Sockets.getConnectedClients = function () {
  var sockets = io.sockets.sockets,
      clients = [],
      i;

  if (! io) {
    return {};
  }

  for (i in sockets) {
    if (sockets.hasOwnProperty(i)) {
      clients.push(sockets[i].ip);
    }
  }

  return clients;
};


Sockets.getUserSocketCount = function (_id) {
  if (! io) {
    return 0;
  }
  var room = io.sockets.adapter.rooms[ '_id_' + _id ];
  return room ? room.length : 0;
};

Sockets.getOnlineUserCount = function () {
  if (! io) {
    return 0;
  }
  var room = io.sockets.adapter.rooms.online_users;
  return room ? room.length : 0;
};

Sockets.getOnlineAnonCount = function () {
  if (! io) {
    return 0;
  }
  var room = io.sockets.adapter.rooms.online_guests;
  return room ? room.length : 0;
};

Sockets.reqFromSocket = function (socket) {
  var headers = socket.request.headers,
      host = headers.host,
      referrer = headers.referrer || '';

  return {
    ip:       headers[ 'x-forwarded-for' ] || socket.ip,
    host:     host,
    protocol: socket.request.connection.encrypted ? 'https' : 'http',
    secure:   ! ! socket.request.connection.encrypted,
    url:      referrer,
    path:     referrer.substr(referrer.indexOf(host) + host.length),
    headers:  headers
  };
};
