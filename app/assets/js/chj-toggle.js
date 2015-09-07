$("[data-toggle]")
  .on("click", function() {
    var
      $thisEl = $(this),
      targetAttr = $thisEl.attr("data-target"),
      $destinationEl;

    // If data-target attribute provided.
    if (targetAttr) {
      // If data-target found among siblings.
      if ($thisEl.siblings(targetAttr).length > 0) {
        $destinationEl = $thisEl.siblings(targetAttr)
      } else {
        // Find data-target going up the DOM.
        $destinationEl = $thisEl.closest(targetAttr);
      }
    } else {
      // If data-target missing, assume $this.
      $destinationEl = $thisEl;
    }

    $destinationEl
      .toggleClass($thisEl.attr("data-toggle"));
  });
