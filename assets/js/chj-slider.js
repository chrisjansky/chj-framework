var
  sliderStartClass = "slider--start",
  sliderEndClass = "slider--end",
  carouselArrowDisabledClass = "arrow--is-disabled"

$("[data-slider]").each(function(index, instance) {
  var sliderSwiper = new Swiper(instance, {
    calculateHeight: true,
    keyboardControl: true,
    visibilityFullFit: true,

    onFirstInit: function(swiper) {
      sliderPosition(swiper);
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
    lastIsActive = instance.activeIndex === instance.slides.length - 1

  $(instance.container)
    .toggleClass(carouselStartClass, firstIsActive)
    .toggleClass(carouselEndClass, lastIsActive);

  $(instance.container)
    .find("[data-swiper--prev]")
    .toggleClass(carouselArrowDisabledClass, firstIsActive);

  $(instance.container)
    .find("[data-swiper--next]")
    .toggleClass(carouselArrowDisabledClass, lastIsActive);
}