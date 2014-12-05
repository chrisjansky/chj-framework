var
  sliderStartClass = "slider--start",
  sliderEndClass = "slider--end";

$("[data-slider]").each(function(index, instance) {
  var sliderSwiper = new Swiper(instance, {
    calculateHeight: true,
    keyboardControl: true,
    visibilityFullFit: true,

    onFirstInit: function(swiper) {
      $(swiper.container).addClass(sliderStartClass);
    },

    onSlideChangeStart: function(swiper) {
      sliderPosition(swiper);
    },

    onSlideReset: function(swiper) {
      sliderPosition(swiper);
    }
  });

  $(instance).find("[data-swiper--prev]").on("click", function(event) {
    event.preventDefault();
    sliderSwiper.swipePrev();
  });
  $(instance).find("[data-swiper--next]").on("click", function(event) {
    event.preventDefault();
    sliderSwiper.swipeNext();
  });

});

function sliderPosition(instance) {
  var
    firstIsActive = instance.activeIndex === 0,
    lastIsActive = (" " + instance.getLastSlide().className + " ").indexOf(" swiper-slide-visible ") > -1;

  $(instance.container)
    .toggleClass(sliderStartClass, firstIsActive)
    .toggleClass(sliderEndClass, lastIsActive);
}