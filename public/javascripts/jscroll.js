;
(function() {
  $.fn.scrollTo = function() {
    return this.each(function(i) {
      var elt = $(this);
      elt.attr("scrollTop", elt.children().first().height());
    })
  }
})(jQuery);