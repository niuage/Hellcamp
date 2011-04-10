var system   = require('sys');
var Api = require("./api").Api

var FlickrApi = Api.extend({

  initialize: function(opts) {
    this._super(opts);

    this.host = "api.flickr.com";
    this.path = "/services/rest/";
  },

  add_reminder: function(params, callback) {
    this.post("", {
      
    }, "body", {
      method: "post"
    }, function(data) {
//      data = JSON.parse(data);
      callback({
        body: data
      })
    })
  }
});

exports.FlickrApi = FlickrApi;
