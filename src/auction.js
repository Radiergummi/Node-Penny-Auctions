/*
 global module,
 require
 */

var mongo = require('mongodb');

var auctionModel = require('./models/auction');

var Auction = module.exports = {};


/**
 * retrieves user data from the database by ID
 *
 * @param {string} id  the ID to find a user for
 * @param {userDataCallback} callback  a callback to run on the user object
 * @returns {object}
 */
Auction.getById = function(id, callback) {
  auctionModel.findOne({ '_id': id }, function(error, auction) {
    if (error) return callback(error);
    if (! auction) throw new Error('The auction does not exist');

    callback(null, auction);
  });
};

Auction.getAll = function(callback) {
  auctionModel.find({}, function(error, auctions) {
    if (error) return callback(error);
    if (! auctions) return callback(null, []);

    return callback(null, auctions);
  });
};
