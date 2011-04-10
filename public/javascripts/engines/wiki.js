var system   = require('sys');
var Engine = require("./engine").Engine;
var WikiApi = require("../apis/wiki").WikiApi;
var prototype = require("prototype"); Object.extend(global, prototype);

var Wiki = Class.create(Engine, {
  info: {
    name: "Wiki",
    version: 1
  },

  initialize: function($super, opts) {
    $super();
    this.wiki = new WikiApi();
  },

  bind: function($super, bot) {
    $super(bot);
    bot.on("/wiki\\s(.*)", function(message, matches, callback) {
      this.wiki.search(matches, callback);
    });
  }
})

exports.Wiki = Wiki;