var system   = require('sys');
var Server = require("./server").Server;
var Bot = require('./bot').Bot;
var Campfire = require("./campfire").Campfire
var J5 = require("./j5").J5

var server = new Server({
  port: 3000,
  host: 'localhost'
});

johnny5 = new Bot({
  engines: [new J5()],
  campfire: new Campfire({
    token   : '7f3e8b9c4caff6db3ac20d7afe93c88c59e17736',
    account : 'challengepost',
    ssl: true
  }),
  rooms: [348877]
});

bot = server.add_bot(johnny5);

server.start();

process.on('uncaughtException', function (err) {
  system.puts('Caught exception: ' + err);
  server.start();
});