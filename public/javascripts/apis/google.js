var system   = require('sys');
var Api = require("./api").Api

var GoogleApi = Api.extend({

  init: function(opts) {
    opts = opts || {};
    this._super(opts);
    
    this.version  = "1.0";
    this.host     = opts.host ||    "ajax.googleapis.com";
    this.path     = opts.path ||    "/ajax/services/";
  },

  search: function(params, callback) {

    this.request("search/images", {
      q: params[0]
    },
    { ssl: true },
    function(data) {
      if ((data = ( JSON.parse(data)) ) && data.responseData && (res = data.responseData.results) && res.length > 0) {
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
    });
  },

  translate: function(params, callback) {
    system.puts("translate");
    var p = {
      from: "",
      to: "fr",
      query: params[0]
    }
    if (params.length == 2) {
      p.query = params[1];
      if (params[0]) {
        var langpair = params[0].split(":");
        system.puts(langpair);
        if (langpair.length == 2) {
          p.from = langpair[0];
          p.to = langpair[1];
        } else {
          p.to = langpair[0];
        }
      }
    }
    this.request("language/translate", {
      q: p.query,
      langpair: p.from + "|" + p.to,
      format: "text"
    },
    { ssl: true },
    function(data) {
      system.puts("victoire!");
      system.puts(data);
      if ((data = JSON.parse(data)) && (res = data.responseData)) {
        callback({
          body: res.translatedText
        })
      }
    })
  }

});

exports.GoogleApi = GoogleApi;
