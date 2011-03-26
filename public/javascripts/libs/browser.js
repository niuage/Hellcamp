var system   = require('sys');
var http   = require('http');
var exec = require('child_process').exec
var https   = require('https');

var Browser = function(options) {
  
}

Browser.prototype.request = function(method, path, body, opts, callback) {
  var req = opts.request || {},
  ssl = opts.ssl || false,
  protocol = ssl ? https : http,
  headers = {
    'Host'          : req.host,
    'Content-Type'  : 'application/html'
  };
  for (header in opts.headers) {
    system.puts(header);
    headers[header] = opts.headers[header];
  }

  if (method == 'POST') {
    if (typeof(body) != 'string') {
      body = JSON.stringify(body);
    }

    headers['Content-Length'] = body.length;
  }
  
  var options = {
    host    : req.host,
    port    : req.port || (ssl ? 443 : 80),
    method  : req.method || "GET",
    path    : path,
    headers : headers
  };

  var request = protocol.request(options, function(response) {
    if (typeof(callback) == 'function') {
      //      if (opts.status) {
      //        system.puts(response.statusCode)
      //        return callback(response.statusCode);
      //      }
      var data = '';

      response.on('data', function(chunk) {
        data += chunk;
      });
      response.on('end', function() {
        system.puts("end")
        callback(data);
      });
    }
  });

  if (method == 'POST') {
    request.write(body);
  }

  request.end();
};

Browser.prototype.get = function(path, opts, callback) {
  this.request("GET", path, null, opts, callback);
}

Browser.prototype.get_story = function(parser, params, callback) {
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

  exec("curl -H 'X-TrackerToken: ea1853c2bf4b33a7147517100d6e2372' -X GET http://www.pivotaltracker.com/services/v3/projects/80286/stories/" + params[0], function(error, out, err) {
    var story = parser.parseXmlString(out).get("/");
    var attachments = (a = story.get("//attachment")) ? a.get("./url").text() : null;
    //    var lala = []
    //    for (attachment in attachments) {
    //      lala.push(attachments[attachment].get("//url").text())
    //    }

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

    //    system.puts(JSON.stringify(body));

    system.puts(res.join(","));

    callback({
      body: res.join("\n").replace(/ü/g, "u"),
      //      body: "ok",
      type: "PasteMessage"
    })
  })
}

Browser.prototype.search_image = function(params, callback) {
  var result = this.get("/ajax/services/search/images?v=1.0&q=" + params[0].split(" ").join("+"), {
    request: {
      host    : "ajax.googleapis.com"
    },
    ssl: true
  }, function(data) {
    if ((data = ( eval('('+ data + ")")) ) && data.responseData && (res = data.responseData.results) && res.length > 0) {
      system.puts(res.length);
      var pos = res.length;
      pos = Math.floor(Math.random() * (pos > 4 ? 4 : pos));
      callback({
        body: res[pos].unescapedUrl
      });
    } else {
      callback({
        body: "No images found for '" + params[0] + "'"
      });
    }
  })

  result.end();
}

Browser.Url = function(browser, url, options) {
  this.browser = browser;
  this.url = url;
  this.options = options;
}

Browser.Url.prototype.format = function(params) {
  // for now...
  return this.url;
}

Browser.prototype.search_youtube = function(params, callback) {
  var result = this.get("/feeds/api/videos?q=" + params[0].split(" ").join("+") +"&max-results=2&v=2&alt=json", {
    request: {
      host: "gdata.youtube.com"
    }
  }, function(data) {
    system.puts("youtube result");
    res = eval( "(" + data + ")" );
    callback({
      body:  res.feed.entry[0]["media$group"]["media$player"].url
    });
  })

  result.end();
}

Browser.prototype.text_meme = function(params, callback) {
  var result = this.get("/text.json", {
    request: {
      host: "api.automeme.net"
    }
  }, function(data) {
    res = eval( "(" + data + ")" );
    callback({
      body: res[0]
    })
  });
}

Browser.prototype.flickr = function(params, callback) {
  this.get("/services/rest/?method=flickr.photos.getInfo&api_key=2bc972efba6309fe9376d55482ab32bb&secret=dfee6bcf0b5c41bb&format=json&photo_id=" + params[0], {
    request: {
      host: "api.flickr.com"
    }
  }, function(data) {
    var jsonFlickrApi = function(data) {
      return data;
    }

    res = eval( "(" + data + ")" ).photo;
    callback({
      body: "http://farm1.static.flickr.com/" + res.server + "/" + res.id + "_" + res.secret + ".jpg"
    })
  })
}

exports.Browser = Browser;