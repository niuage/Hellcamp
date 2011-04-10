var system   = require('sys');
var Engine = require("./engine").Engine;
var WolframApi = require("../apis/wolfram").WolframApi;
var prototype = require("prototype"); Object.extend(global, prototype);

var Wolfram = Class.create(Engine, {
  info: {
    name: "Wolfram",
    version: 1
  },

  initialize: function($super, opts) {
    $super();
    this.wolfram = new WolframApi(opts.api);
  },

  bind: function($super, bot) {
    $super(bot);
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