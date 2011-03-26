var system   = require('sys');
var Api = require("./api").Api

var FlickrApi = Api.extend({

  init: function(opts) {
    this._super(opts)
  },

  search: function(params, callback) {
    this.browser.get("/services/rest/?method=flickr.photos.getInfo&api_key=2bc972efba6309fe9376d55482ab32bb&secret=dfee6bcf0b5c41bb&format=json&photo_id=" + params[0], {
      request: {
        host: "api.flickr.com"
      }
    }, function(data) {
      var jsonFlickrApi = function(data) {
        res = eval( "(" + data + ")" ).photo;
        callback({
          body: "http://farm1.static.flickr.com/" + res.server + "/" + res.id + "_" + res.secret + ".jpg"
        })
      }
    })
  }

});

exports.FlickrApi = FlickrApi;
