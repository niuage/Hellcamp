(function($) {

  $.fn.incr = function(value) {
    return this.text(parseInt(this.text() || 0) + value);
  };

  $.fn.add_room = function(val, options) {
    var params = $.extend({
      selector: "room_"
    }, options),
    count = this.length;
    this.removeClass(params.selector + count).addClass(params.selector + (count + val));
    return $(".room");
  }

  $.fn.add_notification = function() {
    return this.each(function() {
      var notification = $(this).find(".notification");
      notification.incr(1).removeClass("hidden");
      $(document).incr_title_notifications(1);
    })
  }

  $.fn.remove_notifications = function() {
    return this.each(function() {
      var notification = $(this).find(".notification"),
      count = parseInt(notification.text());
      notification.addClass("hidden").text("0");
      if (count > 0) $(document).incr_title_notifications(-count);

    });
  }

  $.fn.incr_title_notifications = function(value) {
    var doc_title = this.attr("title");
    if (!doc_title.match(/\(\d\)/)) {
      doc_title =  doc_title + " (0)";
      this.attr("title", doc_title);
    }
    this.attr("title", doc_title.replace(/(\d+)/, function(n){
      return parseInt(n) + value
    }));
  }

  $.fn.post_message = function(data) {
    return this.each(function() {
      var room = $(this),
      tr = room.find(".template").clone().removeClass("template");

      tr.find(".user").html(data.user.name);
      tr.find(".message").html(data.body)

      tr.appendTo(room.find(".inner tbody"));

      room.find(".chat").scrollTo();
    })
  }

  $.fn.open = function() {
    var link = $(this),
    tab = link.parent(),
    url = link.attr("data-url"),
    rooms = $(".room"),
    count = rooms.length;

    tab.toggleClass("selected");
    if (tab.hasClass("selected")) {
      // open room
      $.ajax({
        url: url,
        data: {
          room_count: (count + 1)
        },
        dataType: "script",
        success: function() {
          rooms.add_room(1);
          $(".room .chat").scrollTo();
          window.history.pushState({

            }, "room", url)
        }
      });
    } else {
      // close room
      $("#" + link.attr("data-room")).remove();
      rooms.add_room(-1).find(".chat").scrollTo();
    }
  }

  

})(jQuery)

