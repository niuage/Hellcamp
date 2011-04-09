var system   = require('sys');
var Api = require("./api").Api;
var C = require("../libs/common").Common;
var Class = C.$Class;

var YoutubeApi = Class.create(Api, {

  initialize: function($super, opts) {
    $super(opts);
  },

  search: function(params, callback) {
    var query = this.encode({
      q: params[0],
      "max-results": 1,
      v: 2,
      alt: "json"
    });
    var result = this.browser.get("/feeds/api/videos?" + query, {
      request: {
        host: "gdata.youtube.com"
      }
    }, function(data) {
      res = JSON.parse(data);
      callback({
        body:  res.feed.entry[0]["media$group"]["media$player"].url
      });
    })

    result.end();
  }

});

exports.YoutubeApi = YoutubeApi;