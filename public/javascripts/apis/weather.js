  // need to use YQL and yahoo api, this is crap

var system   = require('sys');
var Api = require("./api").Api;
var LibXml = require("libxmljs");
var prototype = require("prototype"); Object.extend(global, prototype);


var WeatherApi = Class.create(Api, {

  initialize: function($super, opts) {
    opts = $H({
      version: "1.0",
      host: "xoap.weather.com",
      path: "/",
      default_location: "10014"
    }).merge(opts || {}).toObject();
    $super(opts);

    this.version  = opts.version;
    this.host     = opts.host;
    this.path     = opts.path;
    this.location = opts.default_location;

    this.parser = LibXml;
  },

  options: function(opts) {
    return this.merge({
      par: this.secret,
      key: this.key
    }, opts);
  },

  command: function(params) {
    var opts, p = null;
    if (params[0]) {
      opts = params[0].replace(/^:/, ""),
      p = params[1];
    } else {
      p = params[1];
    }
    return {
      opts: opts,
      params: p
    }
  },

  search: function(params, callback) {
    var command = this.command(params);

    switch(command.opts) {
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
        this.forecast(command, callback)
        break;
      case "codes":
        this.location_codes(command.params, callback);
        break;
      default:
        this.current_conditions(command, callback);
        break;
    }
  },

  conditions: function(command, options, summary, callback) {
    var self = this;
    command.params = command.params || this.location;
    this.get(this.template("weather/local/<%location%>", {
      location: command.params
    }), this.options(options),
      null,
      function(data) {
        data =  self.parser.parseXmlString(data);
        var weather = null;
        if ((weather = data.get("/weather"))) {
          summary.apply(self, [command, weather, callback]);
        } else if (data.get("/error")) {
          self.location_codes.apply(self, [command.params, callback]);
        }
      });
  },

  forecast: function(command, callback) {
    this.conditions(
      command,
      {
        dayf: command.opts,
        prod: "xoap"
      },
      this.forecast_summary,
      callback
      );
  },

  current_conditions: function(command, callback) {
    this.conditions(
      command,
      {
        cc: 1,
        prod: "xoap"
      },
      this.cc_summary,
      callback
      );
  },

  forecast_summary: function(command, weather, callback) {
    var days = weather.find("//day");
    var day = days[parseInt(command.opts) - 1].find("./part")[0];
    this.condition_template(weather, day, callback);
  },

  cc_summary: function(command, weather, callback) {
    this.condition_template(weather, weather.get("./cc"), callback);
  },

  icon: function(icon) {
    return this.template("http://niuage.fr/weather/93x93/<%icon%>.png", {
      icon: icon
    })
  },

  condition_template: function(weather, day, callback) {
    var location = weather.get("./loc"),
    wind = day.get("./wind");

    callback({
      body: this.icon(day.get("./icon").text())
    })
    var summary = this.template(
      [
      "Location:\n\t<%location%>, <%time%>",
      "Temperature:\n\t<%temp%><%feel%>",
      "Wind:\n\tFrom <%wind_direction%> at <%wind_speed%>mph gusting at <%wind_gust%>",
      "Humidity:\n\t<%humidity%>%"
      ].join("\n")
      ,
      {
        location: location.get("./dnam").text(),
        time: location.get("./tm").text(),
        feel: day.get("./t").text(),
        temp: (temp = day.get("./tmp")) ? temp.text() + "F " : "",
        wind_speed: wind.get("./s").text(),
        wind_direction: wind.get("./t").text(),
        wind_gust: wind.get("./gust").text(),
        humidity: day.get("./hmid").text()
      })
    callback({
      body: summary,
      type: "PasteMessage"
    });
  },

  location_codes: function(location, callback) {
    var self = this;
    this.get("search/search", this.options({
      where: location
    }),
    null,
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