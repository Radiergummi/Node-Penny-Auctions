var nconf = require('nconf');
            require('colors');

/* global module */

module.exports = function(error, req, res, next) {
  var path = nconf.get('path'),
      stack = error.stack.toString().split(path).join(''),
      origin,
      file,
      line;

  try {
    origin = error.stack.match((new RegExp(path.replace(/\//g, '\\/') + '\/(.*)+:([0-9]+):([0-9]+)'))).slice(1);
    file = origin[0].split(path).join('') + (origin[0].indexOf('(') !== -1 ? ')' : '');
    line = origin[1];
  } catch (e) {
    origin  = error.stack.match(/at (.[^:])+:([0-9]+):([0-9]+)/).slice(1);
    file = (origin[0].indexOf('(') !== -1 ? ')' : '') + ' [from module]';
    line = origin[1];
  }

  // set status code
  var status = error.status || 500;
  res.status(status);

  // log the error to console
  console.error("\n" + error.name.bold.white);
  console.error(error.message.bgRed.white + "\n");
  console.error('Origin'.bold.white);
  console.error(file.bgRed.white + ' on line '.bgRed.white + line.bgRed.white + "\n");
  console.error('Trace'.bold.white);
  console.error(stack.red + "\n");

  // output stack trace in dev env only, render friendly error pages for clients
  if (nconf.get('environment') === 'development') {
    res.send(`
  <html lang="en">
      <head>
      <title>Exception</title>
      <meta charset="utf-8">
      <style>
      body{font-family:"Roboto","Open Sans",arial,sans-serif;font-size:1.05rem;background:#FFF;color:#333;margin:2em}
    figure{margin:0}
    h3{margin-bottom:10px}
    code{background:#D1E751;border-radius:4px;padding:2px 6px}
    pre{margin:0;background:#EAEAEA;border-radius:4px;padding:12px;white-space:pre;font-weight:normal;text-shadow:1px 1px rgba(255,255,255,.5)}
  </style>
    </head>
    <body>
    <h1>` + error.name + `</h1>
    <figure>
    <code>` + error.message + `</code>
    </figure>
    <h3>Origin</h3>
    <figure>
    <code>` + file + ` on line ` + line + `</code>
    </figure>
    <h3>Trace</h3>
    <pre>` + error.stack.replace(/</g, '&lt;').replace(/>/g, '&gt;') + `</pre>
    </body>
    </html>
    `);
  } else {
    res.render('errors/' + status, {
      error: {
        status: status,
        name: 'Internal Server Error',
        message: 'Something went wrong.'
      }
    });
  }
};
