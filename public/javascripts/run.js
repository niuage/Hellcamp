var system   = require('sys'),
Server = require("./servers/server").Server;

var server = new Server({
  source: "config/config.yml"
}).start();

//process.on('uncaughtException', function (err) {
//  system.puts('Caught exception: ' + err);
//
//// check if we're still listening to the rooms after the uncaught exception
//// server.start();
//});