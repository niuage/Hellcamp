var system   = require('sys');
var Engine = require("./engine").Engine;
var RedisStore = require("../libs/redis_store").RedisStore;
var C = require("../libs/common").Common;
var Class = C.$Class;

var BaseStore = Class.create(Engine, {
  info: {
    name: "BaseStore",
    version: 1
  },

  initialize: function($super, opts) {
    $super();
    this.store = new RedisStore();
  },

  bind: function($super, bot) {
    $super(bot);
  }
})

exports.BaseStore = BaseStore;