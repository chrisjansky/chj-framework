var
  carouselStartClass = "carousel--start",
  carouselEndClass = "carousel--end",
  carouselArrowDisabledClass = "arrow--is-disabled"

$("[data-carousel]").each(function(index, instance) {
  var carouselSwiper = new Swiper(instance, {
    slidesPerView: "auto",
    calculateHeight: true,
    keyboardControl: true,
    visibilityFullFit: true,

    onFirstInit: function(swiper) {
      carouselPosition(swiper);
    },

    onSlideChangeStart: function(swiper) {
      carouselPosition(swiper);
    },

    onSlideReset: function(swiper) {
      carouselPosition(swiper);
    }
  });

  $(instance).find("[data-swiper--prev]").on("click", function(event) {
    event.preventDefault();
    carouselSwiper.swipePrev();
  });
  $(instance).find("[data-swiper--next]").on("click", function(event) {
    event.preventDefault();
    carouselSwiper.swipeNext();
  });

});

function carouselPosition(instance) {
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