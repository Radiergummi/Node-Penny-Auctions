/*
 global module,
 require
 */

var winston = require('winston'),
    sass = require('node-sass'),
    cleanCss = require('clean-css'),
    path = require('path'),
    fs = require('fs'),
    nconf = require('nconf'),
    rimraf = require('rimraf'),
    mkdirp = require('mkdirp'),
    prependFile = require('prepend-file'),
    moment = require('moment');

var SCSS = module.exports = {};

var basePath = nconf.get('path'),
    sassPath = path.join(basePath, nconf.get('assets').sass),
    cssPath = path.join(basePath, nconf.get('assets').css);

SCSS.compile = function () {
  winston.info('[libs/stylesheets]'.white + ' Compiling SASS');
  var files = fs.readdirSync(sassPath);

  // recreate css folder
  rimraf.sync(cssPath);
  mkdirp.sync(cssPath);

  // filter scss files
  files = files.filter(function (filename) {
    var extension = filename.slice(- 5);
    return (extension === '.scss' || extension === '.sass');
  });

  for (var file in files) {
    // Foo. To make my IDE happy.
    if (files.hasOwnProperty(file) === false) continue;

    var filename = path.join(sassPath, files[ file ]),
        basePath = path.join(cssPath, files[ file ].substring(0, files[ file ].length - 5)),
        outputPath = basePath + '.css',
        sourceMapPath = basePath + '.css.map',
        result = sass.renderSync({
          file:              filename,
          indentedSyntax:    false,
          indentType:        'space',
          indentWidth:       2,
          linefeed:          'lf',
          omitSourceMapUrl:  false,
          outFile:           outputPath,
          outputStyle:       'nested',
          precision:         3,
          sourceComments:    (nconf.get('environment') === 'development'),
          sourceMap:         true,
          sourceMapContents: true,
          sourceMapEmbed:    false,
          sourceMapRoot:     '/stylesheets'
        });

    // write compiled css file
    fs.writeFileSync(outputPath, result.css);

    // write source map file
    fs.writeFileSync(sourceMapPath, result.map);


    // add debug data and statistics in dev mode
    if (nconf.get('environment') === 'development') {
      var debugHeader = "/*\n Compiled at " + moment().format() + "\n";
      debugHeader += JSON.stringify(result.stats, null, 2) + "\n*/\n\n";
      prependFile.sync(outputPath, debugHeader);
    }
  }

  winston.info('[libs/stylesheets]'.white + ' Successfully compiled SCSS files');
  return this;
};

SCSS.minify = function () {
  winston.info('[libs/stylesheets]'.white + ' Minifying CSS');
  var files = fs.readdirSync(cssPath);

  // filter scss files
  files = files.filter(function (filename) {
    // skip minified files
    if (filename.indexOf('.min.') !== - 1) return false;

    // only return css files
    return (filename.slice(- 4) === '.css');
  });

  for (var file in files) {
    // Foo. To make my IDE happy.
    if (files.hasOwnProperty(file) === false) continue;

    var filename = path.join(cssPath, files[ file ]),
        basePath = path.join(cssPath, files[ file ].substring(0, files[ file ].length - 4)),
        outputPath = basePath + '.min.css',
        sourceMapPath = basePath + '.css.map',
        result = new cleanCss({
          advance:                true,
          aggressiveMerging:      false,
          benchmark:              false,
          compatibility:          'ie8',
          debug:                  (nconf.get('environment') === 'development'),
          keepBreaks:             false,
          keepSpecialComments:    '*',
          mediaMerging:           true,
          processImport:          true,
          processImportFrom:      [ 'local' ],
          rebase:                 true,
          restructuring:          true,
          // relativeTo: '/', // path to rebase relative links to
          // root: '/', // path to rebase absolute links to
          target:                 cssPath, // path to a folder or an output file to which rebase
                                           // all URLs
          roundingPrecision:      3,
          semanticMerging:        false,
          shorthandCompacting:    true,
          sourceMap:              fs.readFileSync(basePath + '.css.map').toString(),
          sourceMapInlineSources: true
        }).minify(fs.readFileSync(filename));

    // write minifed css file
    fs.writeFileSync(outputPath, result.styles);

    // write source map file
    fs.writeFileSync(sourceMapPath, result.sourceMap);

    // add debug data and statistics in dev mode
    if (nconf.get('environment') === 'development') {
      var debugHeader = "/*\n Minified at " + moment().format() + "\n";
      debugHeader += JSON.stringify(result.stats, null, 2) + "\n*/\n\n";
      prependFile.sync(outputPath, debugHeader);
    }
  }

  winston.info('[libs/stylesheets]'.white + ' Successfully minified CSS files');
  return this;
};
