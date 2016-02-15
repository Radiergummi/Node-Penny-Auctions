var async = require('async'),
    nconf = require('nconf'),
    recaptcha = require('express-recaptcha'),
    csrf = require('csurf'),
    multer = require('multer'),
    gm = require('gm'),
    ensureLoggedIn = require('connect-ensure-login');

var user = require('../user');

var controllers = {
      api:     require('../controllers/api'),
      helpers: require('../controllers/helpers')
    },
    middleware = {};

/**
 * Authenticates a user
 *
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
middleware.authenticate = function (req, res, next) {
  if (req.user) {
    return next();
  }

  controllers.helpers.notAllowed(req, res);
};

recaptcha.init(
  nconf.get('recaptcha:public'),
  nconf.get('recaptcha:secret'),
  {
    theme: 'dark',
    type:  'image'
  }
);

middleware.recaptcha = recaptcha.middleware;

middleware.upload = function(storage) {
  if (typeof storage === 'string') {
    return multer({
      dest: nconf.get('path') + storage
    });
  }

  return multer({
    storage: storage
  })
};

middleware.uploadProfileImage = function(req, res, next) {
  var storage = multer.diskStorage({
    destination: nconf.get('path') + '/public/images/user/',
    filename: function(req, file, callback) {
      callback(null, req.user._id + '.jpg');
    }
  });

  return multer({
    storage: multer.memoryStorage(),
    fileFilter: function(req, file, callback) {
      var mimetypes = [ 'image/jpg', 'image/png', 'image/gif' ];

      if (mimetypes.indexOf(file.mimetype)) {
        return callback(null, true);
      }

      return callback(null, false);
    }
  }).single('profileImage')(req, res, next);
};

middleware.storeProfileImage = function(req, res, next) {
  var filepath = nconf.get('path') + '/public/images/user/' + req.user._id + '.jpg';

  /**
   * resize and convert the image to JPG
   */
  gm(req.file.buffer).resize('200', '200').setFormat("jpg").write(
    filepath,
    function(error) {
      if (error) throw new Error(error);
    }
  );

  return next();
};


/**
 * Applies a CSRF token
 *
 * @type {Function|*}
 */
middleware.applyCSRF = csrf();


/**
 * Ensures a user is logged in
 */
middleware.ensureLoggedIn = ensureLoggedIn.ensureLoggedIn('/login');


/**
 * adds response headers
 *
 * @param req
 * @param res
 * @param next
 */
middleware.addHeaders = function (req, res, next) {
  var headers = {
    'X-Powered-By':                'GDv2',
    'X-Frame-Options':             'SAMEORIGIN',
    'Access-Control-Allow-Origin': 'null'	// yes, string null.
  };

  for (var key in headers) {
    // Foo. To make my IDE happy.
    if (headers.hasOwnProperty(key)) {
      res.setHeader(key, headers[ key ]);
    }
  }

  next();
};


/**
 * Redirects a user to his account after login
 *
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
middleware.redirectToAccountIfLoggedIn = function (req, res, next) {
  if (! req.user) {
    return next();
  }
  user.getUserField(req.user.uid, 'userslug', function (err, userslug) {
    if (err) {
      return next(err);
    }
    controllers.helpers.redirect(res, '/user/' + userslug);
  });
};


/**
 * Validates files
 *
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
middleware.validateFiles = function (req, res, next) {
  if (! Array.isArray(req.files.files) || ! req.files.files.length) {
    return next(new Error([ '[[error:invalid-files]]' ]));
  }

  next();
};


/**
 * Prepares the API
 *
 * @param req
 * @param res
 * @param next
 */
middleware.prepareAPI = function (req, res, next) {
  res.locals.isAPI = true;
  next();
};


/**
 * Checks global privacy settings
 *
 * @param req
 * @param res
 * @param next
 */
middleware.checkGlobalPrivacySettings = function (req, res, next) {
  if (! req.user) {
    return controllers.helpers.notAllowed(req, res);
  }

  next();
};


/**
 * This middleware ensures that only the requested user and admins can pass
 *
 * @param req
 * @param res
 * @param next
 */
middleware.checkAccountPermissions = function (req, res, next) {
  async.waterfall([
    function (next) {
      middleware.authenticate(req, res, next);
    },
    function (next) {
      user.getUidByUserslug(req.params.userslug, next);
    },
    function (uid, next) {
      if (parseInt(uid, 10) === req.uid) {
        return next(null, true);
      }

      user.isAdministrator(req.uid, next);
    }
  ], function (err, allowed) {
    if (err || allowed) {
      return next(err);
    }
    controllers.helpers.notAllowed(req, res);
  });
};


/**
 * Checks if a user is an admin
 *
 * @param req
 * @param res
 * @param next
 */
middleware.isAdmin = function (req, res, next) {
  if (! req.user) {
    return controllers.helpers.notAllowed(req, res);
  }

  if (! req.user.data.admin) {
    return controllers.helpers.notAllowed(req, res);
  }

  return next(null);
};


/**
 * Adds a touch icon
 *
 * @param req
 * @param res
 * @returns {*}
 */
middleware.routeTouchIcon = function (req, res) {
  return res.sendFile(path.join(__dirname, '../../public/images/logo.png'), {
    maxAge: app.enabled('cache') ? 5184000000 : 0
  });
};


/**
 * Adds expiration headers
 * @param req
 * @param res
 * @param next
 */
middleware.addExpiresHeaders = function (req, res, next) {
  if (app.enabled('cache')) {
    res.setHeader("Cache-Control", "public, max-age=5184000");
    res.setHeader("Expires", new Date(Date.now() + 5184000000).toUTCString());
  } else {
    res.setHeader("Cache-Control", "public, max-age=0");
    res.setHeader("Expires", new Date().toUTCString());
  }

  next();
};


/**
 * Expose a users ID
 * @param req
 * @param res
 * @param next
 */
middleware.exposeUid = function (req, res, next) {
  expose('uid', user.getUidByUserslug, 'userslug', req, res, next);
};


/**
 * exposes a variable to a client
 * @param exposedField
 * @param method
 * @param field
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function expose(exposedField, method, field, req, res, next) {
  if (! req.params.hasOwnProperty(field)) {
    return next();
  }
  method(req.params[ field ], function (err, id) {
    if (err) {
      return next(err);
    }

    res.locals[ exposedField ] = id;
    next();
  });
}


/**
 * Require an authentication for a route
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
middleware.requireUser = function (req, res, next) {
  if (req.user) {
    return next();
  }

  res.render('403', { title: '[[global:403.title]]' });
};

module.exports = function (app) {
  require('./authentication')(middleware);

  return middleware;
};
