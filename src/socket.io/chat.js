/*
 global module,
 require
 */

var ChatSocket = module.exports = {};

ChatSocket.message = function(socket, data, callback) {
  socket.emit('chat.message', {
    from: socket._id,
    sent: new Date().toLocaleDateString('de-DE', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }),
    message: data
  });

  callback(null);
};
