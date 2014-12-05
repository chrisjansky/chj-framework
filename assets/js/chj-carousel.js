var
  carouselStartClass = "carousel--start",
  carouselEndClass = "carousel--end";

$("[data-carousel]").each(function(index, instance) {
  var carouselSwiper = new Swiper(instance, {
    slideElement: "li",
    slidesPerView: "auto",
    calculateHeight: true,
    keyboardControl: true,
    visibilityFullFit: true,

    onFirstInit: function(swiper) {
      $(swiper.container).addClass(carouselStartClass);
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
    lastIsActive = (" " + instance.getLastSlide().className + " ").indexOf(" swiper-slide-visible ") > -1;

  $(instance.container)
    .toggleClass(carouselStartClass, firstIsActive)
    .toggleClass(carouselEndClass, lastIsActive);
}