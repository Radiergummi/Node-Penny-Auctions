/*
 global module,
 require
 */

var mongoose = require('mongoose'),
    nconf = require('nconf'),
    fs = require('fs'),
    bcrypt = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({
  local: {
    username: String,
    password: String
  },

  facebook: {
    id:    String,
    token: String,
    email: String,
    name:  String
  },

  google: {
    id:    String,
    token: String,
    email: String,
    name:  String
  },

  settings: {
    showLastAuctions: Boolean,
    useGravatarImage: { type: Boolean, default: true }
  },

  data: {
    admin:        { type: Boolean, default: false },
    email:        String,
    profileImg:   String,
    realname:     String,
    birthday:     String,
    registerDate: Date,
    status:       String,

    paymentUnits: Number,

    auctions: [ {
      id:       String,
      name:     String,
      date:     Date,
      endPrice: String
    } ],

    connections: [ {
      remoteAddress: String,
      hostname:      String,
      location:      String,
      lastSeen:      Date
    } ]
  }
});


/**
 * generating a hash
 *
 * @param password
 * @returns {*}
 */
userSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};


/**
 * checking if password is valid
 *
 * @param password
 * @returns {*}
 */
userSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.local.password);
};


userSchema.methods.updateConnections = function (remoteAddress) {
  var connections = this.data.connections;

  for (var i in connections) {
    var connection = connections[ i ];
    if (connection.remoteAddress === remoteAddress) {
      connections[ i ][ 'lastSeen' ] = Date.now();
      this.save(function (err) {
        if (err) throw err;
      });

      return;
    }
  }

  connections.push({
    remoteAddress: remoteAddress,
    hostname:      'TODO', // TODO: Retrieve hostname of remote client
    location:      'TODO', // TODO: Implement location API
    lastSeen:      Date.now()
  });


  this.save(function (err) {
    if (err) throw err;
  });
};

userSchema.methods.getSettings = function () {
  return this.settings;
};

userSchema.methods.changeSetting = function(setting, value) {
  settings = {};
  settings[setting] = value;

  this.changeSettings(settings);
};

userSchema.methods.changeSettings = function(settings) {
  for (var key in settings) {
    this.settings[key] = settings[key];
  }

  this.save(function(err) {
    if (err) throw err;
  });
};

userSchema.methods.getConnections = function () {
  var connections = this.data.connections;

  /**
   * TODO: The godfather of quick and dirty solutions. Writing to the connections object fails for
   * some reason and I'm completely unmotivated to dig into this now. Most likely something totally
   * stupid. Temporary solution is to just use the JSON lib to stringify each object value. Why?
   * The template library does not like iteration over non-string values.
   */

  // for (var i = 0; i <= connections.length; i++) {
  //   if (typeof connections[i] === 'undefined') break;
  //   connections[i].lastSeen = connections[i].lastSeen.toString();
  //   connections[i]._id = connections[i]._id.toString();
  // }

  return JSON.parse(JSON.stringify(connections));
};

userSchema.methods.getId = function () {
  return this._id.toString();
};

userSchema.methods.getProfileImage = function () {
  // if the Gravatar setting is not explictly turned on
  if (this.settings.useGravatarImage !== true) {
    try {
      fs.accessSync(nconf.get('path') + '/public/images/user/' + this._id + '.jpg', fs.F_OK);

      return nconf.get('url') + '/images/user/' + this._id + '.jpg';
    } catch(error) {
      winston.info('No custom profile image found for user ' + this.local.username);
      if (this.settings.useGravatarImage === false) {

        // fallback to default image
        return nconf.get('url') + '/images/user/default.jpg';
      }
    }
  }

  // return Gravatar
  return require('gravatar').url(this.data.email, {
    size:         200,
    rating:       'pg',
    default:      encodeURIComponent(nconf.get('url').replace(/.*?:\/\//g, '') + '/images/user/default.jpg'),
    forceDefault: false
  });
};


/**
 * create the model for users and expose it to our app
 *
 * @type {Aggregate|Model|*}
 */
module.exports = mongoose.model('User', userSchema);
