var system   = require('sys');

var Server = function(options) {
  this.port = options.port || 3000;
  this.host = options.host || "localhost";
  this.bots = [];

  var express = require('express');
  this.app = module.exports = express.createServer();
  this.app.use(express.static(__dirname + '/public'));

  const redis = require('redis');
  this.client = redis.createClient();

  const io = require('socket.io');
  this.socket  = io.listen(this.app);
  
  this.app.listen(this.port, this.host);
  console.log("Express server listening on port %d", this.app.address().port);

  this.configure();
}

Server.prototype.configure = function() {
  var yml=require('fs')
  .readFileSync('config/config.yml')
  .toString('utf-8');
  system.puts(yml);
  global.config = require('yaml').eval(yml);
  system.puts(system.inspect(global.config));
}

Server.prototype.add_bot = function(bot) {
  this.bots.push(bot);
  return bot;
}

Server.prototype.start = function() {
  system.puts(this.app.settings.env);
  for(i = 0; i < this.bots.length; i++) {
    this.bots[i].start();
  }
}

exports.Server = Server;