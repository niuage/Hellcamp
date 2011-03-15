var system   = require('sys');
var Campfire = require('./campfire').Campfire;



const PORT = 3000;
const HOST = 'localhost';

var express = require('express');

var app = module.exports = express.createServer();

app.use(express.static(__dirname + '/public'));

const redis = require('redis');
const client = redis.createClient();

const io = require('socket.io');

app.listen(PORT, HOST);
console.log("Express server listening on port %d", app.address().port)

const socket  = io.listen(app);

var instance = new Campfire({
  token   : 'b4d5d35d5b76618ffdb9e0cec9af2d211c61842a',
  account : 'challengepost',
  ssl: true
});

rooms = [348877, 357538, 335436, 273935, 360348, 301042]

var listen = function(room_id) {
  instance.room(room_id, function(room) {
    room.join(function() {
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
      room.listen(function(message) {
        instance.user(message.user_id, function(data) {
          message.user = data.user;
          client.publish(room_id, JSON.stringify(message));
        })
      });
    });
  });
}

for (i = 0; i < rooms.length; i++) {
  listen(rooms[i]);
}