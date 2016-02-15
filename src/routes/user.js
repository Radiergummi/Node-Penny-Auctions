var helper = require('./helper'),
    setupPageRoute = helper.setupPageRoute;

module.exports = function(router, middleware, controllers) {
  setupPageRoute(router, '/user/:username', middleware, [middleware.isLoggedIn], controllers.getUserPage);
  setupPageRoute(router, '/user/:username/settings', middleware, [middleware.isLoggedIn], controllers.getUserSettingsPage);

  router.post(
    '/user/:username/edit',
    [
      middleware.isLoggedIn,
      middleware.uploadProfileImage,
      middleware.storeProfileImage
    ],
    controllers.editUserProfile
  );

  router.post('/user/:username/settings/edit', [ middleware.isLoggedIn ], controllers.editSettings);
};
