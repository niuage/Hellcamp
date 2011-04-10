var system   = require('sys');
var Api = require("./api").Api;
var C = require("../libs/common").Common;
var Class = C.$Class;

var DribbbleApi = Class.create(Api, {

  initialize: function($super, opts) {
    $super(opts);

    this.host = "api.dribbble.com";
    this.path = "/shots/";
  },

  search: function(params, callback) {
    this.get(params[0], {
      }, null, function(data) {
        data = JSON.parse(data);
        system.puts(JSON.stringify(data));
        callback({
          body: data.image_url
        })
      })
  }
});

exports.DribbbleApi = DribbbleApi;
