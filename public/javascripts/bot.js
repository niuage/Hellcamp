var system   = require('sys');
var Browser = require("./request").Browser;
var MyRedis = require("./myredis").MyRedis;

var Bot = function(options) {
  this.client = new MyRedis({});
  this.campfire = options.campfire;
  this.rooms = options.rooms;
  this.events = {};
  this.engines = options.engines;

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
        self.process_message(room, message);
      });
    });
  });
}

Bot.prototype.start = function() {
  for(i = 0; i < this.rooms.length; i++) {
    this.listen(this.rooms[i]);
  }
}

Bot.prototype.init_engines = function() {
  for(engine in this.engines) {
    this.engines[engine].init();
  }
}

exports.Bot = Bot;