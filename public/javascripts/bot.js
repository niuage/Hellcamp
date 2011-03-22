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

  var actions = this.action;
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

  var help = function(message, params, callback) {
    var help = "",
    obj = actions();

    for (p in obj) {
      var a = obj[p]
      help += p + " -- " + (a.description || "") + "\n" + (a.usage || "") + "\n\n"
    }
    callback({
      body: help,
      type: "PasteMessage"
    })
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
      body: env[params[0]] ? env[params[0]].url : "Unknown environment"
    });
  }

  return {
    search: {
      action: search_image,
      description: "Search google images",
      usage: "/search [query]"
    },
    deploy: {
      action: deploy,
      description: "Announce a deploy",
      usage: "/deploy [production | staging]"
    },
    say: {
      action: say,
      description: "Cowsay",
      usage: "/say [expression]"
    },
    youtube: {
      action: search_youtube,
      description: "Search youtube videos",
      usage: "/youtube [query]"
    },
    set: {
      action: set,
      description: "Set the string value of a key (campfire store)",
      usage: "/set key value"
    },
    get: {
      action: get,
      description: "Get the value of a key (campfire store)",
      usage: "/get key"
    },
    bim: {
      action: gset,
      description: "Set the string value of a key (personal store)",
      usage: "/bim key value"
    },
    boom: {
      action: gget,
      description: "Get the value of a key (personal store)",
      usage: "/get key"
    },
    help: {
      action: help,
      description: "List of commands",
      usage: "/help"
    }
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
  this.action()[action].action(message, params, callback);
}

exports.Bot = Bot;