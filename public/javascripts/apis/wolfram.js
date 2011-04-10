var system   = require('sys');
var Api = require("./api").Api;
var LibXml = require("libxmljs");
var prototype = require("prototype");
Object.extend(global, prototype);
//var p = require("prototype")

var WolframApi = Class.create(Api, {

  initialize: function($super, opts) {
    $super(opts);

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
        images.each(function(image) {
          callback({
            body: image.attr("src").value() + ".gif"
          })
        }, this);
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

