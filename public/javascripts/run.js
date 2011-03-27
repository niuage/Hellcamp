var system   = require('sys');
var Server = require("./servers/server").Server;
var Bot = require('./bots/bot').Bot;
var Campfire = require("./libs/campfire").Campfire
var J5 = require("./engines/j5").J5
var Pivotal = require("./engines/pivotal").Pivotal
var Weather = require("./engines/weather").Weather
var Flickr = require("./engines/flickr").Flickr
var BoomStore = require("./engines/boom_store").BoomStore
var Translation = require("./engines/translation").Translation

var server = new Server({
  port: 3000,
  host: 'localhost'
});

// ENGINES
var flickr = new Flickr({
  
  }),
weather = new Weather({
  weather_api: {
    credentials: {
      key: 'c5289d5b3b5fd943',
      secret: '1245671229'
    },
    default_location: "10014"
  }
}),
pivotal = new Pivotal({}),
boom_store = new BoomStore({}),
translation = new Translation({}),
j5 = new J5({});


johnny5 = new Bot({
  engines: [j5, translation, pivotal, boom_store, flickr, weather],
  campfire: new Campfire({
    token: 'ea9f77add0b6ba0aa54e79d7c1111aabbf9aec01',
    account: "niuage",
    //    token   : '7f3e8b9c4caff6db3ac20d7afe93c88c59e17736',
    //    account : 'challengepost',
    ssl: true
  }),
  //  rooms: [348877, 360348, 273935, 357538]
  rooms: [169602]
});

bot = server.add_bot(johnny5);

server.start();

process.on('uncaughtException', function (err) {
  system.puts('Caught exception: ' + err);
// find a way to see if we're still listening to the rooms after the uncaught exception
// server.start();
});