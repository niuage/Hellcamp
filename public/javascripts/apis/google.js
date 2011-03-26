var system   = require('sys');
var Api = require("./api").Api

var GoogleApi = Api.extend({

  init: function(opts) {
    this._super(opts);
  },

  search: function(params, callback) {
    system.puts("call google search");
    var result = this.browser.get("/ajax/services/search/images?v=1.0&q=" + params[0].split(" ").join("+"), {
      request: {
        host    : "ajax.googleapis.com"
      },
      ssl: true
    }, function(data) {
      if ((data = ( eval('('+ data + ")")) ) && data.responseData && (res = data.responseData.results) && res.length > 0) {
        system.puts(res.length);
        var pos = res.length;
        pos = Math.floor(Math.random() * (pos > 4 ? 4 : pos));
        callback({
          body: res[pos].unescapedUrl
        });
      } else {
        callback({
          body: "No images found for '" + params[0] + "'"
        });
      }
    })

    result.end();
  }

});

exports.GoogleApi = GoogleApi;
