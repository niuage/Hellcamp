(function($) {
  
  $.url = function() {
    var room = function() {
      var url = function(id) {
        return "/rooms/" + id;
      }

      var opened = function(options) {
        var params = $.extend({
          array: false
        }, options || {})
        var rooms = []
        $(".room").each(function() {
          rooms.push(parseInt($(this).attr("data-id")));
        })
        return params.array ? rooms : rooms.join("-");
      }

      var link_to = function(current) {
        var rooms = opened({
          array: true
        }),
        index = -1;
        if ((index = rooms.indexOf(parseInt(current))) != -1) {
          rooms.splice(index, 1);
        } else {
          rooms.push(current);
        }
        return rooms.join("-");
      }

      return {
        opened: opened,
        link_to: link_to,
        url: url
      }
    }

    return {
      room: room
    }
  }

  var loadState = function(state) {
    //    alert("load_state => " + state.action + " " + state.room);
    
    if (state.action == "open") {
      $.room().open(state.room);
    } else {
      $.room().close(state.room);
    }
  }

  window.onpopstate = function(event) {
    var state = event.state;
//    alert(JSON.stringify(event.state));
    if (state) loadState(state);
  };
  
})(jQuery)
