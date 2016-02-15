/*
 global module,
 require
 */

'use strict';

var mongoose = require('mongoose'),
    async = require('async');

var settings = require('../settings');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

// define the schema for our user model
var auctionSchema = mongoose.Schema({
  item: ObjectId,

  price: Number,

  startTime: Date,
  endTime:   Date,

  bids: [ {
    userId: ObjectId,
    time:   Date
  } ]
});


auctionSchema.methods.updateBids = function (userId, userTime, callback) {
  var auction = this;

  auction.bids.push({
    userId: userId,
    time:   userTime
  });

  async.waterfall([
    /**
     * increase the auction price
     *
     * @param next
     */
    function (next) {
      settings.get('priceIncrementPerBid', function (value) {
        value = value || 1;

        auction.price = (auction.price + value);
        auction.save(next);
      });
    },


    /**
     * increase the auction end time
     *
     *
     * @param data
     * @param status
     * @param next
     */
    function (data, status, next) {
      settings.get('timeIncrementPerBid', function (value) {
        value = value || 10;

        auction.endTime = new Date(auction.endTime.getTime() + (value * 1000));
        auction.save(next);
      });
    },


    /**
     * emit the updateAuction event to all clients,
     * so they can update their auction items accordingly
     *
     * @param data
     * @param status
     * @param next
     */
    function (data, status, next) {
      require('../socket.io').server.sockets.emit('auction.updateAuction', {
        id:      data._id.toString(),
        price:   data.price.toString().slice(0, -2) + ',' + data.price.toString().slice(-2)  + '€',
        endTime: data.endTime
      });
    }
  ], function (error) {
    if (error) {
      return new Error(error);
    }
  });
};

/**
 * create the model for users and expose it to our app
 *
 * @type {Aggregate|Model|*}
 */
module.exports = mongoose.model('Auction', auctionSchema);
