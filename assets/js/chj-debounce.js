var
  resizeTrigger;

// Debounce resize.
$(window).on("resize orientationChanged", function() {
  clearTimeout(resizeTrigger);
  resizeTrigger = setTimeout(function() {
    // Do something.
  }, durationBasic);
});