var s   = require('sys');
var http   = require('http');
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
      if (opts.status) {
        s.puts(response.statusCode)
        return callback(response.statusCode);
      }
      var data = '';

      response.on('data', function(chunk) {
        data += chunk;
      });
      response.on('end', function() {
        s.puts("end")
        callback(data);
      });
    }
  });

  if (method == 'POST') {
    request.write(body);
  }

  request.end();
};

Browser.prototype.status = function(params, callback) {
  var result = this.request("GET", "/", null, {
    request: {
      host    : params[0].replace("http://www.", "")
    },
    status: true
  }, function(data) {
    // handle response code
    // ...
    
    callback(data);
  })

  result.end();
}

Browser.prototype.search_image = function(params, callback) {
  var result = this.request("GET", "/ajax/services/search/images?v=1.0&q=" + params[0].split(" ").join("+"), null, {
    request: {
      host    : "ajax.googleapis.com"
    },
    ssl: true
  }, function(data) {
    if ((data = ( eval('('+ data + ")")) ) && data.responseData && (res = data.responseData.results) && res.length > 0) {
      s.puts(res.length);
      var pos = res.length;
      pos = Math.floor(Math.random() * (pos > 4 ? 4 : pos));
      callback({
        body: res[pos].unescapedUrl
      });
    } else {
      s.puts("NOT FOUND");
      callback({
        body: "Johnny 5 could not find any images matching " + params[0]
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
  var result = this.request("GET", "/feeds/api/videos?q=" + params[0].split(" ").join("+") +"&max-results=2&v=2&alt=json", null, {
    request: {
      host: "gdata.youtube.com"
    }
  }, function(data) {
    s.puts("youtube result");
    res = eval( "(" + data + ")" );
    callback({body:  res.feed.entry[0]["media$group"]["media$player"].url });
  })

  result.end();
}

exports.Browser = Browser;