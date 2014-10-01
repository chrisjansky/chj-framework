var
  resizeTrigger,
  durationLong = 500;

// Debounce resize.
$(window).on('resize orientationChanged', function() {
  clearTimeout(resizeTrigger);
  resizeTrigger = setTimeout(function() {
    // Do something.
  }, durationLong);
});

// jQuery hover.
selector
  .on("mouseenter", function() {
    $(this)
      // Do something.
  })
  .on("mouseleave", function() {
    $(this)
      // Do something;
  });