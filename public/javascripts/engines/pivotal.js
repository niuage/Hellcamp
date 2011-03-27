var system   = require('sys');
var Browser = require("../libs/browser").Browser;
var Engine = require("./engine").Engine;
var PivotalApi = require("../apis/pivotal").PivotalApi;

var Pivotal = Engine.extend({
  info: {
    name: "Pivotal",
    version: 1
  },

  init: function(opts) {
    this._super();
    this.pivotal = new PivotalApi({});
  },

  bind: function(bot) {
    this._super(bot);
    bot.on("!(?:https?://www.pivotaltracker.com/story/show/)?(\\d+)", function(message, matches, callback) {
      this.pivotal.search(matches, callback);
    });
  }
})

exports.Pivotal = Pivotal;