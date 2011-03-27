var system   = require('sys');
var Browser = require("../libs/browser").Browser;
var Engine = require("./engine").Engine;
var WeatherApi = require("../apis/weather").WeatherApi

var Weather = Engine.extend({
  info: {
    name: "Weather",
    version: 1
  },

  init: function(opts) {
    this._super();
    this.browser = new Browser({});
    this.weather = new WeatherApi(opts.weather_api)
  },

  bind: function(bot) {
    this._super(bot);
    bot.on("/w(?:eather)?(:\\w+)?\\s?(.*)", function(message, matches, callback) {
      this.weather.search(matches, callback);
    });
  }
})

exports.Weather = Weather;