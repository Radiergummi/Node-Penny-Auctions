/*
 global module,
 require
 */

'use strict';

var os = require("os");

var System = module.exports = {};

/**
 * returns the current CPU usage in percent
 *
 * @returns {number}
 */
System.cpuUsage = function () {
  var cpus = os.cpus(),
      usage = {},
      type,
      i;

  for (i = 0; i < cpus.length; i++) {
    var cpu = cpus[ i ], total = 0;
    for (type in cpu.times) {
      if (cpu.times.hasOwnProperty(type)) {
        total += cpu.times[ type ];

        for (type in cpu.times) {
          if (cpu.times.hasOwnProperty(type)) {
            usage[ type ] = 100 * cpu.times[ type ] / total;
          }
        }
      }
    }
  }

  return 100 - usage.idle.toFixed(2);
};

System.memoryUsage = function() {
  var total = Math.round(os.totalmem() / 1000000),
      free = Math.round(os.freemem() / 1000000);

  return (parseFloat(1 - (free / total)) * 100).toFixed(2);
};
