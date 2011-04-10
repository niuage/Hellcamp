var system   = require('sys');
var Browser = require("../libs/browser").Browser;
var Engine = require("./engine").Engine;

var Food = Engine.extend({
  info: {
    name: "Food",
    version: 1
  },

  initialize: function(opts) {
    this._super();
    this.browser = new Browser({});
  },

  bind: function(bot) {
    this._super(bot);
    
  },

  neworder: function(message, params, callback) {
    this.store.new_order(message, params, callback);
  },

  order: function(message, params, callback) {
    this.store.order(message, params, callback);
  },

  myorder: function(message, params, callback) {
    this.store.myorder(message, params, callback);
  },

  getorder: function(message, params, callback) {
    this.store.getorder(message, params, callback);
  }
})

exports.Food = Food;

//RedisStore.prototype.new_order = function(message, params, callback) {
//  order = params[0];
//  this.rset([order], "", callback);
//  this.rset(["current_order"], order, function() {});
//  this.append(["orders"], order, function() {});
//}
//
//RedisStore.prototype.order = function(message, params, callback) {
//  var self = this;
//  system.puts("call order");
//  self.client.get(["current_order"].join(":"), function(err, order) {
//    if (order) {
//      self.client.exists([order, message.user_id].join(":"), function(err, exist) {
//        if (!exist) {
//          self.client.append([order, "ids"].join(":"), function() {
//
//            });
//        }
//        self.client.set([order, message.user_id].join(":"), params[0], function(err, ordered) {
//          callback({
//            body: ordered ? ordered.toString() : "(nil)"
//          });
//        });
//      })
//    }
//  });
//}
//
//RedisStore.prototype.myorder = function(message, params, callback) {
//  var client = this.client;
//  client.get(["current_order"], function(err, order) {
//    if (order) {
//      client.get([order, message.user_id].join(":"), function(err, order) {
//        callback({
//          body: order ? order : "Empty"
//        })
//      })
//    }
//  });
//}
//
//RedisStore.prototype.getorder = function(message, params, callback) {
//  var self = this;
//  self.client.get(["current_order"].join(":"), function(err, order) {
//    if (order) {
//      self.client.get([order, "ids"].join(":"), function(err, ids) {
//        if ((ids = ids.split(":"))) {
//          res = "";
//          for (i in ids) {
//            if (ids[i]) {
//              self.client.get([order, ids[i]], function(err, myorder) {
//                res += myorder + " -- ";
//                if (i == ids.length) {
//                  callback({
//                    body: res
//                  })
//                }
//              })
//            }
//          }
//        }
//      })
//    }
//  });
//}