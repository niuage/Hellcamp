var system   = require('sys');
var BaseStore = require("./base_store").BaseStore;

var BoomStore = BaseStore.extend({
  info: {
    name: "BoomStore",
    version: 1
  },

  init: function(opts) {
    this._super();
  },

  bind: function(bot) {
    this._super(bot);

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