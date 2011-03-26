var system   = require('sys');
var Browser = require("../libs/browser").Browser;
var Engine = require("./engine").Engine;

var Weather = Engine.extend({
  info: {
    name: "Weather",
    version: 1
  },

  init: function(opts) {
    this._super();
    this.browser = new Browser({});
    this.partner_id = opts.partner_id,
    this.key = opts.key
  //A4458161574
  },

  bind: function(bot) {
    this._super(bot);
    bot.on("^/weather", function(message, matches, callback) {
      callback({
        body: "ok"
      })
    })
  }
})

exports.Weather = Weather;