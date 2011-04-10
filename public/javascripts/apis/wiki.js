var system   = require('sys');
var Api = require("./api").Api;
var prototype = require("prototype"); Object.extend(global, prototype);

var WikiApi = Class.create(Api, {

  initialize: function($super, opts) {
    $super(opts);

    this.host = "en.wikipedia.org";
    this.path = "/w/api.php";
  },

  // http://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=six%20feet%20under&srprop=snippet&format=json

  search: function(params, callback) {
    this.get("", this.merge(this.options, {
      list: "search",
      srsearch:params[0],
      srprop:"snippet"
    }), null, function(data) {
      data = JSON.parse(data);
      results = data.query.search;
      callback({
        body: results[0].title + " | " + results[0].snippet + " http://en.wikipedia.org/wiki/" + results[0].title.replace(new RegExp("\\s", "g"), "_")
      })
    })
  },

  options: {
    action: "query",
    format: "json"
  }
});

exports.WikiApi = WikiApi;
