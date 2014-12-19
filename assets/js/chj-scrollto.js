// Scroll to anchor.
$("[href*='#']").click(function() {
  window.location.hash = "section-" + this.hash.slice(1)

  $("html, body").animate({
    scrollTop: $($(this).attr("href")).offset().top
  }, durBasic);
  return false
});

// On load.
if (location.hash) {
  var smoothScrollTo = "#" + location.hash.slice(9)

  setTimeout(function() {
    $("html, body").animate({
      scrollTop: $(smoothScrollTo).offset().top
    }, durBasic);
  }, durShort)
}