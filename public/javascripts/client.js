// publish
var publish = function(room_id, message) {
  instance.user(message.user_id, function(data) {
    message.user = data.user;
    client.publish(room_id, JSON.stringify(message));
  });
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