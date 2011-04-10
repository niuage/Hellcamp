Engines = {
  J5: require("../engines/j5").J5,
  Pivotal: require("../engines/pivotal").Pivotal,
  Weather: require("../engines/weather").Weather,
  Flickr: require("../engines/flickr").Flickr,
  BoomStore: require("../engines/boom_store").BoomStore,
  Translation: require("../engines/translation").Translation,
  Tmdb: require("../engines/tmdb").Tmdb,
  Wiki: require("../engines/wiki").Wiki,
  Bitly: require("../engines/bitly").Bitly,
  Shout: require("../engines/shout").Shout,
  Dribbble: require("../engines/dribbble").Dribbble,
  Wolfram: require("../engines/wolfram").Wolfram,
  Github: require("../engines/github").Github
}

exports.Engines = Engines;