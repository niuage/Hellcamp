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
Bitly = require("./engines/bitly").Bitly,
Shout = require("./engines/shout").Shout;
Dribbble = require("./engines/dribbble").Dribbble;
Wolfram = require("./engines/wolfram").Wolfram;
Github = require("./engines/github").Github;
//Backpack = require("./engines/backpack").Backpack;

var server = new Server({
  port: 3003,
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
}),
wolfram = new Wolfram({
  wolfram_api: {
    credentials: {
      key: "T58EKE-35TP7JWUQY",
      secret: "Johnny5"
    }
  }
}),
github = new Github({
  github_api: {
    credentials: {
      key: "9f9301887a2846ad42c2ad751cff15aa",
      secret: "niuage"
    }
  }
}),
//backpack = new Backpack({
//  api: {
//    credentials: {
//      key: "23fe7819f4e5f60dabc04e4d236cf275d5edcdb4",
//      secret: "challengepost"
//    }
//  }
//}),
shout = new Shout({}),
dribbble = new Dribbble({}),
pivotal = new Pivotal({}),
boom_store = new BoomStore({}),
translation = new Translation({}),
wiki = new Wiki({}),
j5 = new J5({});


// BOT
johnny5 = new Bot({
  engines: [j5, wolfram, github, translation, weather, dribbble, shout, wiki, tmdb, bitly, pivotal, boom_store, flickr],
  campfire: new Campfire({
    token: 'ea9f77add0b6ba0aa54e79d7c1111aabbf9aec01',
    account: "niuage",
    //    token   : '7f3e8b9c4caff6db3ac20d7afe93c88c59e17736',
    //    account : 'challengepost',
    ssl: true
  }),
  //  rooms: [348877, 360348, 273935, 357538]
  rooms: [169602, 392773, 392800]
});

bot = server.add_bot(johnny5);
server.start();

//parser = require('optimist');
//argv = parser(["-b", "'allalalala ffw fwfew'", 'lalal', '--bold=false']).argv
//system.puts(system.inspect(argv));
//argv = parser(['-b', '2' ,'-z','dizzle']).argv
//system.puts(system.inspect(argv));

//process.on('uncaughtException', function (err) {
//  system.puts('Caught exception: ' + err);
//
//// check if we're still listening to the rooms after the uncaught exception
//// server.start();
//});