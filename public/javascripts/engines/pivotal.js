var system   = require('sys');
var Browser = require("../libs/browser").Browser;
var Engine = require("./engine").Engine;
var PivotalApi = require("../apis/pivotal").PivotalApi;
var LibXml = require("libxmljs");

var Pivotal = Engine.extend({
  info: {
    name: "Pivotal",
    version: 1
  },

  init: function(opts) {
    this._super();
    this.api = new PivotalApi({});
    this.parser = LibXml;
  },

  bind: function(bot) {
    this._super(bot);
    bot.on("!(?:https?://www.pivotaltracker.com/story/show/)?(\\d+)", function(message, matches, callback) {
      this.browser.search(this.parser, matches, callback);
    });
  }
})

exports.Pivotal = Pivotal;