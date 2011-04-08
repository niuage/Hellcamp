var system   = require('sys');
var C = require("../libs/common").Common;
var Class = C.$Class;
var Hash = C.$Hash.from;

var Server = Class.create({
  
  initialize: function(options) {
    this.init(options);
    this.create_app();
    this.create_redis_client();
    this.listen();
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

  listen: function() {
    const io = require('socket.io');
    this.socket = io.listen(this.app);
  },

  add_bot: function(bot) {
    this.bots.push(bot);
    return bot;
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
  }
});

exports.Server = Server;