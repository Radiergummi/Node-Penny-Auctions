var nconf       = require('nconf'),
    fs          = require('fs'),
    path        = require('path'),
    moment      = require('moment'),
    uglifyJs    = require('uglify-js'),
    winston     = require('winston'),
    prependFile = require('prepend-file');

var Javascripts = module.exports = {};

var basePath  = nconf.get('path'),
    jsPath    = path.join(basePath, nconf.get('assets').js),
    debugMode = (nconf.get('environment') === 'development'),
    concatenationFileList = [];

function getFiles(directory) {
  directory = (typeof directory === 'undefined' ? '' : directory + '/');
  var filePath = jsPath + '/' + directory,
      files = fs.readdirSync(filePath),
      fileList = [];

  for (var i in files) {
    if (fs.lstatSync(path.join(filePath, files[i])).isDirectory()) {
      var filesInFolder = getFiles(files[i]);
      fileList = fileList.concat(filesInFolder);
    } else {
      fileList.push(directory + files[i]);
    }
  }
  return fileList;
}

Javascripts.concatenate = function() {
  winston.info('[libs/javascripts]'.white + ' Concatenating JS');
  var files   = getFiles(),
      content = '';

  // filter js files
  files = files.filter(function(filename) {
    // skip minified files
    //if (filename.indexOf('.min.') !== -1) return false;
    if (filename === nconf.get('assets:options:mainJSFile')) return false;



    return (filename.slice(-3) === '.js');
  });

  for (var file in files) {
    // Foo. To make my IDE happy.
    if (files.hasOwnProperty(file) === false) continue;
    var filename = path.join(jsPath, files[file]);
    if (debugMode) {
      content += "/**\n * Concatenated at " + moment().format() + ".\n * Source file: " + filename + "\n*/\n";
    }

    content += fs.readFileSync(filename).toString() + "\n";
  }

  fs.writeFileSync(path.join(jsPath, nconf.get('assets:options:mainJSFile')), content);

  winston.info('[libs/javascripts]'.white + ' Successfully concatenated JS files');
  return this;
};

Javascripts.minify = function() {
  winston.info('[libs/javascripts]'.white + ' Minifying JS');
  var files = fs.readdirSync(jsPath);

  // filter js files
  files = files.filter(function(filename) {
    // skip minified files
    // if (filename.indexOf('.min.') !== -1) return false;

    // only return js files
    return (filename.slice(-3) === '.js');
  });

  for (var file in files) {
    // Foo. To make my IDE happy.
    if (files.hasOwnProperty(file) === false) continue;

    var filename      = path.join(jsPath, files[file]),
        basename      = files[file].substring(0, files[file].length - 3),
        basePath      = path.join(nconf.get('path'), 'public', 'js', basename),
        outputPath    = basePath + '.min.js',
        sourceMapUrl  = '/js/' + basename + '.js.map',
        result        = uglifyJs.minify(filename, {
          outSourceMap: sourceMapUrl,
          sourceRoot  : '/javascripts',
          sourceMapRoot: '/javascripts/',
          warnings    : debugMode,
          mangle      : true,
          fromString  : false,
          output      : {
            indent_start : 0,          // start indentation on every line (only when `beautify`)
            indent_level : 2,          // indentation level (only when `beautify`)
            quote_keys   : false,      // quote all keys in object literals?
            space_colon  : false,      // add a space after colon signs?
            ascii_only   : true,       // output ASCII-safe? (encodes Unicode characters as ASCII)
            inline_script: true,       // escape "</script"?
            width        : 80,         // informative maximum line width (for beautified output)
            max_line_len : 32000,      // maximum line length (for non-beautified output)
            screw_ie8    : false,      // output IE-safe code?
            beautify     : debugMode,  // beautify output?
            bracketize   : false,      // use brackets every time?
            comments     : debugMode,  // output comments? (boolean, regExp, function)
            semicolons   : true        // use semicolons to separate statements? (otherwise, newlines)
          },
          compress       : {
            sequences    : true,
            properties   : true,   // optimize property access: a["foo"] → a.foo
            dead_code    : true,   // discard unreachable code
            drop_debugger: true,   // discard “debugger” statements
            unsafe       : false,  // some unsafe optimizations (see below)
            conditionals : true,   // optimize if-s and conditional expressions
            comparisons  : true,   // optimize comparisons
            evaluate     : true,   // evaluate constant expressions
            booleans     : true,   // optimize boolean expressions
            loops        : true,   // optimize loops
            unused       : true,   // drop unused variables/functions
            hoist_funs   : true,   // hoist function declarations
            hoist_vars   : false,  // hoist variable declarations
            if_return    : true,   // optimize if-s followed by return/continue
            join_vars    : true,   // join var declarations
            cascade      : true,   // try to cascade `right` into `left` in sequences
            side_effects : true,   // drop side-effect-free statements
            warnings     : true,   // warn about potentially dangerous optimizations/code
            global_defs  : {}      // global definitions
          }
        });

    // write minifed css file
    fs.writeFileSync(outputPath, result.code);

    // add debug data and statistics in dev mode
    if (debugMode) {
      // write source map file
      fs.writeFileSync(basePath + '.js.map', result.map);

      prependFile.sync(outputPath, "/**\n * Minified at " + moment().format() + "\n */\n");
    }
  }

  winston.info('[libs/javascripts]'.white + ' Successfully minifed JS files');
  return this;
};
