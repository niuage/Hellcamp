var system   = require('sys');
var Api = require("./api").Api;
var LibXml = require("libxmljs");

var WeatherApi = Api.extend({

  init: function(opts) {
    opts = opts || {}
    this._super(opts);

    this.version  = "1.0";
    this.host     = opts.host ||    "xoap.weather.com";
    this.path     = opts.path ||    "/";
    this.location = opts.default_location;

    this.parser = LibXml;
  },

  cc_options: function(params, action, opts) {
    return {
      action: this.template(action, {
        location: params[0]
      }),
      query: this.merge({
        par: this.secret,
        key: this.key
      }, opts)
    }
  },

  search: function(params, callback) {
    var self = this;
    var cc = this.cc_options(params, "weather/local/<%location%>", {
      cc: 1,
      prod: "xoap"
    });
    this.request(cc.action, cc.query, null,
      function(data) {
        data =  self.parser.parseXmlString(data);
        var error, weather = null;
        
        if ((weather = data.get("/weather"))) {
          self.weather_summary.apply(self, [weather, callback]);
        } else if ((error = data.get("/error"))) {
          self.location_codes.apply(self, [params, callback]);
        }
      }
      );
  },

  weather_summary: function(weather, callback) {
    var self = this;
    var location = weather.get("./loc"),
    cc = weather.get("./cc"),
    wind = cc.get("./wind");

    callback({
      body: self.template("http://niuage.fr/weather/93x93/<%icon%>.png", {
        icon: cc.get("./icon").text()
      })
    })
    var summary = self.template(
      [
      "Location:\n\t<%location%>, <%time%>",
      "Temperature:\n\t<%temp%>F, <%feel%>",
      "Wind:\n\tFrom <%wind_direction%> at <%wind_speed%>mph gusting at <%wind_gust%>",
      "Humidity:\n\t<%humidity%>%"
      ].join("\n")
      ,
      {
        location: location.get("./dnam").text(),
        time: location.get("./tm").text(),
        feel: cc.get("./t").text(),
        temp: cc.get("./tmp").text(),
        wind_speed: wind.get("./s").text(),
        wind_direction: wind.get("./t").text(),
        wind_gust: wind.get("./gust").text(),
        humidity: cc.get("./hmid").text()
      })
    callback({
      body: summary,
      type: "PasteMessage"
    });
  },

  location_codes: function(location, callback) {
    var self = this;
    var cc = this.cc_options(location, "search/search", {
      where: location[0]
    });
    this.request(cc.action, cc.query, null,
      function(data) {
        var results =  self.parser.parseXmlString(data).find("//loc");

        var codes = [];
        for (r in results) {
          var loc = results[r];
          codes.push(self.template("<%loc%>: <%locid%>", {
            locid: loc.attr("id").value(),
            loc: loc.text()
          }));
        }
        callback({
          body: codes.join(" | ")
        })
      });
  }

});

exports.WeatherApi = WeatherApi;