(function($) {
  var url = function() {
    var opened_rooms = function() {
      var rooms = []
      $(".room").each(function() {
        rooms.push($(this).attr("data-id"));
      })
      return rooms.join("-");
    }

    return {
      rooms: opened_rooms
    }
  }

  var room = function() {

    var open = function() {

    }

    var close = function() {

    }

    return {
      open: open,
      close: close
    }
  }

  var loadState = function(state) {
    var controller = state.controller,
    params = state.params.split("-");

    $.each(params, function(i, elt) {
      
    });
  }

  window.onpopstate = function(event) {
    var state = event.state;
    loadState(state);
  };
})(jQuery)