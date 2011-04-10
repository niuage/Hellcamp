var system   = require('sys');
var exec = require('child_process').exec;
var Api = require("./api").Api;
var LibXml = require("libxmljs");
var prototype = require("prototype"); Object.extend(global, prototype);

var PivotalApi = Class.create(Api, {

  initialize: function($super, opts) {
    $super(opts);
    this.parser = LibXml;
  },

  search: function(params, callback) {
    //  system.puts("get_story");
    //  this.get("POST", "/services/v3/projects/80286/stories/" + params[0].toString(), "", {
    //    request: {
    //      host: "pivotaltracker.com"
    //    },
    //    headers: {
    //      "X-TrackerToken": 'ea1853c2bf4b33a7147517100d6e2372'
    //    }
    //  }, function(data) {
    //    system.puts("yeah");
    //    system.puts(data);
    //    callback({
    //      body: data
    //    })
    //  });

    var self = this;
    // cheat with curl, should be done with a standard POST request
    var url = this.template("http://www.pivotaltracker.com/services/v3/projects/<%project%>/stories/<%story%>", {
      project: "80286",
      story: params[0]
    });
    exec("curl -H 'X-TrackerToken: ea1853c2bf4b33a7147517100d6e2372' -X GET " + url, function(error, out, err) {
      var story = self.parser.parseXmlString(out).get("/");
      var attachments = (a = story.get("//attachment")) ? a.get("./url").text() : null;

      var body = {
        Name: story.get("./name").text(),
        Description: story.get("./description").text(),
        "Requested by": (requested = story.get("./requested_by")) ? requested.text() : null,
        "Owned by": (owned = story.get("./owned_by")) ? owned.text() : null,
        "Current state": story.get("./current_state").text(),
        "Attachment": attachments
      }
      var res = [];
      var content = null
      for (elt in body) {
        if ((content = body[elt]))
          res.push(elt + ": " + content);
      }

      callback({
        body: res.join("\n").replace(/ü/g, "u"),
        type: "PasteMessage"
      })
    })
  }

});

exports.PivotalApi = PivotalApi;