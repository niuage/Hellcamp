var system   = require('sys');
var Api = require("./api").Api;
// https://github.com/niuage/node-github
var Github = require("github").GitHubApi;
var prototype = require("prototype"); Object.extend(global, prototype);

var GithubApi = Class.create(Api, {

  initialize: function($super, opts) {
    $super(opts);
    this.github = new Github(true);
  },

  errors: function(errors, callback) {
    if (errors && errors.length > 0) {
      callback({
        body: errors.join("\n"),
        type: "PasteMessage"
      })
      return true;
    }
    return false;
  },

  get_branch_commits: function(params, callback) {
    if (this.errors(params.errors, callback)) return;
    var args = this.merge({
      u: "challengepost",
      b: "master"
    }, params.argv);
    this.authenticate();
    if (args.p) {
      args.b += "?page=" + args.p
    }
    this.github.getCommitApi().getBranchCommits(args.u, args.r, args.b, function(err, commits) {
      if (!commits) {
        callback({
          body: "No commits."
        });
        return;
      }
      commits = commits.map(function(c) {
        return [
        c.author.name + " " + c.committed_date,
        "message: " + c.message,
        "id: " + c.id
        ].join("\n");
      });

      callback({
        body: commits.join("\n\n"),
        type: "PasteMessage"
      });
    });
  },

  get_specific_commit: function(params, callback) {
    if (this.errors(params.errors, callback)) return;
    var args = this.merge({
      u: "challengepost"
    }, params.argv);
    this.authenticate();
    this.github.getCommitApi().getSpecificCommit(args.u, args.r, args.i, function(err, commit) {
      if (!commit) {
        callback({
          body: "No commit with this id."
        });
        return;
      }

      callback({
        body: commit.modified[0].diff,
        type: "PasteMessage"
      });
    });
  },

  authenticate: function() {
    this.github.authenticateToken(this.secret, this.key);
  }
});

exports.GithubApi = GithubApi;
