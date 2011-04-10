var system   = require('sys');
var Browser = require("../libs/browser").Browser;
var C = require("../libs/common").Common;
var Class = C.$Class;

var sig = global.Signal = {
  STOP: 0,
  CONTINUE: 1
};

var Bot = Class.create({
  initialize: function(name, options) {
    this.name = name;
    this.active = options.active;
    this.campfire = options.campfire;
    this.rooms = options.rooms;
    this.campfire_rooms = [];
    this.events = {};
    this.engines = options.engines;
    this.me(function(id) {
      this.id = id;
    });
    this.init_engines();
  },
  
  process_message: function(room, message) {
    system.puts("-----> " + this.name);
    this.engines.each(function(engine) {
      system.puts(engine.bot.name);
    }, this);
    this.engines.each(function(engine) {
      if (engine.process(room, message) === sig.STOP) {
        return;
      }
    }, this);
  },

  listen: function(room_id) {
    var self = this;
    this.campfire.room(room_id, function(room) {
      room.join(function() {
        self.campfire_rooms.push(room);
        room.listen(function(message) {
          system.puts("-----> " + self.name);
          if (message.body) system.puts(message.body);
          if (message.user_id != self.id) {
            self.process_message(room, message);
          }
        });
      });
    });
  },

  start: function() {
    if (this.active) {
      for(i = 0; i < this.rooms.length; i++) {
        this.listen(this.rooms[i]);
      }
    }
  },

  me: function(callback) {
    var self = this;
    this.campfire.me(function(me) {
      callback.apply(self, [me.user.id]);
    })
  },

  init_engines: function() {
    this.engines.each(function(engine) {
      engine.set_bot(this);
    }, this);
    system.puts("this bot is: " + this.name);
    this.engines.each(function(engine) {
      system.puts(engine.bot.name);
    }, this);
  }
});

exports.Bot = Bot;