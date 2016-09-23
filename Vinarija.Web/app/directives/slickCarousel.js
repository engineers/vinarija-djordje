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
                    autoplaySpeed: 5000,
                    pauseOnHover: false
                });
            };
            if (!element.hasClass('responsive')) {
                $timeout(function () {
                    initiateSlider();
                }, 200);
            }

            if ($(window).width() < 769) {
                $('.responsive').slick({
                    infinite: true,
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    speed: 300,
                    autoplay: true,
                    autoplaySpeed: 5000,
                    pauseOnHover: false,
                    responsive: [
                       {
                           breakpoint: 769,
                           settings: {
                               slidesToShow: 3,
                               slidesToScroll: 2,
                           }
                       },
                       {
                           breakpoint: 690,
                           settings: {
                               slidesToShow: 1,
                               slidesToScroll: 1
                           }
                       }
                    ]
                });
            };
        }
    }
});