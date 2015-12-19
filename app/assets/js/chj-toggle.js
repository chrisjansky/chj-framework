$("[data-toggle]").on("click", function(event) {
  event.preventDefault();
  
  var
    $thisEl = $(this),
    targetAttr = $thisEl.attr("data-target"),
    $destinationEl;

  // If data-target attribute provided.
  if (targetAttr) {

    // If data-target found among siblings.
    if ($thisEl.siblings(targetAttr).length > 0) {
      $destinationEl = $thisEl.siblings(targetAttr);

    // Find data-target going up the DOM.
    } else if ($thisEl.closest(targetAttr).length > 0) {
      $destinationEl = $thisEl.closest(targetAttr);

    // Find all instances in the document.
    } else {
      $destinationEl = $(targetAttr);
    }

  } else {
    // If data-target missing, assume $this.
    $destinationEl = $thisEl;
  }

  $destinationEl
    .toggleClass($thisEl.attr("data-toggle"));
});
