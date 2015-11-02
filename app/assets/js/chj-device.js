var currentDevice;

if (isDesktop()) {
  currentDevice = "desktop";

  $body.addClass("device--is-desktop");
} else {
  currentDevice = "mobile";

  $body.addClass("device--is-mobile");
}
