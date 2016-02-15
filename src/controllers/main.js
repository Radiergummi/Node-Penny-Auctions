/*
 global module,
 require
 */

var helpers = require('./helpers');

var main = module.exports = {},
    userVariables = function (req) {
      var loggedIn = req.hasOwnProperty('user');

      if (loggedIn) {
        return {
          loggedIn: true,
          username: req.user.local.username,
          id:       req.user.getId(),
          credits:  req.user.data.paymentUnits,
          settings: req.user.getSettings(),
          isAdmin:  req.user.data.admin,
          profileImage: req.user.getProfileImage()
        };
      }

      return {
        loggedIn: false,
        username: 'guest',
        id:       '0',
        credits:  null,
        settings: null,
        isAdmin:  false,
        profileImage: '/images/user/default.jpg'
      };
    };


main.home = function (req, res, next) {
  var vars = {
    banner: 'Herzlich Willkommen auf Golden Deals. Besuchen Sie unsere Seite zum ersten mal? Dann erfahren Sie <a href="/about">hier</a> mehr.',
    user: userVariables(req)
  };

  res.render('index', vars);
};

main.login = function (req, res, next) {
  var data = {};
  data.error = req.flash('error')[ 0 ];

  res.render('login', data);
};

main.logout = function (req, res, next) {
  var data = {};
  data.error = req.flash('error')[ 0 ];

  res.redirect('/', data);
};

main.register = function (req, res, next) {
  var data = {
    recaptcha: req.recaptcha,
    error:  req.flash('error')[ 0 ]
  };

  res.render('register', data);
};

main.chat = function (req, res, next) {
  res.render('chat', {})
};

main.imprint = function (req, res, next) {
  res.render('imprint', {})
};

main.termsofservice = function (req, res, next) {
  res.render('termsofservice', {})
};

main.faq = function (req, res, next) {
  res.render('faq', {})
};

main.about = function (req, res, next) {
  res.render('about', {})
};
