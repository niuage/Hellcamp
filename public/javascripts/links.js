var Autolink = {
  Patterns: {
    url:   /((href=(?:'|")?)?(https?:\/\/|\bwww\.)(\S+)(\/(?:\S+))?)//*'*/,
    email: /([\w\.!#\$%\-+.]+@[A-Za-z0-9\-]+(\.[A-Za-z0-9\-]+)+)/,
    emoji: /:([a-z0-9\+\-_]+):/
  },

  Emoji: {
    'sunny': '2600',
    'zap': '26a1',
    'leaves': '1f343',
    'lipstick': '1f483',
    'cop': '1f46c',
    'wheelchair': '267f',
    'fish': '1f413',
    'hammer': '1f52c',
    'moneybag': '1f4b0',
    'calling': '1f4f1',
    'memo': '1f4dd',
    'mega': '1f4e4',
    'gift': '1f4e7',
    'pencil': '270f',
    'scissors': '2702',
    'feet': '1f463',
    'runner': '1f6b6',
    'heart': '2764',
    'smoking': '1f6ac',
    'warning': '26a0',
    'ok': '1f502',
    'tm': '2122',
    'vs': '1f504',
    'new': '1f505',
    'bulb': '1f4a1',
    'zzz': '1f4a4',
    'sparkles': '2728',
    'star': '2b50',
    'mag': '1f520',
    'lock': '1f54b',
    'email': '1f4e8',
    'fist': '270a',
    'v': '270c',
    'punch': '1f446',
    '+1': '1f447',
    'clap': '1f44d',
    '-1': '1f44f'
  },

  Linkers: {
    url: function(string, tagOptions, replacement) {
      return Autolink.replaceURLs(string, function(url, extra) {
        var text = (replacement || $.K)(url);
        return '<a href="' + url + '"' +
        Autolink.htmlForTagOptions(tagOptions) + '>' +
        text + '</a>' + extra;
      });
    },

    email: function(string, tagOptions, replacement) {
      replacement = replacement || $.K;
      return string.gsub(Autolink.Patterns.email, function(match) {
        return '<a href="mailto:' + match[1] + '"' +
        Autolink.htmlForTagOptions(tagOptions) + '>' +
        replacement(match[1]) + '</a>';
      });
    },

    emoji: function(string, tagOptions, replacement) {
      replacement = replacement || $.K;
      return string.gsub(Autolink.Patterns.emoji, function(match) {
        code = Autolink.Emoji[match[1]];
        if (!code) return replacement(':' + match[1] + ':');
        return '<span class="emoji emoji' + code + '"></span>';
      });
    }
  },

  all: function(string, tagOptions, replacement) {
    for (var name in Autolink.Linkers)
      string = Autolink.Linkers[name](string, tagOptions, replacement);
    return string;
  },

  htmlForTagOptions: function(tagOptions) {
    var res = []
    $.each((tagOptions || {}), function(key, value) {
      res.push(key + '="' + value + '"');
    });
    return res.join(' ')
  },

  replaceURLs: function(string, replacement) {
    var extra = {};
    function trim(string) {
      if (!string) return;
      var pattern = /([^-0-9A-Za-z\/]+)$/, match;
      if (match = string.match(pattern))
        string = string.replace(pattern, '');
      extra.value = (match || [])[1];
      return string;
    }

    return string.gsub(Autolink.Patterns.url, function(match) {
      var all = match[1], existingLink = match[2], scheme = match[3],
      domain = match[4], path = match[5];
      if (existingLink) return all;
      if (scheme == 'www.') all = 'http://' + all;
      all = trim(all), path = trim(path);
      return replacement(all, extra.value || '');
    });
  },

  transform: function(message) {
    return this.all(message.escapeHTML(), {
      target: '_blank'
    },
    function(text) {
      return text.truncate(50, '&hellip;')
    }
    )
  }
};

//////////////////////////////////////////////////////////////////

var YoutubeVideoAutolink = {
  inlineYoutubeVideo: function(url, id) {
    return ('<a href="#{url}" class="image youtube_video" target="_blank">' +
      '<img src="http://img.youtube.com/vi/#{id}/0.jpg" /></a>').interpolate({
      url: url,
      id: id
    });
  },

  link: function(text, replacement) {
    var url = text.strip();
    var match = url.match(/^(?:http\S+[Yy][Oo][Uu][Tt][Uu][Bb][Ee]\.[Cc][Oo][Mm]\/watch\?v=)([\w-]+)(?:\S*)$/);
    if (!match) return false;
    return replacement(url, match[1]);
  },

  transform: function(message) {
    return this.link(message, $.proxy(this.inlineYoutubeVideo, this));
  }
};


//////////////////////////////////////////////////////////////////

var ImageAutolink = {
  image_url_match: function(text) {
    return text.strip().match(/^(http\S+(?:jpe?g|gif|png))(\?.*)?$/i)
  },

  inline_image: function(url) {
    return '<a href="'  + url + '" class="image loading" target="_blank">' +
    '<img src="' + url + ' /></a>';
  },

  link: function(text, replacement) {
    var match = this.image_url_match(text);
    if (!match) return false;
    return replacement(match[1]);
  },

  transform: function(message) {
    return this.link(message, $.proxy(function(url) {
      return this.inline_image(url)
    }, this))
  }
};