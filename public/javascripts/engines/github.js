var system   = require('sys');
var Engine = require("./engine").Engine;
var GithubApi = require("../apis/github").GithubApi;
var prototype = require("prototype"); Object.extend(global, prototype);

var Github = Class.create(Engine, {
  info: {
    name: "Github",
    version: 1
  },

  initialize: function($super, opts) {
    $super();
    this.github = new GithubApi(opts.api);
    this.parser = require('../libs/argv');
  },

  bind: function($super, bot) {
    $super(bot);
    bot.on("/log\\s?(.*)", function(message, matches, callback) {
      matches = this.parser(matches[0].split(" ")).usage("/log -u [user] -r [repo] -b [branch] -p [page]").demand(["r"]);
      this.github.get_branch_commits(matches, callback);
    });
    bot.on("/commit\\s?(.*)", function(message, matches, callback) {
      matches = this.parser(matches[0].split(" ")).usage("/log -u [user] -r [repo] -b [branch] -i [commit_id]").demand(["r", "i"]);
      this.github.get_specific_commit(matches, callback);
    })
  },

  help: function() {
    return [
      ["/log [repo] -u=[username] -b=[branch]", "Get campfire commits."]
    ];
  }
})

exports.Github = Github;