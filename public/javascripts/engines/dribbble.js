var system   = require('sys');
var Engine = require("./engine").Engine;
var DribbbleApi = require("../apis/dribbble").DribbbleApi;

var Dribbble = Engine.extend({
  info: {
    name: "Dribbble",
    version: 1
  },

  init: function(opts) {
    this._super();
    this.dribbble = new DribbbleApi();
  },

  bind: function(bot) {
    this._super(bot);
    bot.on("dribbble.com/shots/(\\d+).*", function(message, matches, callback) {
      this.dribbble.search(matches, callback);
    });
  },

  help: function() {
    return [
      ["[url of a dribbble shot]", "Post the shot in Campfire."]
    ];
  }
})

exports.Dribbble = Dribbble;