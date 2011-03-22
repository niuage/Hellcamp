var system   = require('sys');
const redis = require('redis');

var MyRedis = function(options) {
  this.client = redis.createClient();
}

MyRedis.prototype.command = function(params, callback) {
  params = params[0].split(" ");
  if (params.length <= 1) {
    callback({
      body: "Invalid parameters"
    });
    return null;
  }
  return {
    key: params [0],
    value: params.slice(1, params.length).join(" ")
  }
}

MyRedis.prototype.set = function(message, params, callback) {
  var command = null;
  if ((command = this.command(params)))
    this.rset([message.user_id, command.key], command.value, callback);
}

MyRedis.prototype.gset = function(message, params, callback) {
  var command = null;
  if ((command = this.command(params)))
    this.rset([command.key], command.value, callback);
}

MyRedis.prototype.get = function(message, params, callback) {
  this.rget([message.user_id, params[0]], callback);
}
MyRedis.prototype.gget = function(message, params, callback) {
  this.rget([params[0]], callback);
}

MyRedis.prototype.rset = function(key, value, callback) {
  this.client.set(key.join(":"), value, function(err, reply) {
    system.puts("REDIS: " + reply);
    callback({
      body: reply
    });
  });
}

MyRedis.prototype.rget = function(key, callback) {
  this.client.get(key.join(":"), function(err, reply) {
    callback({
      body: reply ? reply.toString() : "(nil)"
    });
    system.puts("REDIS: " + reply);
  });
}

exports.MyRedis = MyRedis;