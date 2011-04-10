var system   = require('sys');
var Engine = require("./engine").Engine;
var FlickrApi = require("../apis/flickr").FlickrApi;
var prototype = require("prototype"); Object.extend(global, prototype);

var Flickr = Class.create(Engine, {
  info: {
    name: "Flickr",
    version: 1
  },

  initialize: function($super, opts) {
    $super();
    this.flickr = new FlickrApi(opts.api);
  },

  bind: function($super, bot) {
    $super(bot);
    bot.on("flickr.com/photos/(?:.*)/(\\d+)", function(message, matches, callback) {
      this.flickr.search(matches, callback);
    });
  },

  help: function() {
    return [
      ["[url of a flickr photo]", "Post the photo in Campfire."]
    ];
  }
})

exports.Flickr = Flickr;