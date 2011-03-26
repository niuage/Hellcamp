var system   = require('sys');
var Browser = require("../libs/browser").Browser;
var Engine = require("./engine").Engine;
var LibXml = require("libxmljs");

var Pivotal = Engine.extend({
  info: {
    name: "Pivotal",
    version: 1
  },

  init: function(opts) {
    this._super();
    this.browser = new Browser({});
    this.parser = LibXml;
  },

  bind: function(bot) {
    this._super(bot);
    bot.on("!(?:https?://www.pivotaltracker.com/story/show/)?(\\d+)", function(message, matches, callback) {
      this.browser.get_story(this.parser, matches, callback);
    });
  }
})

exports.Pivotal = Pivotal;