var system   = require('sys');
var Browser = require("../libs/browser").Browser;

var Bot = function(options) {
  this.campfire = options.campfire;
  this.rooms = options.rooms;
  this.events = {};
  this.engines = options.engines;
  this.id = this.me();
  this.init_engines();
}

Bot.prototype.process_message = function(room, message) {
  for(engine in this.engines) { 
    this.engines[engine].process(room, message);
  }
}

Bot.prototype.listen = function(room_id) {
  var self = this;
  this.campfire.room(room_id, function(room) {
    room.join(function() {
      room.listen(function(message) {
        system.puts(":");
        if (message.user_id != self.id) {
          system.puts(message.user_id + " != " + this.id);
          self.process_message(room, message);
        }
      });
    });
  });
}

Bot.prototype.start = function() {
  for(i = 0; i < this.rooms.length; i++) {
    this.listen(this.rooms[i]);
  }
}

Bot.prototype.me = function() {
  var self = this;
  self.campfire.me(function(me) {
    self.id = me.user.id;
  })
}

Bot.prototype.init_engines = function() {
  for (e in this.engines) {
    this.engines[e].bot(this);
  }
}

exports.Bot = Bot;