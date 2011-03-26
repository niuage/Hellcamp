var system   = require('sys');
const redis = require('redis');

var RedisStore = function(options) {
  this.client = redis.createClient();
}

RedisStore.prototype.command = function(params, callback) {
  if (params.length <= 1) {
    callback({
      body: "Invalid parameters"
    });
    return null;
  }
  return {
    key: params.shift(),
    value: params.shift()
  }
}

RedisStore.prototype.set = function(message, params, callback) {
  var command = null;
  if ((command = this.command(params)))
    this.rset([message.user_id, command.key], command.value, callback);
}

RedisStore.prototype.gset = function(message, params, callback) {
  var command = null;
  if ((command = this.command(params)))
    this.rset([command.key], command.value, callback);
}

RedisStore.prototype.get = function(message, params, callback) {
  this.rget([message.user_id, params[0]], callback);
}
RedisStore.prototype.gget = function(message, params, callback) {
  this.rget([params[0]], callback);
}

RedisStore.prototype.rset = function(key, value, callback) {
  this.func("set", key, value, callback);
}

RedisStore.prototype.rget = function(key, callback) {
  this.func("get", key, null, callback);
}

RedisStore.prototype.append = function(key, value, callback) {
  this.func("append", key, value, callback);
}

RedisStore.prototype.func = function(func, key, value, callback) {
  var args = [key.join(":")]
  if (value) args.push(value);
  args.push(function(err, reply) {
    system.puts("called");
    callback({
      body: reply ? reply.toString() : "(nil)"
    });
    system.puts("REDIS: " + reply);
  });
  this.client[func].apply(this.client, args);
}

exports.RedisStore = RedisStore;