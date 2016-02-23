/*
 global module,
 require
 */

'use strict';

var winston = require('winston');

var User = require('../user');

var AdminSocket = {};

AdminSocket.user = require('./admin/user');
AdminSocket.item = require('./admin/item');

AdminSocket.before = function (socket, method, data, next) {
  if (! socket._id) {
    winston.warn('[socket.io] Call to admin method (' + method + ') blocked (accessed by IP ' + socket.ip + ')');
    return;
  }

  User.getById(socket._id, function (error, user) {
    if (error || user.data.admin) {
      return next(error);
    }

    winston.warn('[socket.io] Call to admin method (' + method + ') blocked (accessed by uid ' + socket._id + ' with IP ' + socket.ip + ')');
  });
};

AdminSocket.getSystemStats = function (socket, data, callback) {
  var system = require('../libs/system');
  socket.emit('admin.systemStats', {
    cpuUsage:    system.cpuUsage(),
    memoryUsage: system.memoryUsage()
  });

  callback(null);
};

module.exports = AdminSocket;
