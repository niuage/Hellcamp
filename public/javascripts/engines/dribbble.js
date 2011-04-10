var system   = require('sys');
var Engine = require("./engine").Engine;
var DribbbleApi = require("../apis/dribbble").DribbbleApi;
var prototype = require("prototype"); Object.extend(global, prototype);

var Dribbble = Class.create(Engine, {
  info: {
    name: "Dribbble",
    version: 1
  },

  initialize: function($super, opts) {
    $super();
    this.dribbble = new DribbbleApi();
  },

  bind: function($super, bot) {
    $super(bot);
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