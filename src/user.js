/*
 global module,
 require
 */

var mongo = require('mongodb'),
    merge = require('merge');

var userModel = require('./models/user');

var User = module.exports = {};


/**
 * retrieves user data from the database by either ID or username
 *
 * @param {string} idOrName            a users ID or name to find a user for
 * @param {userDataCallback} callback  a callback to run on the user object
 */
User.get = function(idOrName, callback) {
  var ObjectId = mongo.ObjectID;

  return userModel.find({
    $and: [
      { $or: [ { '_id': ObjectId.isValid(idOrName ) } ] },
      { $or: [ { 'local.username': idOrName } ] }
    ]
  }, function(error, user) {
    if (error) return callback(error);

    if (!user) return callback(null, false);

    callback(null, user);

    return user;
  });
};


/**
 * retrieves user data from the database by ID
 *
 * @param {string} id  the ID to find a user for
 * @param {userDataCallback} callback  a callback to run on the user object
 * @returns {object}
 */
User.getById = function(id, callback) {
  return userModel.findOne({ '_id': id }, function(error, user) {
    if (error) return callback(error);

    if (!user) return callback(null, false);

    callback(null, user);

    return user;
  });
};


/**
 * retrieves user data from the database by username
 *
 * @param {string} username  the username to find a user for
 * @param {userDataCallback} callback  a callback to run on the user object
 * @returns {object}
 */
User.getByName = function(username, callback) {
  return userModel.findOne({ 'local.username': username }, function(error, user) {
    if (error) return callback(error);

    if (!user) return callback(null, false);

    callback(null, user);

    return user;
  });
};


/**
 * retrieves user
 *
 * @param idOrName
 * @param callback
 */
User.getUserData = function(idOrName, callback) {
  return User.get(idOrName, function(error, user) {
    if (error) return callback(error);

    if (!user) return callback(null, false);

    return callback(null, user.data);
  });
};


User.getName = function(id, callback) {
  return User.getById(id, function(error, user) {
    if (error) return callback(error);

    return callback(null, user.local.username);
  });
};


/**
 * sets a key in the user data by user ID
 *
 * @param {string} id                  the user's ID
 * @param {string} key                 the user property to modify
 * @param {*} data                     the data to set on the user
 * @param {userDataCallback} callback  a callback receiving the modified user object
 */
User.setById = function(id, key, data, callback) {
  User.getById(id, function(error, user) {
    if (error) {
      return callback(error);
    }

    if (typeof data === 'object') {
      // merge the given user property with the new data
      user[key] = merge.recursive(true, user[key], data);
    } else {
      user[key] = data;
    }

    callback(null, user);
  });
};


/**
 * sets a key in the user data by username
 *
 * @param {string} name                the user's name
 * @param {string} key                 the user property to modify
 * @param {*} data                     the data to set on the user
 * @param {userDataCallback} callback  a callback receiving the modified user object
 */
User.setByName = function(name, key, data, callback) {
  User.getByName(name, function(error, user) {
    if (error) {
      return callback(error);
    }

    if (typeof data === 'object') {
      // merge the given user property with the new data
      user[key] = merge.recursive(true, user[key], data);
    } else {
      user[key] = data;
    }

    callback(null, user);
  });
};


/**
 * get all users
 *
 * param {userDataCallback} callback  a callback receiving the users array
 */
User.getAll = function(callback) {
  userModel.find({}, function(error, data) {
    if (error) {
      return callback(error);
    }

    if (! data) {
      return callback(null, []);
    }

    return callback(null, data);
  });
};


/**
 * Callback for working with user data
 *
 * @callback userDataCallback
 * @param {object|null} [error]  object in case an error is thrown, else will be null
 * @param {object|bool} user     object with user data if found, else will be false
 */
