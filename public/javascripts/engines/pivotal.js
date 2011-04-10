var system   = require('sys');
var Browser = require("../libs/browser").Browser;
var Engine = require("./engine").Engine;
var PivotalApi = require("../apis/pivotal").PivotalApi;
var prototype = require("prototype"); Object.extend(global, prototype);

var Pivotal = Class.create(Engine, {
  info: {
    name: "Pivotal",
    version: 1
  },

  initialize: function($super, opts) {
    $super();
    this.pivotal = new PivotalApi({});
  },

  bind: function($super, bot) {
    $super(bot);
    bot.on("(?:https?://www.pivotaltracker.com/story/show/|!)(\\d+)", function(message, matches, callback) {
      this.pivotal.search(matches, callback);
    });
  },

  help: function() {
    return [
      ["[Url of a PivotalTracker story]", "Post details about the story."]
    ];
  }
})

exports.Pivotal = Pivotal;