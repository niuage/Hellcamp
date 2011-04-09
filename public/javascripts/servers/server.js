var system   = require('sys');
var C = require("../libs/common").Common;
var Class = C.$Class;
var Hash = C.$Hash.from;

var Server = Class.create({
  
  initialize: function(options) {
    this.init(options);
    this.create_app();
    this.create_redis_client();
    this.open_socket();
    this.set_config();

    this.create_engines();
  },

  /****************************/

  init: function(options) {
    var config = Hash({
      port: 3000,
      host: "localhost"
    }).merge(options.config);

    this.port = config.get("port");
    this.host = config.get("host");

    this.bots = options.bots || [];
  },

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

  set_config: function() {
    this.config = global.config = require('yaml').eval(
      require('fs')
      .readFileSync('../config/config.yml') // might be a problem
      .toString('utf-8')
      )[this.app.settings.env];
  },

  create_engines: function() {

    var J5 = require("./engines/j5").J5;
    //Pivotal = require("./engines/pivotal").Pivotal,
    //Weather = require("./engines/weather").Weather,
    //Flickr = require("./engines/flickr").Flickr,
    //BoomStore = require("./engines/boom_store").BoomStore,
    //Translation = require("./engines/translation").Translation,
    //Tmdb = require("./engines/tmdb").Tmdb,
    //Wiki = require("./engines/wiki").Wiki,
    //Bitly = require("./engines/bitly").Bitly,
    //Shout = require("./engines/shout").Shout;
    //Dribbble = require("./engines/dribbble").Dribbble;
    //Wolfram = require("./engines/wolfram").Wolfram;
    //Github = require("./engines/github").Github;

    this.engines = {
      J5: new J5(this.config.engines.J5)
    }
  }
});

exports.Server = Server;