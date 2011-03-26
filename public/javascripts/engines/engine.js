var system   = require('sys');
var Klass = require("../libs/class").Klass;
(new Klass()).define();

var Engine = Class.extend({
  info: {
    name: "Default",
    version: 1
  },

  init: function(opts) {
    this.events = {};
    this.init_events();
  },

  process: function(room, message) {
    if ((type = this.type()[message.type])) {
      type.apply(this, [room, message]);
    }
  },

  type: function() {
    var self = this;
    return {
      TextMessage: self.text_message,
      KickMessage: self.kick_message,
      PasteMessage: self.paste_message,
      EnterMessage: self.enter_message
    };
  },

  trigger: function(room, message, callback) {
    for (event in this.events) {
      if ((match = message.body.match(new RegExp(event)))) {
        system.puts("found in " + this.info.name);
        match.shift();
        this.events[event].apply(this, [message, match, function(response) {
          if (response) {
            callback(response)
          }
        }]);
      }
    }
  },

  text_message: function(room, message) {
    this.trigger(room, message, function(response) {
      room.message(response.body, response.type, function(data) {
        system.puts(JSON.stringify(data));
      });
    })
  },

  kick_message: function(room, message) {
    this.bot.campfire.user(message.user_id, function(data) {
      system.puts(data.user.name + " has been kicked from the " + room.name + " room");
    });
  },
  paste_message: function(room, message) {
    this.bot.campfire.user(message.user_id, function(data) {
      system.puts(data.user.name + " pasted a message in " + room.name + ": " + message.body);
    });
  },
  enter_message: function(room, message) {
    system.puts(this.info.name)
    this.bot.campfire.user(message.user_id, function(data) {
      system.puts(data.user.name + " entered the " + room.name + " room");
    });
  },

  init_events: function() {
    var self = this;
    self.bind({
      on: function(event, callback) {
        self.events[event] = callback;
      }
    })
  },

  bind: function(bot) {
    system.puts("bind events for " + this.info.name);
  },

  bot: function(bot) {
    if (bot) {
      this.bot = bot;
      return null;
    }
    else
      return this.bot;
  }
})

exports.Engine = Engine;