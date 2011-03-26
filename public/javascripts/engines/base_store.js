var system   = require('sys');
var Engine = require("./engine").Engine;
var RedisStore = require("../libs/redis_store").RedisStore;

var BaseStore = Engine.extend({
  info: {
    name: "BaseStore",
    version: 1
  },

  init: function(opts) {
    this._super();
    this.store = new RedisStore();
  },

  bind: function(bot) {
    this._super(bot);
  }
})

exports.BaseStore = BaseStore;