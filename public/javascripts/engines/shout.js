var system   = require('sys');
var Engine = require("./engine").Engine;

var Shout = Engine.extend({
  info: {
    name: "Shout",
    version: 1
  },

  init: function(opts) {
    this._super();
  },

  bind: function(bot) {
    this._super(bot);
    bot.on("/shout\\s(.*)", function(message, matches, callback) {
      var self = this;
      this.bot.campfire.user(message.user_id, function(data) {
        var user = data.user;
        var all_rooms = self.bot.campfire_rooms;
        for (r in all_rooms) {
          var room = all_rooms[r];
          room.speak(user.name + ":", function(data) {
            this.speak(matches[0], function(data) {});
          });
        }
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