var system   = require('sys');
var Api = require("./api").Api;
var LibXml = require("libxmljs");

var WolframApi = Api.extend({

  init: function(opts) {
    this._super(opts);

    this.host = "api.wolframalpha.com";
    this.path = "/v2/";
    this.parser = LibXml;
  },

  simple_answer: function(params, callback) {
    var self = this;
    this.get("query", {
      input: params[0],
      appid: this.key
    }, null, function(data) {
      system.puts(data);
      data =  self.parser.parseXmlString(data);
      var images = data.find("//img");
      if (images) {
        for (i in images) {
          var image = images[i];
          callback({
            body: image.attr("src").value() + ".gif"
          })
        }
      } else {
        var future_topics = data.find("//futuretopic");
        for (f in future_topics) {
          var topic = future_topics[f];
          callback({
            body: topic.attr("topic").value() + ": " + topic.attr("msg").value()
          })
        }
      }
      
    })
  }
});

exports.WolframApi = WolframApi;
