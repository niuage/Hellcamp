$(function() {
  $.extend(Array.prototype, {
    returnFirstApplication: function(iterator) {
      var result;
      for (i = 0; i < this.length; i++) {
        if (result = iterator(this[i])) {
          return result;
        }
      }
      return result;
    }
  });

  $.K = function(x) {
    return x;
  }



  $.extend(String, {
    /**
   *  String.interpret(value) -> String
   *
   *  Coerces `value` into a string. Returns an empty string for `null`.
  **/
    interpret: function(value) {
      return value == null ? '' : String(value);
    },
    specialChar: {
      '\b': '\\b',
      '\t': '\\t',
      '\n': '\\n',
      '\f': '\\f',
      '\r': '\\r',
      '\\': '\\\\'
    }
  });


  $.extend(String.prototype, (function() {

    function prepareReplacement(replacement) {
      if ($.isFunction(replacement)) return replacement;
      return function(match) {
        return Template.evaluate(replacement, null, match)
      };
    }

    function gsub(pattern, replacement) {
      var result = '', source = this, match;
      replacement = prepareReplacement(replacement);

      if ($.type(pattern) == "string")
        pattern = RegExp.escape(pattern);

      if (!(pattern.length || pattern.source)) {
        replacement = replacement('');
        return replacement + source.split('').join(replacement) + replacement;
      }

      while (source.length > 0) {
        if (match = source.match(pattern)) {
          result += source.slice(0, match.index);
          result += String.interpret(replacement(match));
          source  = source.slice(match.index + match[0].length);
        } else {
          result += source, source = '';
        }
      }
      return result;
    }

    function sub(pattern, replacement, count) {
      replacement = prepareReplacement(replacement);
      count = ($.type(count) === "undefined") ? 1 : count;

      return this.gsub(pattern, function(match) {
        if (--count < 0) return match[0];
        return replacement(match);
      });
    }

    function scan(pattern, iterator) {
      this.gsub(pattern, iterator);
      return String(this);
    }

    function truncate(length, truncation) {
      length = length || 30;
      truncation = ($.type(truncation) === "undefined") ? '...' : truncation;
      return this.length > length ?
      this.slice(0, length - truncation.length) + truncation : String(this);
    }

    function strip() {
      return this.replace(/^\s+/, '').replace(/\s+$/, '');
    }

    function stripTags() {
      return this.replace(/<\w+(\s+("[^"]*"|'[^']*'|[^>])+)?>|<\/\w+>/gi, '');
    }

    function stripScripts() {
      return this.replace(new RegExp(Prototype.ScriptFragment, 'img'), '');
    }

    function extractScripts() {
      var matchAll = new RegExp(Prototype.ScriptFragment, 'img'),
      matchOne = new RegExp(Prototype.ScriptFragment, 'im');
      return (this.match(matchAll) || []).map(function(scriptTag) {
        return (scriptTag.match(matchOne) || ['', ''])[1];
      });
    }

    function evalScripts() {
      return this.extractScripts().map(function(script) {
        return eval(script)
      });
    }

    function escapeHTML() {
      return this.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    }

    function unescapeHTML() {
      return this.stripTags().replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
    }


//    function toQueryParams(separator) {
//      var match = this.strip().match(/([^?#]*)(#.*)?$/);
//      if (!match) return { };
//
//      return match[1].split(separator || '&').inject({ }, function(hash, pair) {
//        if ((pair = pair.split('='))[0]) {
//          var key = decodeURIComponent(pair.shift()),
//          value = pair.length > 1 ? pair.join('=') : pair[0];
//
//          if (value != undefined) value = decodeURIComponent(value);
//
//          if (key in hash) {
//            if (!Object.isArray(hash[key])) hash[key] = [hash[key]];
//            hash[key].push(value);
//          }
//          else hash[key] = value;
//        }
//        return hash;
//      });
//    }

    function toArray() {
      return this.split('');
    }

    function succ() {
      return this.slice(0, this.length - 1) +
      String.fromCharCode(this.charCodeAt(this.length - 1) + 1);
    }

    function times(count) {
      return count < 1 ? '' : new Array(count + 1).join(this);
    }

    function camelize() {
      return this.replace(/-+(.)?/g, function(match, chr) {
        return chr ? chr.toUpperCase() : '';
      });
    }

    function capitalize() {
      return this.charAt(0).toUpperCase() + this.substring(1).toLowerCase();
    }

    function underscore() {
      return this.replace(/::/g, '/')
      .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
      .replace(/([a-z\d])([A-Z])/g, '$1_$2')
      .replace(/-/g, '_')
      .toLowerCase();
    }

    function dasherize() {
      return this.replace(/_/g, '-');
    }

//    function inspect(useDoubleQuotes) {
//      var escapedString = this.replace(/[\x00-\x1f\\]/g, function(character) {
//        if (character in String.specialChar) {
//          return String.specialChar[character];
//        }
//        return '\\u00' + character.charCodeAt().toPaddedString(2, 16);
//      });
//      if (useDoubleQuotes) return '"' + escapedString.replace(/"/g, '\\"') + '"';
//      return "'" + escapedString.replace(/'/g, '\\\'') + "'";
//    }

//    function toJSON() {
//      return this.inspect(true);
//    }

//    function unfilterJSON(filter) {
//      return this.replace(filter || Prototype.JSONFilter, '$1');
//    }

    function isJSON() {
      var str = this;
      if (str.blank()) return false;
      str = this.replace(/\\./g, '@').replace(/"[^"\\\n\r]*"/g, '');
      return (/^[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]*$/).test(str);
    }

//    function evalJSON(sanitize) {
//      var json = this.unfilterJSON();
//      try {
//        if (!sanitize || json.isJSON()) return eval('(' + json + ')');
//      } catch (e) { }
//      throw new SyntaxError('Badly formed JSON string: ' + this.inspect());
//    }

    function include(pattern) {
      return this.indexOf(pattern) > -1;
    }

    function startsWith(pattern) {
      return this.lastIndexOf(pattern, 0) === 0;
    }

    function endsWith(pattern) {
      var d = this.length - pattern.length;
      return d >= 0 && this.indexOf(pattern, d) === d;
    }

    function empty() {
      return this == '';
    }

    function blank() {
      return /^\s*$/.test(this);
    }

    function interpolate(object, pattern) {
      return Template.evaluate(this, pattern, object);
    }

    return {
      gsub:           gsub,
      sub:            sub,
      scan:           scan,
      truncate:       truncate,
      strip:          String.prototype.trim || strip,
      stripTags:      stripTags,
      stripScripts:   stripScripts,
      extractScripts: extractScripts,
      evalScripts:    evalScripts,
      escapeHTML:     escapeHTML,
      unescapeHTML:   unescapeHTML,
//      toQueryParams:  toQueryParams,
//      parseQuery:     toQueryParams,
      toArray:        toArray,
      succ:           succ,
      times:          times,
      camelize:       camelize,
      capitalize:     capitalize,
      underscore:     underscore,
      dasherize:      dasherize,
//      inspect:        inspect,
//      toJSON:         toJSON,
//      unfilterJSON:   unfilterJSON,
      isJSON:         isJSON,
//      evalJSON:       evalJSON,
      include:        include,
      startsWith:     startsWith,
      endsWith:       endsWith,
      empty:          empty,
      blank:          blank,
      interpolate:    interpolate
    };
  })());

  var Template = {

    evaluate: function(_template, _pattern, object) {
      template = _template.toString();
      pattern = _pattern || Template.Pattern;

      //      if (object && $.isFunction(object.toTemplateReplacements))
      //        object = object.toTemplateReplacements();

      return template.gsub(pattern, function(match) {
        if (object == null) return (match[1] + '');

        var before = match[1] || '';
        if (before == '\\') return match[2];

        var ctx = object, expr = match[3],
        pattern = /^([^.[]+|\[((?:.*?[^\\])?)\])(\.|\[|$)/;

        match = pattern.exec(expr);
        if (match == null) return before;

        while (match != null) {
          var comp = match[1].startsWith('[') ? match[2].replace(/\\\\]/g, ']') : match[1];
          ctx = ctx[comp];
          if (null == ctx || '' == match[3]) break;
          expr = expr.substring('[' == match[3] ? match[1].length : match[0].length);
          match = pattern.exec(expr);
        }

        return before + String.interpret(ctx);
      });
    }
  };
  Template.Pattern = /(^|.|\r|\n)(#\{(.*?)\})/;

})