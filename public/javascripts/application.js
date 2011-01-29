// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults

$(function() {
  $("form.send_message").live("submit", function(e) {
    var form = $(this);
    $.ajax({
      url: form.attr("action"),
      data: form.serialize(),
      type: "POST",
      dataType: "script"
    });
    e.preventDefault();
  })
})