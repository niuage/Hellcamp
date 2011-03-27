var system   = require('sys');
var Api = require("./api").Api

var FlickrApi = Api.extend({

  init: function(opts) {
    this._super(opts);

    this.host = "api.flickr.com";
    this.path = "/services/rest/";
  },

  search: function(params, callback) {
    this.request("", {
      method: "flickr.photos.getInfo",
      api_key: this.key,
      format: "json",
      photo_id: params[0]
    }, null, function(data) {
      var jsonFlickrApi = function(data) {
        var photo = data.photo;
        callback({
          body: "http://farm1.static.flickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + ".jpg"
        })
      }
      eval( "(" + data + ")" );
    })
  }
});

exports.FlickrApi = FlickrApi;
