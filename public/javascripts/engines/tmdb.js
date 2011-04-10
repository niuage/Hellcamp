var system   = require('sys');
var Engine = require("./engine").Engine;
var TmdbApi = require("../apis/tmdb").TmdbApi;
var prototype = require("prototype"); Object.extend(global, prototype);

var Tmdb = Class.create(Engine, {
  info: {
    name: "Tmdb",
    version: 1
  },

  initialize: function($super, opts) {
    $super();
    this.tmdb = new TmdbApi(opts.api);
  },

  bind: function($super, bot) {
    $super(bot);
    bot.on("/movie\\s(.*)", function(message, matches, callback) {
      this.tmdb.search(matches, callback);
    });
  },

  help: function() {
    return [
      ["/movie [movie title]", "Display the poster of the first movie, and links to the imdb page of the other results."]
    ];
  }
})

exports.Tmdb = Tmdb;