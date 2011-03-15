$(function() {
  $(".room-tab a").click(function(e) {
    if (!$("#main-nav").is_enabled()) return false;
    var current_id = $(this).attr("data-id"),
    link = $(this),
    tab = link.parent(),
    action = "open",
    ids = $.url().room().link_to(current_id);

    action = tab.hasClass("selected") ? "close" : "open"

    $.room()[action](current_id);

    return false;
  })
})