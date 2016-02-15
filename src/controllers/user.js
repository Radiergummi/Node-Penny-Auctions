/*
 global module,
 require
 */

var fs = require('fs'),
    winston = require('winston'),
    nconf = require('nconf');

var UserModel = require('../user');

var user = module.exports = {},
    userVariables = function (req) {
      return {
        loggedIn:     true,
        username:     req.user.local.username,
        id:           req.user.getId(),
        credits:      req.user.data.paymentUnits,
        settings:     req.user.getSettings(),
        isAdmin:      req.user.data.admin,
        profileImage: req.user.getProfileImage()
      };
    };

user.getUserPage = function (req, res, next) {
  UserModel.getByName(req.params.username, function (error, user) {
    if (error) {
      return next(new Error('Could not find data for user ' + req.params.username + ': ' + error));
    }

    if (! user) {
      //return next(new Error('This user does not exist.'));
      return res.status(404).render('errors/404', {
        message: 'This user does not exist.'
      });
    }


    var vars = {
      profile: {
        id:          user._id.toString(),
        username:    user.local.username,
        isAdmin:     user.data.admin,
        isSelf:      (user._id.toString() === req.user.getId()),
        auctions:    user.data.auctions,
        connections: user.getConnections(),
        email:       user.data.email,
        image:       user.getProfileImage(),
        birthday:    user.data.birthday
      },
      user:    userVariables(req)
    };

    res.render('users/user', vars);
  });
};

user.getUserSettingsPage = function (req, res, next) {
  UserModel.getByName(req.params.username, function (error, user) {
    if (error) return next(new Error('Could not find data for user ' + req.params.username + ': ' + error));

    var vars = {
      settings: user.settings,
      user:     userVariables(req)
    };

    res.render('users/settings', vars);
  });
};

user.editUserProfile = function (req, res, next) {
  var username = req.params.username;

  // TODO: INPUT VALIDATION!

  UserModel.getByName(username, function (error, user) {
    if (error) {
      res.status(500).json({
        errorMessage: error
      });
    }

    /**
     * if a file was submitted, disable Gravatar images for this user
     */
    if (req.file) {
      user.changeSetting('useGravatarImage', false);
    }

    req.assert('email', 'Es muss eine gültige E-Mail-Adresse angegeben werden').isEmail();
    req.assert('birthday', 'Das Geburtsdatum muss im Format 01-02-3456 angegeben werden').isDate();

    var errors = req.validationErrors();
    if (errors) {
      res.send('Die Eingaben wurden in einem fehlerhaften Format angegeben', 400);
      return;
    }

    user.data.email = req.body.email;
    user.data.birthday = req.body.birthday;

    user.save(function (error) {
      if (error) {
        res.status(500).json({
          errorMessage: error
        });
      }

      res.json({
        sucess: true
      });
    });
  });
};

user.editSettings = function (req, res, next) {
  var username = req.params.username;

  var fields = req.body;
  winston.info(req.body.showLastAuctions);
  for (var i in fields) {
    req.sanitizeParams(fields[ i ]).toBoolean();
  }

  var errors = req.validationErrors();
  if (errors) {
    res.send('Die Eingaben wurden in einem fehlerhaften Format angegeben', 400);
    return;
  }

  UserModel.getByName(username, function (error, user) {
    if (error) {
      res.status(500).json({
        errorMessage: error
      });
    }

    // store the settings
    user.changeSettings(req.body);
  });

  res.redirect('/user/' + username + '/settings');
};
