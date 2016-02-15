'use strict';

var nconf = require('nconf'),
    async = require('async'),
    validator = require('validator');

var helpers = {};

helpers.notAllowed = function(req, res, error) {
  if (req.uid) {
    if (res.locals.isAPI) {
      res.status(403).json({
        path: req.path.replace(/^\/api/, ''),
        loggedIn: !!req.uid, error: error,
        title: '[[global:403.title]]'
      });
    } else {
      res.status(403).render('403', {
        path: req.path,
        loggedIn: !!req.uid, error: error,
        title: '[[global:403.title]]'
      });
    }
  } else {
    if (res.locals.isAPI) {
      req.session.returnTo = req.url.replace(/^\/api/, '');
      res.status(401).json('not-authorized');
    } else {
      req.session.returnTo = req.url;
      res.redirect('/login');
    }
  }
};

helpers.redirect = function(res, url) {
  if (res.locals.isAPI) {
    res.status(308).json(url);
  } else {
    res.redirect(url);
  }
};

helpers.buildBreadcrumbs = function(crumbs) {
  var breadcrumbs = [
    {
      text: '[[global:home]]',
      url: '/'
    }
  ];

  crumbs.forEach(function(crumb) {
    if (crumb) {
      breadcrumbs.push(crumb);
    }
  });

  return breadcrumbs;
};

helpers.buildTitle = function(pageTitle) {
  var titleLayout = '{pageTitle} | {browserTitle}';

  var browserTitle = validator.escape(nconf.get('appname') || 'Golden Deals');
  pageTitle = pageTitle || '';
  var title = titleLayout.replace('{pageTitle}', pageTitle).replace('{browserTitle}', browserTitle);
  return title;
};

module.exports = helpers;
