var system   = require('sys');
var Api = require("./api").Api

var PivotalApi = Api.extend({

  init: function(opts) {
    this._super(opts)
  },

  search: function(parser, params, callback) {
    //  system.puts("get_story");
    //  this.request("POST", "/services/v3/projects/80286/stories/" + params[0].toString(), "", {
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

    // cheat with curl, should be done with a standard POST request

    exec("curl -H 'X-TrackerToken: ea1853c2bf4b33a7147517100d6e2372' -X GET http://www.pivotaltracker.com/services/v3/projects/80286/stories/" + params[0], function(error, out, err) {
      var story = parser.parseXmlString(out).get("/");
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
        // That's all your fault, Juan Müller! ;) Need to investigate later...
        body: res.join("\n").replace(/ü/g, "u"),
        type: "PasteMessage"
      })
    })
  }

});

exports.PivotalApi = PivotalApi;