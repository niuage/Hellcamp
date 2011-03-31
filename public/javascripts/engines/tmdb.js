var system   = require('sys');
var Engine = require("./engine").Engine;
var TmdbApi = require("../apis/tmdb").TmdbApi;

var Tmdb = Engine.extend({
  info: {
    name: "Tmdb",
    version: 1
  },

  init: function(opts) {
    this._super();
    this.tmdb = new TmdbApi(opts.tmdb_api);
  },

  bind: function(bot) {
    this._super(bot);
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