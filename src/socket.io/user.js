/*
 global module,
 require
 */

var UserSocket = module.exports = {};

UserSocket.foo = function(socket, data, callback) {
 socket.emit('user.foo', {});
 callback(null);
};
