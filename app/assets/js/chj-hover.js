// jQuery hover.
$("[data-hover]")
  .on("mouseenter", function() {
    $(this)
      .toggleClass("hover--is-active", true);
  })
  .on("mouseleave", function() {
    $(this)
      .toggleClass("hover--is-active", false);
  });