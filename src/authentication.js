(function(Auth) {
  var passport        = require('passport'),
      localStrategy   = require('passport-local').Strategy,
      nconf           = require('nconf'),
      winston         = require('winston'),
      express         = require('express'),
      controllers     = require('./controllers'),
      userModel       = require('./models/user'),
      User            = require('./user'),

      loginStrategies = [];

  Auth.initialize = function(app, middleware) {
    app.use(passport.initialize());
    app.use(passport.session());

    Auth.app = app;
    Auth.middleware = middleware;

    passport.use('local-signup', new localStrategy(
        {
          usernameField    : 'username',
          passwordField    : 'password',
          passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {

          // asynchronous
          // userModel.findOne wont fire unless data is sent back
          process.nextTick(function() {
            var recaptcha = nconf.get('recaptcha');

            if (recaptcha && req.recaptcha.error) {
              return done(null, false, req.flash('error', 'Der Google-Captcha konnte nicht verifiziert werden.'));
            }

            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            userModel.findOne({ 'local.username': username }, function(err, user) {
              // if there are any errors, return the error
              if (err)
                return done(err);

              // check to see if there's already a user with that email
              if (user) {
                return done(null, false, req.flash('error', 'Dieser Benutzername ist bereits vergeben.'));
              } else {

                // if there is no user with that email
                // create the user
                var newUser = new userModel();

                // set the user's local credentials
                newUser.local.username = username;
                newUser.local.password = newUser.generateHash(password);
                newUser.data.email = req.body.email;

                // save the user
                newUser.save(function(err) {
                  if (err)
                    throw err;
                  return done(null, newUser);
                });
              }
            });
          });
        })
    );

    passport.use('local-login', new localStrategy(
      {
        usernameField    : 'username',
        passwordField    : 'password',
        passReqToCallback: true // allows us to pass back the entire request to the callback
      },
      function(req, username, password, done) { // callback with email and password from our form

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        userModel.findOne({ 'local.username': username }, function(err, user) {
          // if there are any errors, return the error before anything else
          if (err) return done(err);

          // if no user is found, return the message
          if (!user) {
            // req.flash is the way to set flash data using connect-flash
            return done(null, false, req.flash('error', 'Die angebenen Anmeldeinformationen sind ungültig.'));
          }

          // if the user is found but the password is wrong
          if (!user.validPassword(password)) {
            // create the loginMessage and save it to session as flash data
            return done(null, false, req.flash('error', 'Die angebenen Anmeldeinformationen sind ungültig.'));
          }

          user.updateConnections(req.headers[ 'x-forwarded-for' ] || req.connection.remoteAddress);

          // all is well, return successful user
          return done(null, user);
        });
      }));
  };

  Auth.register = passport.authenticate('local-signup', {
    successRedirect: '/', // redirect to the secure profile section
    failureRedirect: '/register', // redirect back to the signup page if there is an error
    failureFlash   : true // allow flash messages
  });

  Auth.login = passport.authenticate('local-login', {
    successRedirect: '/', // redirect to the secure profile section
    failureRedirect: '/login', // redirect back to the signup page if there is an error
    failureFlash   : true // allow flash messages
  });

  Auth.getLoginStrategies = function() {
    return loginStrategies;
  };

  // used to serialize the user for the session
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
    userModel.findById(id, function(err, user) {
      done(err, user);
    });
  });
}(exports));
