var system   = require('sys'),
Server = require("./servers/server").Server,
Bot = require('./bots/bot').Bot,
Campfire = require("./libs/campfire").Campfire,
J5 = require("./engines/j5").J5,
Pivotal = require("./engines/pivotal").Pivotal,
Weather = require("./engines/weather").Weather,
Flickr = require("./engines/flickr").Flickr,
BoomStore = require("./engines/boom_store").BoomStore,
Translation = require("./engines/translation").Translation,
Tmdb = require("./engines/tmdb").Tmdb,
Wiki = require("./engines/wiki").Wiki,
Bitly = require("./engines/bitly").Bitly;

var server = new Server({
  port: 3002,
  host: 'localhost'
});

// ENGINES
var flickr = new Flickr({
  flickr_api: {
    credentials: {
      key: "2bc972efba6309fe9376d55482ab32bb"
    }
  }
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
tmdb = new Tmdb({
  tmdb_api: {
    credentials: {
      key: "0feeb53d4f29c916ce155789b1cfda00"
    }
  }
}),
bitly = new Bitly({
  bitly_api: {
    credentials: {
      key: "R_c5731eaf90d0abfbda2c226e356a70c7",
      secret: "niuage2"
    }
  }
})
pivotal = new Pivotal({}),
boom_store = new BoomStore({}),
translation = new Translation({}),
wiki = new Wiki({}),
j5 = new J5({});


// BOT
johnny5 = new Bot({
  engines: [j5, translation, weather, wiki, tmdb, bitly, pivotal, boom_store, flickr],
  campfire: new Campfire({
    //        token: 'ea9f77add0b6ba0aa54e79d7c1111aabbf9aec01',
    //        account: "niuage",
    token   : '7f3e8b9c4caff6db3ac20d7afe93c88c59e17736',
    account : 'challengepost',
    ssl: true
  }),
  rooms: [348877, 360348, 273935, 357538]
  //  rooms: [169602]
});

bot = server.add_bot(johnny5);
server.start();

//process.on('uncaughtException', function (err) {
//  system.puts('Caught exception: ' + err);
//
//// check if we're still listening to the rooms after the uncaught exception
//// server.start();
//});