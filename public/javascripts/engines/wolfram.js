var system   = require('sys');
var Engine = require("./engine").Engine;
var WolframApi = require("../apis/wolfram").WolframApi;

var Wolfram = Engine.extend({
  info: {
    name: "Wolfram",
    version: 1
  },

  init: function(opts) {
    this._super();
    this.wolfram = new WolframApi(opts.wolfram_api);
  },

  bind: function(bot) {
    this._super(bot);
    bot.on("/(?:ask|\\?)\\s(.*)", function(message, matches, callback) {
      this.wolfram.simple_answer(matches, callback);
    });
  },

  help: function() {
    return [
      ["/ask [query]", "Give a simple answer to a question."]
    ];
  }
})

exports.Wolfram = Wolfram;