var system   = require('sys');
var Browser = require("../libs/browser").Browser
var Klass = require("../libs/class").Klass;
(new Klass()).define();

var Api = Class.extend({

  init: function(opts) {
    opts = opts || {};
    this.browser = new Browser();
    this.querystring = require("querystring");
    if ((credentials = opts.credentials)) {
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

  request: function(action, query, opts, response) {
    opts = opts || {};
    if (this.version)
      query.v = this.version;
    query = this.encode(query);
    system.puts(this.path + action + "?" + query);
    var request = this.browser.get(this.path + action + "?" + query, {
      request: {
        host: opts.host || this.host
      },
      ssl: opts.ssl || false
    }, response);

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
