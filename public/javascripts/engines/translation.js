var system   = require('sys');
var Engine = require("./engine").Engine;
var GoogleApi = require("../apis/google").GoogleApi;

var Translation = Engine.extend({
  info: {
    name: "Translation",
    version: 1
  },

  init: function(opts) {
    this._super();
    this.google = new GoogleApi();
  },

  bind: function(bot) {
    this._super(bot);

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