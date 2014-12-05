// Hide all content on load.
$("[data-accordion]").each(function() {
  $(this).find("dd").hide();
});

$("[data-accordion]").on("click", "dt > a", function(event) {
  event.preventDefault();

  var
    $parent = $(this).parent(),
    $target = $parent.next("dd"),
    $accordPanels = $parent.siblings("dd"),
    $accordTitles = $parent.siblings("dt");
  
  if(!$parent.hasClass("accordion--is-active")) {
    $accordPanels.slideUp(durationShort);
    $accordTitles.removeClass("accordion--is-active");
    $parent.addClass("accordion--is-active");
    $target.slideDown(durationBasic);
  } else {
    $accordPanels.slideUp(durationShort);
    $accordTitles.add($parent).removeClass("accordion--is-active");
  }
});

$("[data-accordion-opened]").click();