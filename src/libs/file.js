/*
 global module,
 require
 */

var fs = require('fs'),
    path = require('path'),
    nconf = require('nconf');

function resolvePath(file) {
  var basepath = nconf.get('path');

  // append path if not present
  if (file.indexOf(basepath) === - 1) {
    file = path.resolve(path.join(basepath, file));
  }

  return file;
}

/**
 * the file class - basic abstraction layer for filesystem actions
 *
 */
var File = module.exports = {};


/**
 * reads a file relative to the path
 *
 * @param {string} file        the path to the file
 * @param {function} callback  a callback to execute once the file is read
 */
File.read = function (file, callback) {
  file = resolvePath(file);

  try {
    fs.readFile(file, function (error, data) {
      if (error) {
        return callback(error);
      }

      return callback(null, data);
    });
  }
  catch (error) {
    return callback(error);
  }
};


/**
 * reads a file relative to the path synchronously
 *
 * @param {string} file  the path to the file
 * @returns {Buffer}     the files content
 */
File.readSync = function (file) {
  file = resolvePath(file);

  var content;
  try {
    content = fs.readFileSync(file);
  }
  catch (error) {
    throw error;
  }

  return content
};


/**
 * writes a string or buffer to file
 *
 * @param {string} file            the path to the file
 * @param {string|Buffer} data     the data to write to the file, either a string or a buffer
 * @param {function} callback      a callback to execute once the file is written
 * @param {object|string} options  options for the writeFile function or the encoding string
 */
File.write = function (file, data, callback, options) {
  options = options || {};
  file = resolvePath(file);

  try {
    fs.writeFile(file, data, options, function (error, data) {
      if (error) {
        throw error;
      }

      return callback(data);
    });
  }
  catch (error) {
    throw error;
  }
};


/**
 * writes a string or buffer to file synchronously
 *
 * @param {string} file            the path to the file
 * @param {string|Buffer} data     the data to write to the file, either a string or a buffer
 * @param {object|string} options  options for the writeFile function or the encoding string
 */
File.writeSync = function (file, data, options) {
  options = options || {};
  file = resolvePath(file);

  try {
    fs.writeFileSync(file, data, options);
  }
  catch (error) {
    throw error;
  }
};


/**
 * removes a file
 *
 * @param {string} file        the path to the file
 * @param {function} callback  a callback to execute once the file is removed
 */
File.remove = function (file, callback) {
  file = resolvePath(file);

  try {
    fs.unlink(file, function (error) {
      if (error) {
        throw error;
      }

      return callback();
    });
  }
  catch (error) {
    throw error;
  }
};


/**
 * removes a file synchronously
 *
 * @param {string} file  the path to the file
 * @returns {undefined}
 */
File.removeSync = function (file) {
  file = resolvePath(file);

  try {
    fs.unlinkSync(file);
  }
  catch (error) {
    throw error;
  }
};


/**
 * checks whether a file exists or not
 *
 * @param {string} file  the path to the file
 * @param {fileExistsCallback} callback  a callback to execute once the file
 */
File.exists = function (file, callback) {
  file = resolvePath(file);

  fs.access(file, fs.F_OK, function (error) {
    if (error) {
      callback(false);
    } else {
      callback(true);
    }
  });
};

/**
 * @callback fileExistsCallback
 *
 * @param {bool} exists
 */


/**
 * checks synchronously whether a file exists or not
 *
 * @param {string} file  the path to the file
 * @return {boolean}     whether the file exists or not
 */
File.existsSync = function (file) {
  file = resolvePath(file);

  try {
    fs.accessSync(file, fs.F_OK);
    return true;
  }
  catch (error) {
    return false;
  }
};


/**
 * check whether a file is a directory or not
 *
 * @param {string} file                   the path to the file
 * @param {isDirectoryCallback} callback  a callback to execute after the check
 */
File.isDirectory = function (file, callback) {
  file = resolvePath(file);

  try {
    fs.lstat(file, function (error, stats) {
      if (error) {
        throw error;
      }

      callback(stats.isDirectory());
    });
  }
  catch (error) {
    throw error;
  }
};

/**
 * @callback isDirectoryCallback
 *
 * @param {boolean}  whether the file is a directory
 */


/**
 * check synchronously whether a file is a directory or not
 *
 * @param {string} file  the path to the file
 * @returns {boolean}    whether the file is a directory
 */
File.isDirectorySync = function (file) {
  file = resolvePath(file);

  try {
    fs.lstat(file, function (error, stats) {
      if (error) {
        throw error;
      }

      return stats.isDirectory();
    });
  }
  catch (error) {
    throw error;
  }
};


/**
 * watches for file changes
 *
 * @param {string} file                   the path to the file
 * @param {object|function} [options]     an optional options object for the watch method
 * @param {object} [options.persistent]   keeps the process running unless the file is no longer
 *     watched
 * @param {object} [options.recursive]    watches the given directory recursively (only Windows and
 *     OS X)
 *
 * @param {watchFileCallback} [listener]  an optional callback to apply when the file is changed
 */
File.watch = function (file, options, listener) {
  var watchOptions = options || {};

  if (typeof options === 'function') {
    watchOptions = {};
    listener = options;
  }

  file = resolvePath(file);

  try {
    fs.watch(file, options, listener);
  }
  catch (error) {
    throw error;
  }
};

/**
 * @callback watchFileCallback
 *
 * @param {string} event  the event which happened to the file: either "rename" or "change"
 * @param {string} file   the path to the file
 */


/**
 * walks over a directory and returns a list of files
 *
 * @param {string} directory
 * @param {recursiveDirectoryCallback} callback
 */
File.readDirectoryRecursively = function (directory, callback) {
  directory = resolvePath(directory);

  var results = [];
  fs.readdir(directory, function (error, list) {
    if (error) return callback(error);

    var i = 0;
    (function next() {
      var file = list[ i ++ ];

      if (! file) {
        return callback(null, results);
      }

      file = directory + '/' + file;
      fs.stat(file, function (error, stat) {
        if (error) return callback(error, null);

        if (stat && stat.isDirectory()) {
          File.readDirectoryRecursively(file, function (error, res) {
            if (error) return callback(error, null);

            results = results.concat(res);
            next();
          });
        } else {
          results.push(file);
          next();
        }
      });
    })();
  });
};

/**
 * @callback recursiveDirectoryCallback
 *
 * @param {Error|null} error           an eventual error
 * @param {Array|object|null} results  the results of the directory search
 */


/**
 * checks when a file was last modified
 * @param {string} file                    the path to the file
 * @param {lastModifiedCallback} callback  a callback to run once the date has been determined
 */
File.lastModified = function (file, callback) {
  file = resolvePath(file);

  try {
    fs.lstat(file, function (error, stats) {
      if (error) {
        throw error;
      }

      callback(stats.mtime);
    });
  }
  catch (error) {
    throw error;
  }
};

/**
 * @callback lastModifiedCallback
 *
 * @param {Date} date  the last modified time as a date object
 */


/**
 *
 * @param {string} file  the path to the file
 * @returns {Date}       the last modified time as a date object
 */
File.lastModifiedSync = function (file) {
  file = resolvePath(file);

  try {
    return fs.lstatSync(file).mtime;
  }
  catch (error) {
    throw error;
  }
};
