/*
 global module,
 require
 */

var mongoose = require('mongoose');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

// define the schema for our user model
var itemSchema = mongoose.Schema({
  name:         String,
  description:  String,
  manufacturer: String,

  price: { type: Number, get: getPrice, set: setPrice },

  startDate: Date,

  images: [ {
    path:    String,
    altText: String
  } ],

  votes: [ {
    userId: ObjectId,
    time:   Date
  } ]
});


function getPrice(number) {
  return (number / 100).toFixed(2);
}

function setPrice(number) {
  return number * 100;
}

/**
 * returns the item ID as a string
 *
 * @returns {string}  the item ID
 */
itemSchema.methods.getId = function () {
  return this._id.toString();
};


/**
 * returns the votes array
 *
 * @returns {Array}  the votes array with all data parsed to strings
 */
itemSchema.methods.getVotes = function () {
  var votes = this.votes,
      parsedVotes = [];

  for (var i in votes) {
    if (votes.indexOf(i) === -1) continue;

    var vote = votes[ i ];

    parsedVotes.push({
      userId: vote.userId.toString(),
      time: vote.time.toString()
    })
  }

  return parsedVotes;
};


/**
 * create the model for users and expose it to our app
 *
 * @type {Aggregate|Model|*}
 */
module.exports = mongoose.model('Item', itemSchema);
