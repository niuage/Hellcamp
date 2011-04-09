var system   = require('sys');
var Engine = require("./engine").Engine;
var BitlyApi = require("../apis/bitly").BitlyApi;
var C = require("../libs/common").Common;
var Class = C.$Class;

var Bitly = Class.create(Engine, {
  info: {
    name: "Bitly",
    version: 1
  },

  initialize: function($super, opts) {
    $super();
    this.bitly = new BitlyApi(opts.bitly_api);
  },

  bind: function($super, bot) {
    $super(bot);
    bot.on("!([^\\s]*)", function(message, matches, callback) {
      if (this.is_valid(matches[0])) {
        this.bitly.shorten(matches, callback);
      }
    });
  },

  is_valid: function(s) {
    return (/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/).test(s);
  },

  help: function() {
    return [
      ["![long_url]", "Shorten long_url using bit.ly"]
    ];
  }
})

exports.Bitly = Bitly;