var system   = require('sys');
var BaseStore = require("./base_store").BaseStore;
var prototype = require("prototype"); Object.extend(global, prototype);

var BoomStore = Class.create(BaseStore, {
  info: {
    name: "BoomStore",
    version: 1
  },

  initialize: function($super, opts) {
    $super();
  },

  bind: function($super, bot) {
    $super(bot);

    bot.on("/bim\\s(\\S+)\\s(.+)", function(message, matches, callback) {
      this.store.set(message, matches, callback);
    });
    bot.on("/boom\\s(\\S+)", function(message, matches, callback) {
      this.store.get(message, matches, callback);
    });
    bot.on("/set\\s(\\S+)\\s(.+)", function(message, matches, callback) {
      this.store.gset(message, matches, callback);
    });
    bot.on("/get\\s(\\S+)", function(message, matches, callback) {
      this.store.gget(message, matches, callback);
    });
  }
})

exports.BoomStore = BoomStore;