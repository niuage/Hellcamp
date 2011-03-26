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
  }
})

exports.BaseStore = BaseStore;