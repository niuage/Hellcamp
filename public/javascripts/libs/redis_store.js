var system   = require('sys');
const redis = require('redis');

var RedisStore = function(options) {
  this.client = redis.createClient();
}

RedisStore.prototype.command = function(params, callback) {
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
  this.client.set(key.join(":"), value, function(err, reply) {
    system.puts("REDIS: " + reply);
    callback({
      body: reply
    });
  });
}

RedisStore.prototype.rget = function(key, callback) {
  this.client.get(key.join(":"), function(err, reply) {
    callback({
      body: reply ? reply.toString() : "(nil)"
    });
    system.puts("REDIS: " + reply);
  });
}

RedisStore.prototype.append = function(key, value, callback) {
  this.client.append(key.join(":"), value, function(err, reply) {
    callback({
      body: reply ? reply.toString() : "(nil)"
    });
    system.puts("REDIS: " + reply);
  });
}

RedisStore.prototype.new_order = function(message, params, callback) {
  order = params[0];
  this.rset([order], "", callback);
  this.rset(["current_order"], order, function() {});
  this.append(["orders"], order, function() {});
}

RedisStore.prototype.order = function(message, params, callback) {
  var self = this;
  system.puts("call order");
  self.client.get(["current_order"].join(":"), function(err, order) {
    if (order) {
      self.client.exists([order, message.user_id].join(":"), function(err, exist) {
        if (!exist) {
          self.client.append([order, "ids"].join(":"), function() {
            
            });
        }
        self.client.set([order, message.user_id].join(":"), params[0], function(err, ordered) {
          callback({
            body: ordered ? ordered.toString() : "(nil)"
          });
        });
      })
    }
  });
}

RedisStore.prototype.myorder = function(message, params, callback) {
  var client = this.client;
  client.get(["current_order"], function(err, order) {
    if (order) {
      client.get([order, message.user_id].join(":"), function(err, order) {
        callback({
          body: order ? order : "Empty"
        })
      })
    }
  });
}

RedisStore.prototype.getorder = function(message, params, callback) {
  var self = this;
  self.client.get(["current_order"].join(":"), function(err, order) {
    if (order) {
      self.client.get([order, "ids"].join(":"), function(err, ids) {
        if ((ids = ids.split(":"))) {
          res = "";
          for (i in ids) {
            if (ids[i]) {
              self.client.get([order, ids[i]], function(err, myorder) {
                res += myorder + " -- ";
                if (i == ids.length) {
                  callback({
                    body: res
                  })
                }
              })
            }
          }
        }
      })
    }
  });
}

exports.RedisStore = RedisStore;