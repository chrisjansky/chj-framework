document.onreadystatechange = function() {

  if (document.readyState === "complete" && isDesktop()) {

    var config = {
      selector: "[data-parallax]",
      scrollSpeed: .25,
      triggerOffset: .05
    }

    // Detect CSS Transform
    var cssTransform = (function() {
      var
        prefixes = "transform webkitTransform mozTransform oTransform msTransform".split(" "),
        el = document.createElement("div"),
        cssTransform,
        i = 0

      while (cssTransform === undefined) { 
        cssTransform = document.createElement("div").style[prefixes[i]] != undefined ? prefixes[i] : undefined
        i++
      }
      return cssTransform
     })();

    // Detect request animation frame
    var
      scroll = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame || function(callback){ window.setTimeout(callback, 1000/60) },
      lastPosition = -1,
      wHeight,
      elements = document.querySelectorAll(config.selector),
      elAmount = elements.length,
      matrix = []

    // Pre calculate sizes to get better perfs
    getParams = function() {
      wHeight = window.innerHeight
      trigger = Math.round(wHeight * config.triggerOffset)
      lastPosition = -1 // Force a recalculation

      var i = 0
      for (i = 0; i < elAmount; i++) {
        matrix[i] = matrix[i] || { el: elements[i] }

        // Reinit 
        matrix[i].el.style.display = "block"

        // Start at 0 if it's the first in array
        matrix[i].start = matrix[i-1] ? $(matrix[i].el).parent().offset().top - trigger : 0
        matrix[i].stop = matrix[i].start + matrix[i].el.parentNode.offsetHeight + trigger
      }
    }

    function setTop(m, t) {
      if (cssTransform)
        m.el.style[cssTransform] = "translate3d(0, "+ t +"px,0)"
      else
        m.el.style["top"] = t
    }

    function loop() {
      // Avoid calculations if not needed
      if (lastPosition == window.pageYOffset) {
        scroll(loop)
        return false
      } else lastPosition = window.pageYOffset

      var i = 0
      for (i = 0; i < elAmount; i++) {

        // Check if visible
        if (lastPosition >= matrix[i].start - wHeight && lastPosition <= matrix[i].stop){
          matrix[i].el.style.display = "block"

          setTop(matrix[i], (matrix[i].start - lastPosition) * config.scrollSpeed)
        } else {
          matrix[i].el.style.display = "none"
        }
      }
      scroll(loop)
    }

    // Init
    getParams()
    loop()

    // Get parameters again on resize debounce
    $(window).on("resize orientationchange", function() {
      clearTimeout(this.id)
      this.id = setTimeout(function() {
        getParams()
      }, durBasic)
    });

  }
  
}