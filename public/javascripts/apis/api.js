var system   = require('sys');
var Browser = require("../libs/browser").Browser
var Klass = require("../libs/class").Klass;
(new Klass()).define();

var Api = Class.extend({

  init: function(opts) {
    this.browser = new Browser();
    this.key = opts.key;
    this.secret = opts.secret;
  },

  search: function() {
    
  }

});

exports.Api = Api;
