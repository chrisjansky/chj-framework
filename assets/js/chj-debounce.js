// Source: davidwalsh.name/orientation-change

$(window).on("resize orientationchange", function() {
  clearTimeout(this.id)
  
  this.id = setTimeout(function() {
    console.log(this)
  }, durBasic)
});