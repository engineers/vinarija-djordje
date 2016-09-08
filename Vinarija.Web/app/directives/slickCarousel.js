app.directive('slickCarousel', function ($timeout, $compile) {
    return {
        restrict: 'E',
        scope: {
            dots: '=',
            prevArrow: '@',
            nextArrow: '@'
        },
        link: function (scope, element, attrs) {
            scope.initialized = true;

            var initiateSlider = function () {
                element.slick({
                    infinite: true,
                    dots: scope.dots,
                    prevArrow: $('.' + scope.prevArrow),
                    nextArrow: $('.' + scope.nextArrow),
                    swipe: false,
                    fade: true,
                    speed: 1000,
                    autoplay: true,
                    autoplaySpeed: 4000,
                    pauseOnHover: false
                });
            };

            $timeout(function () {
                initiateSlider();
            }, 200);

            //$(window).bind('resize', function () {
            //    if ($(window).width() < 935) {
            //        if (scope.initialized) {
            //            scope.initialized = false;
            //            initiateSlider();
            //        }
            //    }
            //    else if (element.hasClass('slick-initialized')) {
            //        scope.initialized = true;
            //        element.slick('unslick');
            //    }
            //});
        }
    }
});