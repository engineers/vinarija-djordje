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
                    pauseOnHover: false,
                    responsive: [
                        {
                            breakpoint: 1024,
                            settings: {
                                swipe: true,
                                fade: false,
                                speed: 500,
                            }
                        }
                    ]
                });
            };

            if (!element.hasClass('responsive')) {
                $timeout(function () {
                    initiateSlider();
                    gallerySlider();
                }, 200);
            }

            function gallerySlider() {
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
                                   dots: true,
                                   slidesToShow: 3,
                                   slidesToScroll: 2,
                                   swipe: true,
                               }
                           },
                           {
                               breakpoint: 690,
                               settings: {
                                   dots: true,
                                   slidesToShow: 1,
                                   slidesToScroll: 1,
                                   swipe: true,
                               }
                           }
                        ]
                    });
                };
            }

            $(window).bind('resize', function () {
                if ($(window).width() < 769) {
                    if (scope.initialized) {
                        scope.initialized = false;
                        gallerySlider();
                    }
                }
                else if ($('.responsive').hasClass('slick-initialized')) {
                    scope.initialized = true;
                    $('.responsive').slick('unslick');
                }
            });
        }
    }
});