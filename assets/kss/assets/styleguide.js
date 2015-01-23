var
  ref = $("[data-menu]").data("kss-ref"),
  $subMenu = $("[data-submenu]"),
  $menuItem = $("[data-menu-item]")

if ($subMenu.length) {
  $subMenu.appendTo($menuItem.eq(ref - 1));
}
