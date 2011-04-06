var system   = require('sys');
var Browser = require("../libs/browser").Browser
var Klass = require("../libs/class").Klass;
(new Klass()).define();

var Api = Class.extend({

  init: function(opts) {
    this.browser = new Browser();
    this.querystring = require("querystring");
    if (opts && (credentials = opts.credentials)) {
      this.key = credentials.key;
      this.secret = credentials.secret;
    }
  },

  encode: function(obj) {
    return this.querystring.stringify(obj);
  },

  decode: function(string) {
    return this.querystring.parse(string);
  },

  post: function(action, query, body, request_opts, response) {
    this.request("POST", action, query, body, request_opts, response);
  },

  get: function(action, query, request_opts, response) {
    this.request("GET", action, query, null, request_opts, response);
  },

  request: function(method, action, query, body, request_opts, response) {
    var opts = request_opts || {};
    if (this.version)
      query.v = this.version;
    var options = {
      request: {
        host: opts.host || this.host
      },
      ssl: opts.ssl
    };
    var path = this.path + action + "?" + this.encode(query);
    var request = (method == "GET") ? this.browser.get(path, options, response) : this.browser.post(path, body, options, response);
    if (request) request.end();
  },

  // should put these elsewhere

  template: function(string, vars) {
    for (v in vars) {
      string = string.replace(new RegExp("<%\\s?" + v + "\\s?%>", "g"), vars[v]);
    }
    return string;
  },

  merge: function(obj1, obj2) {
    for (attr in obj2) {
      obj1[attr] = obj2[attr];
    }
    return obj1;
  }

});

exports.Api = Api;
