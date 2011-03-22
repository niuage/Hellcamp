var room_ajax = null;

(function($) {

  $.fn.incr = function(value) {
    return this.text(parseInt(this.text() || 0) + value);
  };

  $.fn.add_room = function(val) {
    return this.resize_rooms(this);
  }

  $.fn.resize_rooms = function(_rooms) {
    var rooms = _rooms || $(".room");
    
    //    return rooms.attr("width", (($(window).width() - ( (rooms.length + 1) * 13 )) / rooms.length) + "px" );
    return rooms;
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

      if (data.user) {
        tr.find(".user").html(data.user.name.split(" ")[0]);
      }

      tr.find(".message").html( $.message.format(data.body) )

      tr.appendTo(room.find(".inner tbody"));

      room.find(".chat").scrollTo();
    })
  }

  $.room = function() {

    var open = function(id) {
      $("#main-nav").enable(false);
      
      var rooms = $(".room"),
      count = rooms.length,
      url = $.url().room().url(id);

      $.ajax({
        url: url,
        data: {
          room_count: (count + 1)
        },
        dataType: "script",
        complete: function() {
          $("#main-nav").enable(true);
        },
        success: function() {
          $(".tab-id-" + id).parent().addClass("selected");

          if (window.history.pushState) {
            window.history.pushState({
              action: "close",
              room: id
            },
            "rooms",
            "/rooms/" + $.url().room().opened()
              );
          }
              
          $(".room").add_room(1).find(".chat").scrollTo();
        }
      });
    };

    var close = function(id) {
      $(".room-id-" + id).remove();
      $(".tab-id-" + id).parent().removeClass("selected");
      $(".room").add_room(-1).find(".chat").scrollTo();

      if (window.history.pushState) {
        window.history.pushState({
          action: "open",
          room: id
        },
        "rooms",
        "/rooms/" + $.url().room().opened()
          );
      }
    };


    return {
      open: open,
      close: close
    }
  }

})(jQuery)

