$("[data-cycle]").on("click", function(event) {
  event.preventDefault();

  var
    $thisEl = $(this),
    classArray = $thisEl.data("cycle").split(", "),
    currentClass = $thisEl.data("current") || 0,
    targetAttr = $thisEl.attr("data-target"),
    $destinationEl;

  classArray.unshift("");

  // If data-target attribute provided.
  if (targetAttr) {

    // If data-target found among siblings.
    if ($thisEl.siblings(targetAttr).length > 0) {
      $destinationEl = $thisEl.siblings(targetAttr);

    // Find data-target going up the DOM.
    } else if ($thisEl.closest(targetAttr) > 0) {
      $destinationEl = $thisEl.closest(targetAttr);

    // Find all instances in the document.
    } else {
      $destinationEl = $(targetAttr);
    }

  } else {
    // If data-target missing, assume $this.
    $destinationEl = $thisEl;
  }

  $destinationEl.removeClass(classArray[currentClass]);

  currentClass = (currentClass + 1) % classArray.length;

  $thisEl.data("current", currentClass);

  $destinationEl.addClass(classArray[currentClass]);
});
