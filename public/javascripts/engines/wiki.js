var system   = require('sys');
var Engine = require("./engine").Engine;
var WikiApi = require("../apis/wiki").WikiApi;

var Wiki = Engine.extend({
  info: {
    name: "Wiki",
    version: 1
  },

  init: function(opts) {
    this._super();
    this.wiki = new WikiApi();
  },

  bind: function(bot) {
    this._super(bot);
    bot.on("/wiki\\s(.*)", function(message, matches, callback) {
      this.wiki.search(matches, callback);
    });
  }
})

exports.Wiki = Wiki;