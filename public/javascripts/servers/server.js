var system   = require('sys');
var C = require("../libs/common").Common;
var Class = C.$Class;
var Hash = C.$Hash.from;
var Bot = require('../bots/bot').Bot;
var Campfire = require("../libs/campfire").Campfire;

var Server = Class.create({
  
  initialize: function(options) {
    this.create_app();
    this.config(options);
    this.create_redis_client();
    this.open_socket();

    this.create_engines();
    this.create_bots();
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

  create_app: function() {
    var express = require('express');
    this.app = module.exports = express.createServer();
    this.app.use(express.static(__dirname + '/public'));
  },

  start: function() {
    this.app.listen(this.port, this.host);
    console.log("Express server listening on port %d", this.app.address().port);
    
    system.puts(this.app.settings.env);
    this.bots.each(function(bot) {
      bot.start();
    });
  },

  add_bot: function(bot) {
    this.bots.push(bot);
    return bot;
  },

  config: function(options) {
    this.options = Hash({
      source: "config/config.yml",
      port: 3001,
      host: "localhost"
    }).merge(options || {});

    this.config = global.config = require('yaml').eval(
      require('fs')
      .readFileSync(this.options.get("source"))
      .toString('utf-8')
      )[this.app.settings.env];

    var server = Hash(this.config.server).merge(this.options);

    this.port = server.get("port");
    this.host = server.get("host");

    this.bots = this.options.get("bots") || [];
  },

  create_engines: function() {
    this.engines = {};

    var J5 = require("../engines/j5").J5,
    //Pivotal = require("./engines/pivotal").Pivotal,
    Weather = require("../engines/weather").Weather,
    Flickr = require("../engines/flickr").Flickr,
    //BoomStore = require("./engines/boom_store").BoomStore,
    //Translation = require("./engines/translation").Translation,
    Tmdb = require("../engines/tmdb").Tmdb,
    //Wiki = require("./engines/wiki").Wiki,
    Bitly = require("../engines/bitly").Bitly,
    //Shout = require("./engines/shout").Shout;
    //Dribbble = require("./engines/dribbble").Dribbble;
    Wolfram = require("../engines/wolfram").Wolfram,
    Github = require("../engines/github").Github;

    this.config.engines.each(function(engine) {
      for (var name in engine) {
        var Klass = eval(name); // might want to find another way?
        //        system.puts(system.inspect(engine[name]));
        this.engines[name] = new Klass(engine[name]);
      }
    }, this);
  },

  create_bots: function() {
    this.config.bots.each(function(bot) {
      for (var bot_name in bot) {
        var b = bot[bot_name];
        var engines = [];
        var rooms = [];
        b.campfire.rooms.each(function(room) {
          rooms.push(room.id);
        }, this);
        b.engines.each(function(engine) {
          engines.push(this.engines[engine.name])
        }, this);
        this.bots.push(
          new Bot(bot_name, {
            campfire: new Campfire(b.campfire.config),
            engines: engines,
            rooms: rooms
          })
          );
      }
    }, this);
  }
});

exports.Server = Server;