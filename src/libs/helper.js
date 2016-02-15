var Helper = module.exports = {};

Helper.escapeRegExp = function(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
};

Helper.registerHelpers = function() {
 // extendObjectPrototype();
};

function extendObjectPrototype() {
  /**
   * runs a callback on every object property
   *
   * @param {forEachCallback} callback a callback to run on the properties
   * @param {object} [thisArg]  an optional context object
   */
  Object.prototype.forEach = function(callback, thisArg) {
    var context = thisArg || global;

    for (var i in this) {
      if (this.hasOwnProperty(i) === false) continue;

      // run the callback with key and value as arguments
      callback.call(context, i, this[i]);
    }
  };

  /**
   * @callback forEachCallback
   *
   * @param {string} key    the key of the current object property
   * @param {*}      value  the value of the current object property
   */


  /**
   * returns an array containing the keys of an object
   *
   * @returns {Array}  the object's keys
   */
  Object.prototype.getKeys = function() {
    return Object.keys(this);
  };


  /**
   * returns an array containing the values of an object
   *
   * @returns {Array}  the object's values
   */
  Object.prototype.getValues = function() {
    var values = [];

    for (var key in this) {
      if (this.hasOwnProperty(key) === false) continue;

      values.push(this[key]);
    }

    return values;
  };


  /**
   * returns the nth property of an object
   *
   * @param {number} index  the index to get
   * @returns {*}           the properties value
   */
  Object.prototype.getIndex = function(index) {
    return this[Object.keys(this)[index]];
  };
}
