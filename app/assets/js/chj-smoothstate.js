;(function ($) {
  var
    $body = $("html, body"),
    $ssContainer = $("#js-smoothstate").smoothState({
      onStart: {
        duration: durShort,
        render: function ($container) {
          $container.addClass("is-exiting");

          $body.animate({
            scrollTop: 0
          });

          $ssContainer.restartCSSAnimations();
        }
      },
      onReady: {
        duration: 0,
        render: function ($container, $newContent) {
          $container.removeClass("is-exiting");

          $container.html($newContent);
        }
      }
    }).data("smoothState");
})(jQuery);
