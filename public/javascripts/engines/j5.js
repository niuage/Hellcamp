var system   = require('sys');
var exec = require('child_process').exec;
var GoogleApi = require("../apis/google").GoogleApi;
var Engine = require("./engine").Engine;

var J5 = Engine.extend({
  info: {
    name: "J5",
    version: 1
  },

  init: function(opts) {
    this._super();
    this.google = new GoogleApi({});
  },

  bind: function(bot) {
    this._super(bot);

    bot.on("/search\\s(.+)", function(message, matches, callback) {
      this.google.search(matches, callback);
    })

    bot.on("^/(\\w+)\\s?(.*)", function(message, matches, callback) {
      var command = matches.shift();
      system.puts(this.commands()[command]);
      if ((action = this.commands()[command])) {
        action.action.apply(this, [message, matches, callback]);
      }
    });

    

    bot.on("!here (.*)", function(message, matches, callback) {
      callback({
        body: matches[0]
      })
    });
  },

  commands: function() {
    var say = function(message, params, callback) {
      say = 'cowsay "' + params[0].replace(/"/g, '\\"') + '"';
      exec(say, function(error, stdout, stderr) {
        callback({
          body: stdout,
          type: "PasteMessage"
        });
      })
    }

    var search_image = function(message, params, callback) {
      system.puts(this.google.search);
      this.google.search(params, callback);
    }

    var search_youtube = function(message, params, callback) {
      this.browser.search_youtube(params, callback);
    }

    

    var help = function(message, params, callback) {
      var help = "",
      obj = this.commands();

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
      getorder: {
        action: getorder
      },
      order: {
        action: order
      },
      myorder: {
        action: myorder
      },
      neworder: {
        action: neworder
      },
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

});

exports.J5 = J5;