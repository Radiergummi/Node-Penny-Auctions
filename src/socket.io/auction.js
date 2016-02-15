/*
 global module,
 require
 */

'use strict';

var async = require('async');

var Auction = require('../auction'),
    User = require('../user');

var AuctionSocket = module.exports = {};

/**
 * Socket.io action for auction.bid
 *
 * @param socket
 * @param data
 * @param callback
 */
AuctionSocket.bid = function(socket, data, callback) {
  async.waterfall([
    function(next) {
      User.getById(socket._id, function(error, user) {
        if (error) {
          return next(error);
        }

        if (user.paymentUnits === 0) {
          return callback(new Error('payment:no_units_left'));
        }

        user.data.paymentUnits = (user.data.paymentUnits - 1);

        socket.emit('user.updatePaymentUnits', user.data.paymentUnits);

        user.save(next);
      });
    },
      function(userObject, status, next) {
        Auction.getById(data.id, function(error, auction) {
          if (error) {
            return callback(error);
          }

          auction.updateBids(socket._id, data.localBidtime, callback);
        });
      }
    ], function(error) {
    if (error) {
      return callback(error);
    }
  });
};
