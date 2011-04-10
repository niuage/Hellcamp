var system   = require('sys');
var Engine = require("./engine").Engine;
var RedisStore = require("../libs/redis_store").RedisStore;
var prototype = require("prototype"); Object.extend(global, prototype);

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