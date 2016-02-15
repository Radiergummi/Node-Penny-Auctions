/*
 global module,
 require
 */

'use strict';

var merge = require('merge'),
    templates = require('templates.js'),
    bcrypt = require('bcrypt-nodejs'),
    winston = require('winston');

var File = require('../libs/file'),
    User = require('../user');

var AdminSocket = module.exports = {};

AdminSocket.before = function(socket, method, data, next) {
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


AdminSocket.getUserData = function (socket, data, callback) {
  User.getById(data.id, function (error, user) {
    if (error) {
      return callback(error);
    }

    if (! user) {
      return callback(new Error('This user does not exist'));
    }

    File.read('public/templates/admin/partials/editUserModal.tpl', function (template) {
      return callback(null, templates.parse(template.toString(), JSON.parse(JSON.stringify(user))));
    });
  });
};


AdminSocket.saveUserData = function (socket, data, callback) {
  User.getById(data.id, function(error, user) {
    if (error) {
      return callback(error);
    }

    if (! user) {
      return callback(new Error('This user does not exist'));
    }

    // remove user ID
    delete data.id;

    // if we have a password, hash it
    if (data.local.hasOwnProperty('password')) {
      data.local.password = bcrypt.hashSync(data.local.password, bcrypt.genSaltSync(8), null);
    }

    // merge the new data in
    user = merge.recursive(false, user, data);

    user.save(function(error) {
      return callback(error);
    });

    callback(null);
  });
};
