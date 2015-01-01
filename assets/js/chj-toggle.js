$("[data-toggle]")
  .on("click", function() {
    var targetEl = $(this).attr("data-target") || $(this);
    targetEl
      .toggleClass($(this).attr("data-toggle"));
  });
