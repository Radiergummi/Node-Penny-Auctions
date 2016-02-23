/*
 global module,
 require
 */

'use strict';

var mongoose = require('mongoose'),
    merge = require('merge');

var db = require('./database');

var Settings = module.exports = {},
    settingsStore = null;


/**
 * @callback settingCallback
 *
 * @param {Error|null} error  an Error object if present, null if not
 * @param {Object} data       returned settings data from Mongoose
 */

/**
 * @callback safeSettingCallback
 *
 * @param {*} data       returned settings data from Mongoose
 */


/**
 * retrieves a settings object handle from Mongoose
 *
 * @param {string} name               the setting name
 * @param {settingCallback} callback  a callback to execute on the settings object
 */
function find(name, callback) {
  // populate settings store if empty
  if (settingsStore === null) {
    settingsStore = db.collection('settings');
  }

  settingsStore.findOne({ 'name': name }, function(error, data) {
    if (error || ! data) {
      return callback(error);
    }

    callback(null, data);
  });
}


/**
 * retrieves a setting from the database
 *
 * @param {string} name                   the name of the setting to get
 * @param {safeSettingCallback} callback  a callback to execute once the data setting has been retrieved
 */
Settings.get = function(name, callback) {
  find(name, function(error, data) {
    if (error) {
      return callback(error);
    }

    if (! data) {
      return callback(new Error('Setting ' + name + ' does not exist'));
    }

    callback(null, data.value);
  });
};


/**
 * sets a setting to the database
 *
 * @param {string} name               the name of the setting to set
 * @param {*} value                   the value of the setting to set
 * @param {settingCallback} callback  a callback to execute once the data setting has been set
 *
 * @returns {object}                  the modified data object
 */
Settings.set = function(name, value, callback) {

  // populate settings store if empty
  if (settingsStore === null) {
    settingsStore = db.collection('settings');
  }

  settingsStore.findOneAndUpdate({ 'name': name }, {
    'name': name,
    'value': value
  }, { upsert: true }, function(error, data) {
    if (error) throw new Error(error);

    callback(data);
  });
};


/**
 * checks whether a setting is present in the database
 *
 * @param {string} name               the name of the setting to check for
 * @param {settingCallback} callback  a callback to execute once the data setting
 *                                    has been checked for
 *
 * @returns {bool}
 */
Settings.has = function(name, callback) {
  find(name, function(error) {
    if (error) return callback(false);

    return callback(true);
  });
};


/**
 * deletes a setting from the database
 *
 * @param {string} name  the name of the setting to check for
 *
 * @returns undefined
 */
Settings.del = function(name) {
  find(name, function(error, data) {
    if (error) throw new Error(error);

    delete data[name];

    data.save(function(error) {
      if (error) throw new Error(error);
    });
  });
};


/**
 * flushes all settings in the database
 *
 * @param callback
 */
Settings.flush = function(callback) {
  // TODO: Implement flushing
};


/**
 * resets all settings to their default values
 *
 * @param name
 * @param callback
 */
Settings.reset = function(name, callback) {
  // TODO: Implement default setting store
};
