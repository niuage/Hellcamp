var system   = require('sys');
var exec = require('child_process').exec;
var GoogleApi = require("../apis/google").GoogleApi;
var YoutubeApi = require("../apis/youtube").YoutubeApi;
var Engine = require("./engine").Engine;
var prototype = require("prototype"); Object.extend(global, prototype);

var J5 = Class.create(Engine, {
  info: {
    name: "J5",
    version: 1
  },

  initialize: function($super, opts) {
    $super(opts);
    this.google = new GoogleApi();
    this.youtube = new YoutubeApi();
  },

  bind: function($super, bot) {
    $super(bot);
    bot.on("/search\\s(.+)", function(message, matches, callback) {
      this.google.search(matches, callback);
    });

    bot.on("/(?:youtube|yt)\\s(.+)", function(message, matches, callback) {
      this.youtube.search(matches, callback);
    });

    bot.on("/say\\s(.+)", function(message, matches, callback) {
      exec('cowsay "' + matches[0].replace(/"/g, '\\"') + '"', function(error, stdout, stderr) {
        callback({
          body: stdout,
          type: "PasteMessage"
        });
      })
    });

    bot.on("/deploy\\s(.+)", function(message, matches, callback) {
      var env = {
        production: {
          url: "http://i.imgur.com/YuGnJ.jpg"
        },
        staging: {
          url: "http://images2.memegenerator.net/ImageMacro/5017839/tap-tap-tap-taptaptap-staging-deploy.jpg"
        }
      }
      callback({
        body: env[matches[0]] ? env[matches[0]].url : "Unknown environment"
      });
    });
  },

  help: function() {
    return [
    ["/search [query]", "Search images on Google Images."],
    ["/youtube [query]", "Search Youtube videos"],
    ["/say [sentence]", "Make Johnny say something."]
    ];
  }

});

exports.J5 = J5;