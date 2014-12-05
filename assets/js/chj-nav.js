// Mobile navigation toggle.
$("[data-nav]")
  .on("click", function(event) {
    event.preventDefault();
    $(this).toggleClass("nav--is-open");
  });