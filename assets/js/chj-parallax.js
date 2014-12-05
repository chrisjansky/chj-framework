// Source: http://www.valdelama.com/easiest-parallax-in-the-world

$(window).scroll(function() {
  var scrollPos = $(window).scrollTop();
  $("[data-parallax]")
    .css("transform", "translateY(" + (scrollPos / 2) + "px)");
});