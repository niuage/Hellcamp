var system   = require('sys');
var Klass = require("./class").Klass;

(new Klass()).define();

var Engine = Class.extend({
  info: {
    name: "Default",
    version: 1
  },

  init: function() {
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
      system.puts(message.body)
      if ((match = message.body.match(new RegExp(event)))) {
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

  kick_message: function(room, message) {},
  paste_message: function(room, message) {},
  enter_message: function(room, message) {},

  init_events: function() {
    var self = this;
    self.bind({
      on: function(event, callback) {
        self.events[event] = callback;
      }
    })
  },

  bind: function(bot) {
  }
})

exports.Engine = Engine;