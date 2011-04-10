var system   = require('sys');
var Engine = require("./engine").Engine;
var BackpackApi = require("../apis/backpack").BackpackApi;

var Backpack = Engine.extend({
  info: {
    name: "Backpack",
    version: 1
  },

  initialize: function(opts) {
    this._super();
    this.backpack = new BackpackApi(opts.api);
  },

  bind: function(bot) {
    this._super(bot);
    bot.on("/add:reminder", function(message, matches, callback) {
      this.backpack.add_reminder(matches, callback);
    });
  },

  help: function() {
    return [
      ["", ""]
    ];
  }
})

exports.BackPack = Backpack;