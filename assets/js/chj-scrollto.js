// Scroll to anchor.
$("[href*='#']").click(function() {
  $("html, body").animate(
    {
      scrollTop: $($(this).attr("href")).offset().top
    }, "slow");
  return false;
});

// On load.
if (location.hash) {
  var smoothScrollTo = "#anchor-" + location.hash.substring(1);
  setTimeout(function() {
    $("html, body").animate({
      scrollTop: $(smoothScrollTo).offset().top
    }, durationLong);
  }, durationShort);
}