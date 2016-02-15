var nconf = require('nconf'),
    fs = require('fs'),
    rimraf = require('rimraf'),
    mkdirp = require('mkdirp'),
    winston = require('winston'),
    path = require('path'),
    tjs = require('templates.js');

var Templates = module.exports = {};

Templates.compile = function(callback) {
  callback = callback || function() {};

  var templatesPath = path.join(nconf.get('path'), 'public/templates'), // path to templates
      viewsPath = path.join(nconf.get('path'), 'src/views'), // path to views
      templates = fs.readdirSync(viewsPath); // array of files

  winston.log('info', '[libs/templates]'.white + ' Compiling templates');

  // purge compiled templates
  rimraf.sync(templatesPath);
  mkdirp.sync(templatesPath);

  for (var i in templates) {
    // Foo. To make my IDE happy.
    if (templates.hasOwnProperty(i) === false) continue;

    if (fs.lstatSync(path.join(viewsPath, templates[i])).isDirectory()) {
      walkTemplateFolder(templates[i], templatesPath, viewsPath);
    } else {
      importPartials(templates[i], templatesPath, viewsPath);
    }
  }

  winston.info('[libs/templates]'.white + ' Successfully compiled templates')
};

function walkTemplateFolder(templateFolder, templatesPath, viewsPath) {
  // create folder in templates path
  mkdirp.sync(path.join(templatesPath, templateFolder));

  var directory = fs.readdirSync(path.join(viewsPath, templateFolder));
  for (var file in directory) {
    // Foo. To make my IDE happy.
    if (directory.hasOwnProperty(file) === false) continue;

    var filePath = path.join(viewsPath, templateFolder, directory[file]);

    if (fs.lstatSync(filePath).isDirectory()) {
      walkTemplateFolder(directory[file], path.join(templatesPath, templateFolder), path.join(viewsPath, templateFolder))
    } else {
      importPartials(filePath.replace(viewsPath + '/', ''), templatesPath, viewsPath);
    }
  }
}

function importPartials(template, templatesPath, viewsPath) {
  var file    = fs.readFileSync(path.join(viewsPath, template)).toString(),
      matches = null,
      regex   = /[ \t]*<!-- IMPORT ([\s\S]*?)? -->[ \t]*/;

  while ((matches = file.match(regex)) !== null) {
    var partial = path.join(viewsPath, matches[1]);

    try {
      file = file.replace(regex, fs.readFileSync(partial).toString());
    } catch (fileSystemError) {
      winston.warn('[libs/templates]'.white + ' Partial not loaded: ' + matches[1]);
      file = file.replace(regex, '');
    }
  }

  fs.writeFileSync(path.join(templatesPath, template), file);
}
