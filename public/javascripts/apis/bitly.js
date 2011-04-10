var system   = require('sys');
var Api = require("./api").Api;
var prototype = require("prototype"); Object.extend(global, prototype);

var BitlyApi = Class.create(Api, {

  initialize: function($super, opts) {
    $super(opts);

    this.host = "api.bitly.com";
    this.path = "/v3/";
  },

  shorten: function(params, callback) {
    this.get("shorten", this.merge(this.options(), {
      longUrl: params[0]
    }), null, function(data) {
      data = JSON.parse(data);
      callback({
        body: data.data.url
      })
    })
  },

  options: function() {
    var self = this;
    return {
      format: "json",
      login: self.secret,
      "apiKey": self.key
    }
  }
});

exports.BitlyApi = BitlyApi;
