var system   = require('sys');
var prototype = require("prototype");
Object.extend(global, prototype);

var Bot = require('../bots/bot').Bot;
var Campfire = require("../libs/campfire").Campfire;
var Engines = require("../engines/engines").Engines;
var YQL = require("../libs/yql").YQL;

var Server = Class.create({
  
  initialize: function(options) {
    this.init_app(); // create express app
    this.config(options); // read config from file
    this.create_redis_client(); // create redis client (used for publish/subscribe)
    this.open_socket(); // open socket to client

    this.create_bots(); // create engines and bots
  },

  /****************************/

  create_redis_client: function() {
    const redis = require('redis');
    this.client = redis.createClient();
  },

  open_socket: function() {
    const io = require('socket.io');
    this.socket = io.listen(this.app);
  },

  init_app: function() {
    var express = require('express');
    this.app = module.exports = express.createServer();
    this.app.use(express.static(__dirname + '/public'));
  },

  start: function() {
    this.app.listen(this.port, this.host);
    console.log("Express server listening on port %d", this.app.address().port);
    this.bots.each(function(bot) {
      bot.start();
    });
  },

  add_bot: function(bot) {
    this.bots.push(bot);
    return bot;
  },

  config: function(options) {
    this.options = $H({
      source: "config/config.yml"
    }).merge(options || {});

    this.config = global.config = require('yaml').eval(
      require('fs')
      .readFileSync(this.options.get("source"))
      .toString('utf-8')
      )[this.app.settings.env];

    var server = $H({
      port: 3001,
      host: "localhost"
    }).merge(this.options).merge(this.config.server || {});

    this.port = server.get("port");
    this.host = server.get("host");

    this.bots = this.options.get("bots") || [];
  },

  create_bots: function() {
    var get_rooms = function(b) {
      var rooms = []
      b.campfire.rooms.each(function(room) {
        rooms.push(room.id);
      }, this);
      return rooms;
    }

    var get_engines = function(b) {
      var engines = [];
      b.engines.each(function(engine) {
        var name = engine.name;
        var config = this.config.engines[name];
        var Klass = Engines[name];
        engines.push(new Klass(config));
      }, this);
      return engines;
    }

    var bots = this.config.bots;
    for (bot in bots) {
      var b = bots[bot];
      this.add_bot(
        new Bot(bot, {
          campfire: new Campfire(b.campfire.config),
          engines: get_engines.apply(this, [b]),
          rooms: get_rooms.apply(this, [b]),
          active: b.active ? true : false
        })
        );
    }
  }
});

exports.Server = Server;