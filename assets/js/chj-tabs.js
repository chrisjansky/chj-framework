// Open the first item on load.
$("[data-tabs]").each(function() {
  $(this).children("li").first().children("a").addClass("tab--is-active").next().addClass("tab--is-open");
});

$("[data-tabs]").on("click", "li > a", function(event) {
  event.preventDefault();
  var $tabItem = $(this);

  if (!$tabItem.hasClass("tab--is-active")) {
    var $tabList = $tabItem.closest("[data-tabs]");
    $tabList.find(".tab--is-open").removeClass("tab--is-open");

    $tabItem.next().toggleClass("tab--is-open");
    $tabList.find(".tab--is-active").removeClass("tab--is-active");
    $tabItem.addClass("tab--is-active");
  }
});