// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults

$(function() {

  $("form.send_message").live("submit", function(e) {
    var form = $(this),
    data = form.serialize();

    form.children("textarea").val("");
    $.ajax({
      url: form.attr("action"),
      data: data,
      type: "POST",
      dataType: "script"
    });
    e.preventDefault();
  })

  $("form.send_message textarea").live("keyup", function(e){
    if (e.keyCode === 13) {
      $(this).closest("form").submit();
    }
    return true;
  });

  $(window).resize(function() {
    var chat = $(".chat-wrapper");
    if (chat.length >= 1) {
      var new_h = $(this).height() - chat.offset().top - $(".speak").outerHeight() - 24;
      chat.height(new_h);
    }
  }).resize();

  $(".chat").scrollTo();

  $.fn.enable = function(bool) {
    return bool ? $(this).removeClass("disabled") : $(this).addClass("disabled");
  }
  $.fn.is_enabled = function() {
    return !this.hasClass("disabled")
  }

  //  $("#rooms > tbody > tr").sortable();
  $(".room").resizable({
    handles: "e, w"
  });

  $("td.message").html(function(i, html) {
    return $.message.format(html);
  })
})