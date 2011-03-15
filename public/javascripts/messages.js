
$(function() {

  $.message = {

    format: function(message) {
      return [ImageAutolink, YoutubeVideoAutolink, Autolink].returnFirstApplication(function(transformer) {
          return transformer.transform(message);
        });
    },
    

    kindOfMessage: function(message) {
      if (message.match(/\r|\n/))
        return 'paste';

      if (message.strip().match(/^http\S+twitter\.com\/(?:#!\/)?\w+\/status(?:es)?\/\d+$/i))
        return 'tweet';

      return 'text';
    }

  }

  
  
})