var system   = require('sys');
var Browser = require("./request").Browser;
var exec = require('child_process').exec;
var MyRedis = require("./myredis").MyRedis;

var Bot = function(options) {
  this.command = options.command || "j5";
  this.client = new MyRedis({});
  this.campfire = options.campfire
}

Bot.prototype.action = function() {

  var client = this.client;
  var interpret = this.interpret;

  var search_image = function(message, params, callback) {
    new Browser().search_image(params, callback);
  }

  var search_youtube = function(message, params, callback) {
    new Browser().search_youtube(params, callback);
  }

  var say = function(message, params, callback) {
    say = 'cowsay "' + params[0].replace(/"/g, '\\"') + '"';
    exec(say, function(error, stdout, stderr) {
      callback({
        body: stdout,
        type: "PasteMessage"
      });
    })
  }

  var set = function(message, params, callback) {
    client.set(message, params, callback);
  }
  var get = function(message, params, callback) {
    client.get(message, params, callback)
  }

  var gset = function(message, params, callback) {
    client.gset(message, params, callback);
  }
  var gget = function(message, params, callback) {
    client.gget(message, params, callback)
  }

  var status = function(message, params, callback) {
    new Browser().status(params, callback);
  }

  var deploy = function(message, params, callback) {
    var env = {
      production: {
        url: "http://i.imgur.com/YuGnJ.jpg"
      },
      staging: {
        url: "http://images2.memegenerator.net/ImageMacro/5017839/tap-tap-tap-taptaptap-staging-deploy.jpg"
      }
    }
    callback({
      body: env[params[0]].url
    });
  }

  return {
    search: search_image,
    deploy: deploy,
    say: say,
    status: status,
    youtube: search_youtube,
    set: set,
    get: get,
    bim: gset,
    boom: gget
  };
}

Bot.prototype.obey = function(message, callback) {
  if (message.body && (message.body.match(new RegExp("^/") )) ) {
    system.puts("obey");
    this.interpret(message, callback);
  } else
    system.puts("disobey");
  callback();
}

Bot.prototype.interpret = function(message, callback) {
  var body = message.body,
  regexp = "^/(\\w+)\\s?(.*)*",
  command = message.body.match(new RegExp(regexp));

  if (!command) {
    system.puts("command not found;")
    return;
  }
  var action = command[1];

  if (command.length > 2) {
    params = command.slice(2, command.length);
  }

  system.puts("params are: " + params);
  this.action()[action](message, params, callback);
}

exports.Bot = Bot;