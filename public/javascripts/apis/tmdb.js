var system   = require('sys');
var Api = require("./api").Api

var TmdbApi = Api.extend({

  init: function(opts) {
    this._super(opts);

    this.host = "api.themoviedb.org";
    this.path = "/2.1/";
    this.query = "<%method%>/<%lang%>/<%format%>/<%key%>/<%params%>";
    this.imdb_url = "http://www.imdb.com/title/";
    this.movie_template = "<%name%>(<%year%>) <%imdb%>";
  },

  search: function(params, callback) {
    var movie = params[0];
    var self = this;
    var action = this.template(this.query, {
      method: "Movie.search",
      lang: "en",
      format: "json",
      key: this.key,
      params: this.querystring.escape(movie)
    })
    this.request(action, "", null, function(data) {
      var movies = JSON.parse(data);

      if (self.found_movies(movies, callback)) {
        self.movies_summary(movies, callback);
      }
    })
  },

  movies_summary: function(movies, callback) {
    var movies_summary = [];
      
    for (movie  in movies) {
      var m = movies[movie];
      if (movie == 0 && m.posters && m.posters[0]) {
        callback({
          body: m.posters[0].image.url
        })
      }
      movies_summary.push(this.template(this.movie_template, {
        name: m.name,
        year: m.released ? m.released.replace(/-\d{2}-\d{2}/, "") : "N/A",
        imdb: this.imdb_url + m.imdb_id
      }))
    }
    callback({
      body: movies_summary.join(" | ")
    })
  },

  found_movies: function(movies, callback) {
    if (movies && typeof(movies[0]) == "string") {
      callback({
        body: movies[0]
      })
      return false;
    } else
      return true;
  }
});

exports.TmdbApi = TmdbApi;
