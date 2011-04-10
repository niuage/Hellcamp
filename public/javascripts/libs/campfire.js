var system = require('sys');
var http   = require('http');
var https  = require('https');
var encode = require('./base64').encode;

var Campfire = function(options) {
  this.ssl           = options.ssl;
  this.http          = this.ssl ? https : http;
  this.port          = this.ssl ? 443 : 80;
  this.token         = options.token;
  this.account       = options.account;
  this.domain        = options.account + '.campfirenow.com';
  this.authorization = 'Basic ' + encode(options.token + ':x');
};

Campfire.prototype.rooms = function(callback) {
  var self = this;
  this.get('/rooms', function(data) {
    callback(data.rooms.map(function(roomData) {
      return new Campfire.Room(self, roomData);
    }));
  });
};

Campfire.prototype.room = function(idOrName, callback) {
  if (typeof(callback) != 'function') {
    throw new Error('A callback must be provided for retrieving a room.');
  }

  this.rooms(function(rooms) {
    for (var i = rooms.length - 1; i >= 0; i--) {
      var room = rooms[i];

      if (room.id == idOrName || room.name == idOrName) {
        callback(room);
        return;
      }
    }

    callback();
  });
};

Campfire.prototype.user = function(id, callback) {
  this.get('/users/' + id, callback);
};

Campfire.prototype.me = function(callback) {
  this.get('/users/me', callback);
};

Campfire.prototype.get = function(path, callback) {
  this.request('GET', path, null, callback);
};

Campfire.prototype.post = function(path, body, callback) {
  this.request('POST', path, body, callback);
};

Campfire.prototype.request = function(method, path, body, callback) {
  var headers = {
    'Authorization' : this.authorization,
    'Host'          : this.domain,
    'Content-Type'  : 'application/json',
    'Connection': 'keep-alive',
    'Keep-Alive': 115
  };

  if (method == 'POST') {
    if (typeof(body) != 'string') {
      body = JSON.stringify(body);
    }

    headers['Content-Length'] = body.length;
  }

  var options = {
    host    : this.domain,
    port    : this.port,
    method  : method,
    path    : path,
    headers : headers
  };
  
  var request = this.http.request(options, function(response) {
//    system.puts(system.inspect(response))
    if (typeof(callback) == 'function') {
      var data = '';

      response.on('data', function(chunk) {
        data += chunk;
      });
      response.on('end', function() {
        try {
          data = JSON.parse(data);
        } catch(e) {}
        callback(data);
      });
    }
  });

  if (method == 'POST') {
    request.write(body, encoding="ascii");
  }

  request.end();
};

Campfire.Room = function(campfire, data) {
  this.id              = data.id;
  this.name            = data.name;
  this.topic           = data.topic;
  this.locked          = data.locked;
  this.createdAt       = data.created_at;
  this.updatedAt       = data.updated_at;
  this.membershipLimit = data.membership_limit;

  this.path     = '/room/' + this.id;
  this.campfire = campfire;
};

Campfire.Room.prototype.join = function(callback) {
  this.post('/join', '', callback);
};

Campfire.Room.prototype.leave = function(callback) {
  this.post('/leave', '', callback);
};

Campfire.Room.prototype.listen = function(callback) {
  if (typeof(callback) != 'function') {
    throw new Error('A callback must be provided for listening.');
  }

  var
  campfire = this.campfire,
  options  = {
    host    : 'streaming.campfirenow.com',
    port    : campfire.port,
    method  : 'GET',
    path    : this.path + '/live.json',
    headers : {
      'Host'          : 'streaming.campfirenow.com',
      'Authorization' : campfire.authorization
    }
  },
  room = this,
  req = null;
  
  var listen_to = function(options, restart) {
    system.puts("LISTEN TO " + room.name + " (id=" + room.id + ")");
    room.join(function() {
      req = campfire.http.request(options, function(response) {
        response.setEncoding('utf8');
        response.on('data', function(chunk) {
          if (chunk.trim() == '') return;
          chunk = chunk.split("\r");

          for (var i = 0; i < chunk.length; ++i) {
            if (chunk[i].trim() != '') {
              try {
                callback(JSON.parse(chunk[i]));
              } catch(e) {}
            }
          }
        });

        response.on("end", function(data) {
          system.puts("LEAVE FROM " + room.name + " (id=" + room.id + ")");
          restart(options, restart);
        })

      }).end();
    })
  }

  listen_to(options, listen_to);
},

Campfire.Room.prototype.speak = function(text, callback) {
  this.message(text, 'TextMessage', callback);
};

Campfire.Room.prototype.paste = function(text, callback) {
  this.message(text, 'PasteMessage', callback);
};

Campfire.Room.prototype.sound = function(text, callback) {
  this.message(text, 'SoundMessage', callback);
},

Campfire.Room.prototype.message = function(text, type, callback) {
  var self = this;
  this.post('/speak', {
    message : {
      body : text,
      type : type || "TextMessage"
    }
  }, function(data) {
    callback.apply(self, [data]);
  });
};

Campfire.Room.prototype.lock = function(callback) {
  this.post('/lock', '', callback);
};

Campfire.Room.prototype.unlock = function(callback) {
  this.post('/unlock', '', callback);
};

Campfire.Room.prototype.show = function(callback) {
  this.post('', '', callback);
};

Campfire.Room.prototype.get = function(path, callback) {
  this.campfire.get(this.path + path, callback);
};

Campfire.Room.prototype.post = function(path, body, callback) {
  this.campfire.post(this.path + path, body, callback);
};

exports.Campfire = Campfire;
