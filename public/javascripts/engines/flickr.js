var system   = require('sys');
var Browser = require("../libs/browser").Browser;
var Engine = require("./engine").Engine;

var Flickr = Engine.extend({
  info: {
    name: "Flickr",
    version: 1
  },

  init: function(opts) {
    this._super();
    this.browser = new Browser({});
  },

  bind: function(bot) {
    this._super(bot);
    bot.on("flickr.com/photos/(?:.*)/(\\d+)", function(message, matches, callback) {
      this.browser.flickr(matches, callback);
    });
  }
})

exports.Flickr = Flickr;