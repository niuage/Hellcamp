var system   = require('sys');
var Engine = require("./engine").Engine;
var GoogleApi = require("../apis/google").GoogleApi;
var prototype = require("prototype"); Object.extend(global, prototype);

var Translation = Class.create(Engine, {
  info: {
    name: "Translation",
    version: 1
  },

  initialize: function($super, opts) {
    $super();
    this.google = new GoogleApi();
  },

  bind: function($super, bot) {
    $super(bot);

    bot.on("/t:?([a-zA-Z_:]+)?\\s(.+)", function(message, matches, callback) {
      this.google.translate(matches, callback);
    })
  },

  help: function() {
    return [
      ["/t:[source]:[destination] [message]", "Translate message. The source language can be guessed by the bot, and the destination language defaults to english."]
    ];
  }
})

exports.Translation = Translation;