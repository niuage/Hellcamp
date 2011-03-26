var system   = require('sys');
var Browser = require("../libs/browser").Browser;
var Engine = require("./engine").Engine;

var Food = Engine.extend({
  info: {
    name: "Food",
    version: 1
  },

  init: function(opts) {
    this._super();
    this.browser = new Browser({});
  },

  bind: function(bot) {
    this._super(bot);
    
  },

  neworder: function(message, params, callback) {
    this.store.new_order(message, params, callback);
  },

  order: function(message, params, callback) {
    this.store.order(message, params, callback);
  },

  myorder: function(message, params, callback) {
    this.store.myorder(message, params, callback);
  },

  getorder: function(message, params, callback) {
    this.store.getorder(message, params, callback);
  }
})

exports.Food = Food;