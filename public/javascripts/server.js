var system   = require('sys'),
Campfire = require('./campfire').Campfire,
Bot = require('./bot').Bot;

const PORT = 3000;
const HOST = 'localhost';
const ROOMS = [348877, 357538, 273935, 360348, 389064, 301042]

var express = require('express');
var app = module.exports = express.createServer();
app.use(express.static(__dirname + '/public'));

const redis = require('redis');
const client = redis.createClient();

const io = require('socket.io');

app.listen(PORT, HOST);
console.log("Express server listening on port %d", app.address().port)

//const socket  = io.listen(app);

var johnny5 = new Bot({
  command: "j5",
  campfire: new Campfire({
    token   : '7f3e8b9c4caff6db3ac20d7afe93c88c59e17736',
    account : 'challengepost',
    ssl: true
  })
});

process.on('uncaughtException', function (err) {
  system.puts('Caught exception: ' + err);

  for (i = 0; i < ROOMS.length; i++) {
    listen(ROOMS[i]);
  }
});

var instance = johnny5.campfire;


// publish
var publish = function(room_id, message) {
  instance.user(message.user_id, function(data) {
    message.user = data.user;
    client.publish(room_id, JSON.stringify(message));
  });
}

// handle message based on its type
var handle_message = function(room, message) {

  var handle_type = function() {
    var TextMessage = function(room, message) {
      johnny5.obey(message, function(response) {
        if (response) {
          room.message(response.body, response.type, function(data) {
            system.puts(JSON.stringify(data))
          })
        } else {
      //      publish(room_id, message);
      }
      });
    };

    var KickMessage = function(room, message) {
      instance.user(message.user_id, function(data) {
        system.puts("KICK MESSAGEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE: " + data.user.name + " in room " + room.name);
      });
    };

    var PasteMessage = function(room, message) {
    //      publish(room_id, message);
    }

    var EnterMessage = function(room, message) {
      instance.user(message.user_id, function(data) {
        system.puts(data.user.name + " entered the room " + room.name);
      });
    }

    return {
      TextMessage: TextMessage,
      KickMessage: KickMessage,
      PasteMessage: PasteMessage,
      EnterMessage: EnterMessage,
      LeaveMessage: KickMessage
    }
  }

  system.puts("new message");

  handle_type()[message.type](room, message);
}


// subscribe to redis
var subscribe = function(room_id) {
  socket.on('connection', function(client) {
    const subscribe = redis.createClient();
    subscribe.subscribe(room_id);

    subscribe.on("message", function(channel, message) {
      client.send(message);
    });

    client.on('message', function(msg) {
      });

    client.on('disconnect', function() {
      subscribe.quit();
    });
  });
}

// subscribe, join and listen to a room
var listen = function(room_id) {
  instance.room(room_id, function(room) {
    room.join(function() {
      //      subscribe(room_id);
      room.listen(function(message) {
        handle_message(room, message);
      });
    });
  });
}


///////////////////////////////////////////////////////

for (i = 0; i < ROOMS.length; i++) {
  listen(ROOMS[i]);
}

