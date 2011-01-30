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
  
  $(window).resize(function() {
    var chat = $(".chat-wrapper"),
    new_h = $(this).height() - chat.offset().top - $(".speak").outerHeight() - 24;
    
    chat.height(new_h);
  })

  $(window).resize();

})