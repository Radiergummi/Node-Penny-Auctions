/*
 global module,
 require
 */

'use strict';

var async = require('async');

var Item = require('../item'),
    User = require('../user');

var ItemSocket = module.exports = {};

/**
 * Socket.io action for auction.bid
 *
 * @param socket
 * @param data
 * @param callback
 */
ItemSocket.vote = function(socket, data, callback) {
  async.waterfall([
    function(next) {
      User.getById(socket._id, function(error, user) {
        if (error) {
          return next(error);
        }

        if (! user) {
          return callback(new Error('This user does not exist'));
        }
      });
    },
    function(userObject, status, next) {
      Item.getById(data.id, function(error, item) {
        if (error) {
          return callback(error);
        }

        item.updateVotes(socket._id, data.localVoteTime, callback);
      });
    }
  ], function(error) {
    if (error) {
      return callback(error);
    }
  });
};


ItemSocket.getCurrentVotes = function(socket, data, callback) {
  Item.getById(data.id, function(error, item) {
    if (error) {
      return callback(error);
    }

    if (! item) {
      return callback(new Error('This item does not exist'));
    }

    return callback(null, item.votes.length);
  });
};
