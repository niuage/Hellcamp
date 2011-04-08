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
    this.black_list_message = "You've just been Rebecca Black Listed.";
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
        //        if (this.black_listed(message.body, callback)) return;
        match.shift();
        this.events[event].apply(this, [message, match, callback]);
      }
    }
  },

  text_message: function(room, message) {
    this.trigger(room, message, function(response) {
      if (response) {
        room.message(response.body, response.type, function(data) {
          system.puts(JSON.stringify(data));
        });
      }
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
    return global.Signal.STOP;
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
    bot.on("^/help", function(message, matches, callback) {
      callback({
        body: this.formated_help(),
        type: "PasteMessage"
      })
    })
  },

  bot: function(bot) {
    if (bot) {
      this.bot = bot;
      return null;
    }
    else
      return this.bot;
  },

  black_listed: function(item, callback) {
    if (!item) return false;
    var list = [
    ".*reb*ec*a.*b*la*c*k.*",
    "friday"
    ]
    for (i in list) {
      if (item.match(new RegExp(list[i]))) {
        callback({
          body: this.black_list_message
        })
        return true;
      }
    }
    return false;
  },

  help: function() {
    return [["Command", "Description"]]
  },

  formated_help: function() {
    var commands = ["Bot: " + this.info.name];
    var help = this.help();
    for (c in help) {
      var command = help[c];
      commands.push(command.join(": "))
    }
    return commands.join("\n")
  }
})

exports.Engine = Engine;