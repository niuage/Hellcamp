var system   = require('sys');
var Api = require("./api").Api

var YoutubeApi = Api.extend({

  init: function() {

  },

  search: function(params, callback) {
    var result = this.get("/feeds/api/videos?q=" + params[0].split(" ").join("+") +"&max-results=2&v=2&alt=json", {
      request: {
        host: "gdata.youtube.com"
      }
    }, function(data) {
      system.puts("youtube result");
      res = eval( "(" + data + ")" );
      callback({
        body:  res.feed.entry[0]["media$group"]["media$player"].url
      });
    })

    result.end();
  }

});

exports.YoutubeApi = YoutubeApi;