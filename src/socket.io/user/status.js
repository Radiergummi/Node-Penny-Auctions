/*
 global module,
 require
 */

var user = require('../../user');
var io = require('../index');

module.exports = function(SocketUser) {
  SocketUser.checkStatus = function(socket, _id, callback) {
    if (! socket._id) {
      return callback('[[error:invalid-uid]]');
    }

    user.getById(_id, function(error, user) {
      if (error) {
        return callback(error);
      }

      callback(null, user.data.status);
    });
  };

  SocketUser.setStatus = function(socket, status, callback) {
    if (! socket._id) {
      return callback(new Error('[[error:invalid-uid]]'));
    }

    var allowedStatus = [
      'online',
      'offline',
      'dnd',
      'away'
    ];

    if (allowedStatus.indexOf(status) === -1) {
      return callback(new Error('[[error:invalid-user-status]]'));
    }

    user.setById(socket._id, 'data', { status: status }, function(error) {
      if (error) {
        return callback(error);
      }

      var data = {
        uid:    socket.uid,
        status: status
      };

      io.server.emit('event:user_status_change', data);
      callback(null, data);
    });
  };
};
