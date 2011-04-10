var system   = require('sys');
var Engine = require("./engine").Engine;
var prototype = require("prototype"); Object.extend(global, prototype);

var Shout = Class.create(Engine, {
  info: {
    name: "Shout",
    version: 1
  },

  initialize: function($super, opts) {
    $super();
  },

  bind: function($super, bot) {
    $super(bot);
    bot.on("/shout\\s(.*)", function(message, matches, callback) {
      var self = this;
      this.bot.campfire.user(message.user_id, function(data) {
        var user = data.user;
        var all_rooms = self.bot.campfire_rooms;
        all_rooms.each(function(room) {
          room.speak(user.name + ":", function(data) {
            this.speak(matches[0], function(data) {});
          });
        }, this);
      })
    });
  },

  help: function() {
    return [
    ["/shout [message]", "Send a message to all the rooms."]
    ];
  }
})

exports.Shout = Shout;