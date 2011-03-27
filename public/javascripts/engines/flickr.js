var system   = require('sys');
var Engine = require("./engine").Engine;
var FlickrApi = require("../apis/flickr").FlickrApi;

var Flickr = Engine.extend({
  info: {
    name: "Flickr",
    version: 1
  },

  init: function(opts) {
    this._super();
    this.flickr = new FlickrApi(opts.flickr_api);
  },

  bind: function(bot) {
    this._super(bot);
    bot.on("flickr.com/photos/(?:.*)/(\\d+)", function(message, matches, callback) {
      this.flickr.search(matches, callback);
    });
  }
})

exports.Flickr = Flickr;