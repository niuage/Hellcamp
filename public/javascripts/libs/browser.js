var system   = require('sys');
var http   = require('http');
var exec = require('child_process').exec
var https   = require('https');
var Klass = require("../libs/class").Klass;
(new Klass()).define();

var Browser = Class.extend({

  request: function(method, path, body, opts, callback) {
    var req = opts.request || {},
    ssl = opts.ssl || false,
    protocol = ssl ? https : http,
    headers = {
      'Host'          : req.host,
      'Content-Type'  : 'application/html'
    };
    for (header in opts.headers) {
      system.puts(header);
      headers[header] = opts.headers[header];
    }

    if (method == 'POST') {
      if (typeof(body) != 'string') {
        body = JSON.stringify(body);
      }

      headers['Content-Length'] = body.length;
    }
  
    var options = {
      host    : req.host,
      port    : req.port || (ssl ? 443 : 80),
      method  : req.method || "GET",
      path    : path,
      headers : headers
    };

    var request = protocol.request(options, function(response) {
      if (typeof(callback) == 'function') {
        var data = '';

        response.on('data', function(chunk) {
          data += chunk;
        });
        response.on('end', function() {
          system.puts("end")
          callback(data);
        });
      }
    });

    if (method == 'POST') {
      request.write(body);
    }

    request.end();
  },

  get: function(path, opts, callback) {
    this.request("GET", path, null, opts, callback);
  },

  post: function(path, body, opts, callback) {
    this.request("POST", path, body, opts, callback);
  }

})

exports.Browser = Browser;